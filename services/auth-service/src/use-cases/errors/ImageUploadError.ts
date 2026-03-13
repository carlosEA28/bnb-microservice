export class ImageUploadError extends Error {
  constructor() {
    super("Error uploading image to S3");
    this.name = "ImageUploadError";
  }
}
