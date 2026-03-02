import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../s3Client";
import { env } from "../../../env/env";

export class S3Service {
  async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string) {
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));

      console.log("File uploaded successfully.");

      return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (err) {
      console.log(err);

      throw {
        message: "Erro ao fazer upload do arquivo para o S3",
      };
    }
  }

  async uploadPropertyImage(
    propertyId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ) {
    const key = `properties/${propertyId}/images/${fileName}`;
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));

      console.log(`Property image uploaded successfully to ${key}`);

      return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      console.log(err);

      throw {
        message: "Erro ao fazer upload da imagem da propriedade para o S3",
      };
    }
  }

  async uploadPropertyImages(
    propertyId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const extension = file.originalname.split(".").pop() || "jpg";
      const fileName = `image_${index + 1}_${Date.now()}.${extension}`;
      return this.uploadPropertyImage(
        propertyId,
        fileName,
        file.buffer,
        file.mimetype,
      );
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(id: string) {
    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `uploads/${id}`,
    };
    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log("File deleted successfully.");
    } catch (err) {
      console.log(err);
      throw {
        message: "Erro ao deletar o arquivo do S3",
      };
    }
  }

  async deletePropertyImage(propertyId: string, fileName: string) {
    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `properties/${propertyId}/images/${fileName}`,
    };
    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log("Property image deleted successfully.");
    } catch (err) {
      console.log(err);
      throw {
        message: "Erro ao deletar a imagem da propriedade do S3",
      };
    }
  }
}
