package resources

import (
	"fmt"
	"os"

	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/rds"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type RDSOutput struct {
	DBEndpoints map[string]pulumi.StringOutput
	DBServices  map[string]string
}

func CreateRDS(ctx *pulumi.Context) (*RDSOutput, error) {
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
			return nil, err
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
			return nil, err
		}
		dbEndpoints[service] = instance.Endpoint
		ctx.Export(fmt.Sprintf("db-endpoint-%s", service), instance.Endpoint)
	}

	return &RDSOutput{
		DBEndpoints: dbEndpoints,
		DBServices:  dbServices,
	}, nil
}
