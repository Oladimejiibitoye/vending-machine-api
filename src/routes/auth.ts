import { Router } from "express";
import AuthController from "../controller/AuthController";
import { auth } from "../middleware/auth";
import { validationMiddleware } from "../middleware/validate";
import { PasswordDto, UserDto, UsernameDto } from "../validation/vaildator";

const router = Router();
//signup route
router.post("/signup", validationMiddleware(UserDto), AuthController.signUp)

//Login route
router.post("/login", validationMiddleware(UserDto), AuthController.login);

//Logout route
router.post("/logout/all", validationMiddleware(UsernameDto), AuthController.logout);

//Change my password
router.patch("/change-password", [auth], validationMiddleware(PasswordDto), AuthController.changePassword);

export default router;