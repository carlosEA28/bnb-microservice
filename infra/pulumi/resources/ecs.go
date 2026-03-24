package resources

import (
	"fmt"
	"os"

	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ecs"
	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/servicediscovery"
	ecsx "github.com/pulumi/pulumi-awsx/sdk/v3/go/awsx/ecs"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type ECSOutput struct {
	Cluster *ecs.Cluster
}

func CreateECS(ctx *pulumi.Context, vpcId pulumi.StringInput, imageRefs map[string]pulumi.StringOutput, dbEndpoints map[string]pulumi.StringOutput, dbServices map[string]string) (*ECSOutput, error) {
	cluster, err := ecs.NewCluster(ctx, "deploy-ecs-cluster", nil)
	if err != nil {
		return nil, err
	}

	namespace, err := servicediscovery.NewPrivateDnsNamespace(ctx, "internal-dns", &servicediscovery.PrivateDnsNamespaceArgs{
		Name:        pulumi.String("local"),
		Vpc:         vpcId,
		Description: pulumi.String("Service discovery para microsserviços"),
	})
	if err != nil {
		return nil, err
	}

	rabbitmqUser := os.Getenv("RABBITMQ_USER")
	rabbitmqPass := os.Getenv("RABBITMQ_PASS")

	_, err = ecsx.NewFargateService(ctx, "ecs-service-rabbitmq", &ecsx.FargateServiceArgs{
		Cluster:        cluster.Arn,
		DesiredCount:   pulumi.Int(1),
		AssignPublicIp: pulumi.Bool(true),
		ServiceRegistries: &ecs.ServiceServiceRegistriesArgs{
			RegistryArn: namespace.Arn,
		},
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
		return nil, err
	}

	for service, imageRef := range imageRefs {
		containerName := service
		var env ecsx.TaskDefinitionKeyValuePairArray

		if dbEndpoint, ok := dbEndpoints[service]; ok {
			if service == "payment-service" {
				env = ecsx.TaskDefinitionKeyValuePairArray{
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_HOST"), Value: dbEndpoint},
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_PORT"), Value: pulumi.String("5432")},
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_USER"), Value: pulumi.String("postgres")},
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_PASSWORD"), Value: pulumi.String(os.Getenv("DB_PASSWORD"))},
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_NAME"), Value: pulumi.String(dbServices[service])},
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DB_SSL_MODE"), Value: pulumi.String("require")},

					ecsx.TaskDefinitionKeyValuePairArgs{
						Name:  pulumi.String("RABBITMQ_URL"),
						Value: pulumi.Sprintf("amqp://%s:%s@%s:5672", rabbitmqUser, rabbitmqPass, "ecs-service-rabbitmq.local"),
					},
				}
			} else {
				dbUrl := pulumi.Sprintf("postgresql://postgres:%s@%s/%s",
					os.Getenv("DB_PASSWORD"),
					dbEndpoint,
					dbServices[service],
				)
				env = ecsx.TaskDefinitionKeyValuePairArray{
					ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("DATABASE_URL"), Value: dbUrl},
				}
			}
		}

		// Auth Service
		if service == "auth-service" {
			env = append(env,
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_REGION"), Value: pulumi.String("sa-east-1")},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("COGNITO_USER_POOL_ID"), Value: pulumi.String(os.Getenv("COGNITO_USER_POOL_ID"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("COGNITO_CLIENT_ID"), Value: pulumi.String(os.Getenv("COGNITO_CLIENT_ID"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("COGNITO_SECRET"), Value: pulumi.String(os.Getenv("COGNITO_SECRET"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_ACCESS_KEY_ID"), Value: pulumi.String(os.Getenv("AWS_ACCESS_KEY_ID"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_SECRET_ACCESS_KEY"), Value: pulumi.String(os.Getenv("AWS_SECRET_ACCESS_KEY"))},
			)
		}

		// PROBLEMA 4: Property Service (Corrigido o nome de 'propety')
		if service == "propety-service" {
			env = append(env,
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_ACCESS_KEY_ID"), Value: pulumi.String(os.Getenv("AWS_ACCESS_KEY_ID"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_SECRET_ACCESS_KEY"), Value: pulumi.String(os.Getenv("AWS_SECRET_ACCESS_KEY"))},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_REGION"), Value: pulumi.String("sa-east-1")},
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("AWS_BUCKET_NAME"), Value: pulumi.String(os.Getenv("AWS_BUCKET_NAME"))},
			)
		}

		// Injeção do Mercado Pago
		if service == "webhooks-service" {
			env = append(env,
				ecsx.TaskDefinitionKeyValuePairArgs{Name: pulumi.String("MP_ACCESS_TOKEN"), Value: pulumi.String(os.Getenv("MP_ACCESS_TOKEN"))},
			)
		}

		// Criação do Fargate Service
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
			return nil, err
		}
	}

	return &ECSOutput{Cluster: cluster}, nil
}
