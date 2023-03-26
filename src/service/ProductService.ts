import { AppDataSource } from "../data-source";
import { Repository } from "typeorm/repository/Repository";
import { Product } from "../entity/product";


class ProductService {
  static productRepo: Repository<Product> = AppDataSource.getRepository(Product)

  static async createProduct(product: Product){
    const res: Product = await this.productRepo.save(product)
    return res
  }

  static async getProductById(id: string){
    const res: Product = await this.productRepo.findOne({where: {id}})
    return res
  }

  static async getProductsBySeller(sellerId: string){
    const res: Product[] = await this.productRepo.find({
      relations: {
        user: true
      },
      where: {
        user: {
          id: sellerId,
          role: 'seller'
        }
      }
    })
    return res
  }

  static async getProductBySellerByName(sellerId: string, productName: string){
    const res: Product = await this.productRepo.findOne({
      relations: {
        user: true
      },
      where: {
        productName: productName,
        user: {
          id: sellerId,
          role: 'seller'
        }
      }
    })
    return res
  }

  static async getProductBySellerByProductId(sellerId: string, productId: string){
    const res: Product = await this.productRepo.findOne({
      relations: {
        user: true
      },
      where: {
        id: productId,
        user: {
          id: sellerId,
          role: 'seller'
        }
      }
    })
    return res
  }

  static async getAllProducts(){
    const res: Product[] = await this.productRepo.find()
    return res
  }

}

export default ProductService