import { Router } from "express";
import UserController from "../controller/UserController";
import { auth } from "../middleware/auth";
import { validationMiddleware } from "../middleware/validate";
import { DepositDto, UsernameDto } from "../validation/vaildator";

const router = Router();

//Get all sellers
router.get("/sellers",  UserController.getAllSellers);

//Get all buyers
router.get("/buyers",  UserController.getAllBuyers);

// Get one user
router.get("/", [auth], UserController.getUserById);

//Edit one user
router.put("/",[auth], validationMiddleware(UsernameDto), UserController.updateUser);

//Delete one user
router.delete("/:id", [auth], UserController.deleteUser);

router.put("/deposit", [auth], validationMiddleware(DepositDto), UserController.deposit);

router.get("/reset/deposit", [auth], UserController.resetDeposit)

export default router;