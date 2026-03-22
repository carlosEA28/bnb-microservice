package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ecr"
	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ecs"
	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/rds"
	ecsx "github.com/pulumi/pulumi-awsx/sdk/v3/go/awsx/ecs"
	"github.com/pulumi/pulumi-docker-build/sdk/go/dockerbuild"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		// ECR ----------------------------------------------------------------------------

		services := []string{
			"auth-service",
			"booking-service",
			"payment-service",
			"propety-service",
			"webhooks-service",
		}

		ecrRepo, err := ecr.NewRepository(ctx, "microservices-repo", nil)
		if err != nil {
			return err
		}

		authToken := ecr.GetAuthorizationTokenOutput(ctx, ecr.GetAuthorizationTokenOutputArgs{
			RegistryId: ecrRepo.RegistryId,
		}, nil)

		imageRefs := make(map[string]pulumi.StringOutput)
		for _, service := range services {
			imagePath := filepath.Join("../../services", service)

			image, err := dockerbuild.NewImage(ctx, fmt.Sprintf("docker-image-%s", service), &dockerbuild.ImageArgs{
				Context: &dockerbuild.BuildContextArgs{
					Location: pulumi.String(imagePath),
				},
				Platforms: dockerbuild.PlatformArray{
					dockerbuild.Platform_Linux_amd64,
				},
				Push: pulumi.Bool(true),
				Registries: dockerbuild.RegistryArray{
					&dockerbuild.RegistryArgs{
						Address: ecrRepo.RepositoryUrl,
						Password: authToken.ApplyT(func(authToken ecr.GetAuthorizationTokenResult) (*string, error) {
							return &authToken.Password, nil
						}).(pulumi.StringPtrOutput),
						Username: authToken.ApplyT(func(authToken ecr.GetAuthorizationTokenResult) (*string, error) {
							return &authToken.UserName, nil
						}).(pulumi.StringPtrOutput),
					},
				},
				Tags: pulumi.StringArray{
					ecrRepo.RepositoryUrl.ApplyT(func(repositoryUrl string) (string, error) {
						return fmt.Sprintf("%v:%v", repositoryUrl, service), nil
					}).(pulumi.StringOutput),
				},
				CacheFrom: dockerbuild.CacheFromArray{
					&dockerbuild.CacheFromArgs{
						Registry: &dockerbuild.CacheFromRegistryArgs{
							Ref: ecrRepo.RepositoryUrl.ApplyT(func(repositoryUrl string) (string, error) {
								return fmt.Sprintf("%v:latest", repositoryUrl), nil
							}).(pulumi.StringOutput),
						},
					},
				},
			})
			if err != nil {
				return err
			}

			imageRefs[service] = image.Ref
		}

		for service, ref := range imageRefs {
			ctx.Export(fmt.Sprintf("image-ref-%s", service), ref)
		}
		ctx.Export("registry-url", ecrRepo.RepositoryUrl)

		// RDS ----------------------------------------------------------------------------

		dbServices := map[string]string{
			"auth-service":    "auth_db",
			"booking-service": "booking_db",
			"payment-service": "payment_db",
			"propety-service": "property_db",
		}

		dbEndpoints := make(map[string]pulumi.StringOutput)

		for service, dbName := range dbServices {
			sg, err := ec2.NewSecurityGroup(ctx, fmt.Sprintf("rds-sg-%s", service), &ec2.SecurityGroupArgs{
				Ingress: ec2.SecurityGroupIngressArray{
					&ec2.SecurityGroupIngressArgs{
						FromPort:   pulumi.Int(5432),
						ToPort:     pulumi.Int(5432),
						Protocol:   pulumi.String("tcp"),
						CidrBlocks: pulumi.StringArray{pulumi.String("0.0.0.0/0")},
					},
				},
			})
			if err != nil {
				return err
			}

			instance, err := rds.NewInstance(ctx, fmt.Sprintf("rds-%s", service), &rds.InstanceArgs{
				AllocatedStorage:    pulumi.Int(20),
				DbName:              pulumi.String(dbName),
				Engine:              pulumi.String("postgres"),
				EngineVersion:       pulumi.String("16"),
				InstanceClass:       pulumi.String(rds.InstanceType_T3_Micro),
				Username:            pulumi.String("postgres"),
				Password:            pulumi.String(os.Getenv("DB_PASSWORD")),
				SkipFinalSnapshot:   pulumi.Bool(true),
				PubliclyAccessible:  pulumi.Bool(true),
				VpcSecurityGroupIds: pulumi.StringArray{sg.ID()},
			})
			if err != nil {
				return err
			}
			dbEndpoints[service] = instance.Endpoint
			ctx.Export(fmt.Sprintf("db-endpoint-%s", service), instance.Endpoint)
		}

		// ECS ----------------------------------------------------------------------------

		cluster, err := ecs.NewCluster(ctx, "deploy-ecs-cluster", nil)
		if err != nil {
			return err
		}

		// RabbitMQ
		rabbitmqUser := os.Getenv("RABBITMQ_USER")
		rabbitmqPass := os.Getenv("RABBITMQ_PASS")

		_, err = ecsx.NewFargateService(ctx, "ecs-service-rabbitmq", &ecsx.FargateServiceArgs{
			Cluster:        cluster.Arn,
			DesiredCount:   pulumi.Int(1),
			AssignPublicIp: pulumi.Bool(true),
			TaskDefinitionArgs: &ecsx.FargateServiceTaskDefinitionArgs{
				Containers: map[string]ecsx.TaskDefinitionContainerDefinitionArgs{
					"rabbitmq": {
						Image:  pulumi.String("rabbitmq:3.13-management-alpine"),
						Cpu:    pulumi.Int(256),
						Memory: pulumi.Int(512),
						Environment: ecsx.TaskDefinitionKeyValuePairArray{
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("RABBITMQ_DEFAULT_USER"),
								Value: pulumi.String(rabbitmqUser),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("RABBITMQ_DEFAULT_PASS"),
								Value: pulumi.String(rabbitmqPass),
							},
						},
						PortMappings: ecsx.TaskDefinitionPortMappingArray{
							&ecsx.TaskDefinitionPortMappingArgs{ContainerPort: pulumi.Int(5672)},
							&ecsx.TaskDefinitionPortMappingArgs{ContainerPort: pulumi.Int(15672)},
						},
					},
				},
			},
		}, nil)
		if err != nil {
			return err
		}

		// Serviços
		for service, imageRef := range imageRefs {
			containerName := service

			var env ecsx.TaskDefinitionKeyValuePairArray
			if dbEndpoint, ok := dbEndpoints[service]; ok {
				if service == "payment-service" {
					env = ecsx.TaskDefinitionKeyValuePairArray{
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_HOST"),
							Value: dbEndpoint,
						},
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_PORT"),
							Value: pulumi.String("5432"),
						},
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_USER"),
							Value: pulumi.String("postgres"),
						},
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_PASSWORD"),
							Value: pulumi.String(os.Getenv("DB_PASSWORD")),
						},
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_NAME"),
							Value: pulumi.String(dbServices[service]),
						},
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DB_SSL_MODE"),
							Value: pulumi.String("require"),
						},
					}
				} else {
					dbUrl := pulumi.Sprintf("postgresql://postgres:%s@%s/%s",
						os.Getenv("DB_PASSWORD"),
						dbEndpoint,
						dbServices[service],
					)
					env = ecsx.TaskDefinitionKeyValuePairArray{
						ecsx.TaskDefinitionKeyValuePairArgs{
							Name:  pulumi.String("DATABASE_URL"),
							Value: dbUrl,
						},
					}

					if service == "auth-service" {
						env = append(env,
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("AWS_REGION"),
								Value: pulumi.String("sa-east-1"),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("COGNITO_USER_POOL_ID"),
								Value: pulumi.String(os.Getenv("COGNITO_USER_POOL_ID")),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("COGNITO_CLIENT_ID"),
								Value: pulumi.String(os.Getenv("COGNITO_CLIENT_ID")),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("COGNITO_SECRET"),
								Value: pulumi.String(os.Getenv("COGNITO_SECRET")),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("AWS_ACCESS_KEY_ID"),
								Value: pulumi.String(os.Getenv("AWS_ACCESS_KEY_ID")),
							},
							ecsx.TaskDefinitionKeyValuePairArgs{
								Name:  pulumi.String("AWS_SECRET_ACCESS_KEY"),
								Value: pulumi.String(os.Getenv("AWS_SECRET_ACCESS_KEY")),
							},
						)
					}
				}
			}

			_, err = ecsx.NewFargateService(ctx, fmt.Sprintf("ecs-service-%s", service), &ecsx.FargateServiceArgs{
				Cluster:        cluster.Arn,
				DesiredCount:   pulumi.Int(1),
				AssignPublicIp: pulumi.Bool(true),
				TaskDefinitionArgs: &ecsx.FargateServiceTaskDefinitionArgs{
					Containers: map[string]ecsx.TaskDefinitionContainerDefinitionArgs{
						containerName: {
							Image:       imageRef,
							Cpu:         pulumi.Int(256),
							Memory:      pulumi.Int(512),
							Environment: env,
						},
					},
				},
			}, nil)
			if err != nil {
				return err
			}
		}

		return nil
	})
}
