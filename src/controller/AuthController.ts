import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecretKey } from "../common/config/config";
import UserService from "../service/UserService";
import { ROLE, User } from "../entity/user";

class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {

    const {role}: any = req.query

    //Get parameters from the body
    const { username, password } = req.body;
    
    //check if user alrady exist
    const existingUser = await UserService.getUserByName(username)
    if(existingUser){
      return res.status(400).json({
        message: "user already exist"
      })
    }

    const user: User = new User();
    user.username = username;
    user.password = password;
    user.role = role
      
  
    //Try to save. If fails, the email is already in use
    const createUser: User = await UserService.createUser(user)
  
  
    //If all ok, send 201 response
    return res.status(201).json({
      message: "✅ New user created",
      createUser,    
  })
    } catch (error) {
      console.log(error)
      next(error)
    }
    
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
   try {

    //Check if username and password are set
    let { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send({
        message: 'provide the required credential'
      });
    }

    //check if user exist
    const user: User = await UserService.getUserByName(username)
    if(!user){
      return res.status(400).send({
        message: 'invalid credential'
      });
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(400).send({
        message: 'invalid credential'
      });
    }

    if(user.isLoggedIn === true){
      return res.status(400).send({
        message: 'There is already an active session using your account'
      })
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecretKey
    );

    //update user isloggedIn to true
    user.isLoggedIn = true;
    await UserService.userRepo.save(user)


    //Send the jwt in the response
    return res.status(200).send({
      message: "✅ User Login Successful",
      user,
      token, 
    });
   } catch (error) {
     next(error)
   }
    
  };
  static changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Get ID from JWT
      const id: string = res.locals.jwtPayload.userId;
     
      //Get parameters from the body
      const { oldPassword, password } = req.body;
      if (!(oldPassword && password)) {
        res.status(400).send({
          message: "please enter the required credential"
        });
      }

      const user: User = await UserService.getUserById(id)
      if(!user){
        return res.status(404).send({
          message: "user not found"
        });
      }

      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        return res.status(401).send({
          message: "invalid credential"
        });
      }

      user.password = password;

      //save
      user.hashPassword();
      await UserService.userRepo.save(user);

      res.status(201).send({
        message: "password change completed"
      });
    } catch (error) {
      console.log(error)
      next(error)
    }
  };


  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
 
     //Check if username and password are set
     let { username } = req.body;
 
     //check if user exist
     const user: User = await UserService.getUserByName(username)
     if(!user){
       return res.status(400).send({
         message: 'invalid credential'
       });
     }

     user.isLoggedIn = false
     await UserService.userRepo.save(user)
 
 
     //Send the response
     return res.status(200).send({
       message: "✅ User Logout Successfully",
     });
    } catch (error) {
      next(error)
    }
  }
}


export default AuthController