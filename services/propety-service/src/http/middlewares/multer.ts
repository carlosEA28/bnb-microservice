import multer, { memoryStorage } from "multer";

export const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});
