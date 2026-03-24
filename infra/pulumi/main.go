package main

import (
	"deploy-bnb/resources"

	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		ecrOutput, err := resources.CreateECR(ctx)
		if err != nil {
			return err
		}

		rdsOutput, err := resources.CreateRDS(ctx)
		if err != nil {
			return err
		}

		_, err = resources.CreateECS(
			ctx,
			rdsOutput.VpcId,
			ecrOutput.ImageRefs,
			rdsOutput.DBEndpoints,
			rdsOutput.DBServices,
		)
		if err != nil {
			return err
		}

		return nil
	})
}
