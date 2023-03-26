import "reflect-metadata"
import { DataSource } from "typeorm"
import { dbHost, dbName, dbPassword, dbUsername } from "./common/config/config"
import { Product } from "./entity/product"
import { User } from "./entity/user"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: 5432,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    synchronize: false,
    logging: false,
    entities: [
      User, Product
     ],
     migrations: [
      'build/src/migration/*.js'
     ],
     subscribers: [],

})


