import { NextFunction, Request, Response } from "express"
import { User } from "../entity/user";
import UserService from "../service/UserService";
import { getChange } from "../utils/utilities";


class UserController{

    static getAllSellers = async (req: Request, res: Response, next: NextFunction ) => {
      try {

        const sellers: User[] = await UserService.getAllSellers()
        
        //Send the users object
        res.status(200).send({
            sellers: sellers
          });
        } catch (error) {
            next(error)
        }
    };

    static getAllBuyers = async (req: Request, res: Response, next: NextFunction ) => {
      try {

        const buyers: User[] = await UserService.getAllBuyers()
        
        //Send the users object
        res.status(200).send({
            data: buyers
          });
        } catch (error) {
            next(error)
        }
    };
    
    static getUserById = async (req: Request, res: Response, next: NextFunction) => {
     try {
         //Get ID from JWT
      const id = res.locals.jwtPayload.userId;

      const user = await UserService.getUserById(id)
      if (!user){
        return res.status(404).send({
            message: "User not found"});
      }
    
      return res.status(200).send({
        data: user
      })
       
     } catch (error) {
        next(error)
     }
    };
    
    static updateUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
           //Get ID from JWT
      const id: string = res.locals.jwtPayload.userId;
    
      //Get values from the body
      const { username } = req.body;
    
      //Try to find user on database
      const user: User = await UserService.getUserById(id)
      if (!user){
        return res.status(404).send({
            message: "User not found"});
      }

      if(user.username != username){
        //check if username alrady exist
        const existingUser = await UserService.getUserByName(username)
        if(existingUser){
          return res.status(400).json({
            message: "username already exist"
          })
        }
      }
    
      user.username = username;

      //Try to save
      await UserService.userRepo.save(user)
     
      //After all send a 201 response
      return res.status(201).send({
        data: user
      });
      } catch (error) {
        next(error)
      }
      
    };
    
    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
         //Get the ID from the url
      const id = req.params.id;

      const user: User = await UserService.getUserById(id)
      if (!user){
        return res.status(404).send({
            message: "User not found"});
      }

      await UserService.userRepo.delete(user.id)
    
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
     } catch (error) {
        next(error)
     }
    };

    static deposit = async (req: Request, res: Response, next: NextFunction) => {
      try {

          const {deposit} = req.body
          
          //Get ID from JWT
          const buyerId: string = res.locals.jwtPayload.userId;
          
    
          const user: User = await UserService.getBuyerById(buyerId)
          if (!user){
            return res.status(400).send({
                message: "User is not a buyer"});
          }

          const depositValidationArray: number[] = [5, 10, 20, 50, 100];

          if(!depositValidationArray.includes(deposit)){
            return res.status(400).send({
              message: "Buyer can only deposit 5, 10, 20, 50 and 100 cent coins"
            })
          }

          user.deposit += deposit;
   
          await UserService.userRepo.save(user)
        
          return res.status(201).send({
            message: "✅ deposit successful",
            deposit: deposit,
            balance: user.deposit   
          });
        } catch (error) {
         next(error)
      }
     };

     static resetDeposit = async (req: Request, res: Response, next: NextFunction ) => {
      try {
  
        //Get ID from JWT
        const buyerId: string = res.locals.jwtPayload.userId;
        
        //Get the user from database
        const user: User = await UserService.getBuyerById(buyerId)
        if (!user){
          return res.status(400).send({
              message: "User is not a buyer"});
        }

        let sortedChange: number[] = [];

        if(user.deposit > 0){

          let change: number[] = [];
  
          change = getChange(user.deposit)
    
          sortedChange = change.sort((a: number , b: number) => a - b )
          
          user.deposit = 0
          
          await UserService.userRepo.save(user)
        }

        return res.status(201).json({
          message: "✅ deposit reset to zero",
          change: sortedChange
        })
      } catch (error) {
        next(error)
      }
      
    }

 }

    export default UserController;
