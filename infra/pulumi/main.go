package main

import (
	"deploy-bnb/resources"

	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create ECR
		ecrOutput, err := resources.CreateECR(ctx)
		if err != nil {
			return err
		}

		// Create RDS
		rdsOutput, err := resources.CreateRDS(ctx)
		if err != nil {
			return err
		}

		// Create ECS
		_, err = resources.CreateECS(ctx, ecrOutput.ImageRefs, rdsOutput.DBEndpoints, rdsOutput.DBServices)
		if err != nil {
			return err
		}

		return nil
	})
}
