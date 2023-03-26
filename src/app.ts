import * as express from "express";
import { Request, Response, NextFunction } from "express"
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import * as morgan from 'morgan';
import * as cors from "cors";

//Access the routes 
import auth from "./routes/auth";
import user from "./routes/user";
import product from "./routes/product";




function handleError(err: any, res: Response, next: NextFunction) {
    res.status(err.stausCode || 500).send({message: err.message});
    next(err)
}


// create express app
const app = express();


AppDataSource.initialize().then(async () => {
    
    
    //call middlewares
    app.use(cors());
    app.use(morgan('tiny'));
    app.use(bodyParser.json({ limit: "30mb" }));
    app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }))

    app.get("/", (req: Request, res: Response) => res.send("APP is running!"));


    //Set all routes from routes folder
    app.use("/api/auth", auth);
    app.use("/api/users", user);
    app.use("/api/products", product)
    


    //handle Error
    app.use(handleError);

}).catch(error => console.log(error))


export default app
