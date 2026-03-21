package main

import (
	"fmt"
	"os"
	"path/filepath"

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
			instance, err := rds.NewInstance(ctx, fmt.Sprintf("rds-%s", service), &rds.InstanceArgs{
				AllocatedStorage:   pulumi.Int(20),
				DbName:             pulumi.String(dbName),
				Engine:             pulumi.String("postgres"),
				EngineVersion:      pulumi.String("16.3"),
				InstanceClass:      pulumi.String(rds.InstanceType_T3_Micro),
				Username:           pulumi.String("postgres"),
				Password:           pulumi.String(os.Getenv("DB_PASSWORD")),
				SkipFinalSnapshot:  pulumi.Bool(true),
				PubliclyAccessible: pulumi.Bool(true),
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

		for service, imageRef := range imageRefs {
			containerName := service

			var env ecsx.TaskDefinitionKeyValuePairArray
			if dbEndpoint, ok := dbEndpoints[service]; ok {
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
