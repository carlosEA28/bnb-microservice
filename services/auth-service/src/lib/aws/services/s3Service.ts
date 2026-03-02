import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../s3client";

export class S3Service {
  async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string) {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));

      console.log("File uploaded successfully.");

      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (err) {
      console.log(err);

      throw {
        message: "Erro ao fazer upload do arquivo para o S3",
      };
    }
  }

  async deleteFile(id: string) {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
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
}
