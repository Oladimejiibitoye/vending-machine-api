import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm/repository/Repository";


class UserService {
  
  static userRepo: Repository<User> = AppDataSource.getRepository(User)

  static async createUser(user: User){
    const res: User = await this.userRepo.save(user)
    return res
  }

  static async getUserByName(name: string){
    const res: User = await this.userRepo.findOne({where: {username: name}})
    return res
  }

  static async getUserById(id: string){
    const res: User = await this.userRepo.findOne({where: {id}})
    return res
  }

  static async getAllSellers(){
    const res: User[] = await this.userRepo.find({
      where: {role: "seller"},
      select: {
        password: false,
        deposit: false
      }
    })
    return res
  }

  static async getAllBuyers(){
    const res: User[] = await this.userRepo.find({
      where: {role: "buyer"},
      select: {
        password: false
      }
    })
    return res
  }

  static async getBuyerById(id: string){
    const res: User = await this.userRepo.findOne({
      where: {
        id: id,
        role: 'buyer'
      }})
    return res
  }

  static async getSellerById(id: string){
    const res: User = await this.userRepo.findOne({
      where: {
        id: id,
        role: 'seller'
      }})
    return res
  }

}

export default UserService