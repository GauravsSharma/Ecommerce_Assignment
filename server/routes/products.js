import express from "express"
import { addProduct, deleteProductById, getAllProducts, getProductById, updateProduct } from "../controller/product.js";
import { multipleUpload } from "../middleware/multer.js";
const router = express.Router();

router.route("/products").get(getAllProducts)
router.route("/products/:id").get(getProductById)
router.route("/products/:id").put(multipleUpload,updateProduct)
router.route("/products").post(multipleUpload,addProduct)
router.route("/products/:id").delete(deleteProductById)

export default router;