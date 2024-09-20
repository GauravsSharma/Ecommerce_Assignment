import multer from "multer";

const storage = multer.memoryStorage();
export const multipleUpload = multer({ storage }).array("images", 10);
