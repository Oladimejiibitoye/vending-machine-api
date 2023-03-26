import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecretKey } from "../common/config/config";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get the jwt token from the head
    const token = <string>req.headers.authorization.split(" ")[1];
    if(!token){
      return res.status(401).send({
        message: 'unauthorized'
      });
    }
    let jwtPayload : any;
  
  //Try to validate the token and get data
    jwtPayload = jwt.verify(token, jwtSecretKey);
    res.locals.jwtPayload = jwtPayload;

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, jwtSecretKey);
    res.setHeader("token", newToken);
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).send({
      message: 'unauthorized'
    });
  }

  //Call the next middleware or controller
  next();
};