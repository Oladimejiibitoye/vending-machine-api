import "reflect-metadata"
import { DataSource } from "typeorm"
import { dbHost, dbName, dbPassword, dbUsername } from "./common/config/config"
import { Product } from "./entity/product"
import { User } from "./entity/user"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: dbHost,
    port: 3306,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    synchronize: false,
    logging: false,
    entities: [
      User, Product
     ],
     migrations: [
      'build/migration/*.js'
     ],
     subscribers: [],

})


