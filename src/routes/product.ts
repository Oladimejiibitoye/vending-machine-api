import { Router } from "express";
import ProductController from "../controller/ProductController";
import { auth } from "../middleware/auth";
import { validationMiddleware } from "../middleware/validate";
import { ProductDto } from "../validation/vaildator";

const router = Router();


router.post("/create", [auth], validationMiddleware(ProductDto),ProductController.createProduct);
router.put("/:id", [auth], validationMiddleware(ProductDto), ProductController.updateProduct);
router.get("/seller", [auth], ProductController.getProductsCreatedBySeller);
router.get("/:id", ProductController.getProductById);
router.get("/", ProductController.getAllProducts);
router.delete("/:id", [auth], ProductController.deleteProduct);
router.get("/buy/:id", [auth], ProductController.buyProduct);




export default router;