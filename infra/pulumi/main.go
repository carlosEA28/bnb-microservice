package main

import (
	"fmt"
	"path/filepath"

	"github.com/pulumi/pulumi-aws/sdk/v7/go/aws/ecr"
	"github.com/pulumi/pulumi-docker-build/sdk/go/dockerbuild"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Lista de serviços para fazer build e push
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
		// Iterar sobre cada serviço e fazer build + push com tags diferentes
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

		// Exportar as referências de todas as imagens
		for service, ref := range imageRefs {
			ctx.Export(fmt.Sprintf("image-ref-%s", service), ref)
		}

		ctx.Export("registry-url", ecrRepo.RepositoryUrl)
		return nil
	})

}
