import { NextFunction, Request, Response } from "express"
import { Product } from "../entity/product";
import { User } from "../entity/user"; 
import ProductService from "../service/ProductService";
import UserService from "../service/UserService";
import { getChange } from "../utils/utilities";


class ProductController{

  static createProduct = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const { 
        productName, 
        amountAvailable, 
        cost} = req.body;

    //Get ID from JWT
    const id: string = res.locals.jwtPayload.userId;
    
    //Get the user from database
    const user = await UserService.getUserById(id)
    if (!user){
      return res.status(404).send({
          message: "User not found"});
    }
    if(user.role !== 'seller'){
      return res.status(400).send({
        message: "User is not a seller"
      })
    }
    let product: Product = new Product();
    product.productName = productName;
    product.amountAvailable = amountAvailable;
    product.cost = cost;
    product.user = user;


    //check if product with name have been created by seller
    const existingProduct: Product  = await ProductService.getProductBySellerByName(id, productName)
    if(existingProduct){
      return res.status(400).send({
        message: 'product with name already created by seller'
      })
    }

    //create prodcut
    const newProduct = await ProductService.createProduct(product)
    
    return res.status(201).json({
      message: "✅ Product created",
      newProduct
    })
    } catch (error) {
      next(error)
    }
    
  }

  static updateProduct = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const { 
        productName, 
        amountAvailable, 
        cost} = req.body;

      //Get ID from JWT
      const id: string = res.locals.jwtPayload.userId;

      //Get product id form params
      const productId: string = req.params.id
      
      //Get the user from database
      const user: User = await UserService.getUserById(id)
      if (!user && user.role === 'seller'){
        return res.status(400).send({
            message: 'User is not a seller'});
      }

      //Get product by id
      const product: Product = await ProductService.getProductById(productId)
      if(!product){
        return res.status(404).send({
          message: 'Product not found'
        })
      }

      if(product.productName != productName){
        //check if product with name have been created by seller
        const existingProduct: Product  = await ProductService.getProductBySellerByName(id, productName)
        if(existingProduct){
          return res.status(400).send({
            message: 'product with name already created by seller'
          })
        }
      }

      product.productName = productName;
      product.amountAvailable = amountAvailable;
      product.cost = cost;


      //update prodcut
      await ProductService.productRepo.save(product)
      
      return res.status(201).json({
        message: "✅ Product updated",
        product
      })
    } catch (error) {
      next(error)
    }
    
  }

  static getProductById = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      
      //Get product id form params
      const productId: string = req.params.id

      //Get product by id
      const product: Product = await ProductService.getProductById(productId)
      
      return res.status(200).json({
        product
      })
    } catch (error) {
      next(error)
    }
    
  }

  static getAllProducts = async (req: Request, res: Response, next: NextFunction ) => {
    try {

      //Get product by id
      const products: Product[] = await ProductService.getAllProducts()
      
      return res.status(200).json({
        products
      })
    } catch (error) {
      next(error)
    }
    
  }


  static getProductsCreatedBySeller = async (req: Request, res: Response, next: NextFunction ) => {
    try {

      //Get ID from JWT
      const sellerId: string = res.locals.jwtPayload.userId;
      console.log(sellerId)

      //Get product by sellerid
      const products: Product[] = await ProductService.getProductsBySeller(sellerId)
      
      return res.status(200).json({
        products
      })
    } catch (error) {
      next(error)
    }
    
  }

  static deleteProduct = async (req: Request, res: Response, next: NextFunction ) => {
    try {

      //Get ID from JWT
      const sellerId: string = res.locals.jwtPayload.userId;

      //Get product id form params
      const productId: string = req.params.id
      
      //Get the user from database
      const user: User = await UserService.getUserById(sellerId)
      if (!user || user.role != 'seller'){
        return res.status(400).send({
            message: 'User is not a seller'});
      }

      //check if product with name have been created by seller
      const existingProduct: Product  = await ProductService.getProductBySellerByProductId(sellerId, productId)
      if(!existingProduct){
        return res.status(401).send({
          message: 'This product was created by another user'
        })
      }
      //delete product
      await ProductService.productRepo.delete(existingProduct.id)
      
      return res.status(201).json({
        message: "✅ Product deleted",
        existingProduct
      })
    } catch (error) {
      next(error)
    }
    
  }

  static buyProduct = async (req: Request, res: Response, next: NextFunction ) => {
    try {

      //Get ID from JWT
      const buyerId: string = res.locals.jwtPayload.userId;

      //Get product id form params
      const productId: string = req.params.id
      const amountofProduct = 1
      
      //Get the user from database
      const user: User = await UserService.getBuyerById(buyerId)
      if (!user){
        return res.status(400).send({
            message: "User is not a buyer"});
      }

      //Get product by id
      const product: Product = await ProductService.getProductById(productId)

      if(product.amountAvailable < 1){
        return res.status(400).send({
          message: 'product not available'
        })
      }
      
      if(user.deposit < product.cost){
        return res.status(400).send({
          message: `User deposit not sufficient, product cost ${product.cost}`
        })
      }

      let change: number[] = [];
      let totalSpent: number;

      product.amountAvailable -= amountofProduct;
      user.deposit -= product.cost;
      totalSpent = product.cost


      await ProductService.productRepo.save(product);

      change = getChange(user.deposit)

      const sortedChange = change.sort((a: number , b: number) => a - b )
      
      user.deposit = 0
          
      await UserService.userRepo.save(user)

      return res.status(201).json({
        message: "✅ Product deleted",
        total_spent: totalSpent,
        product: product,
        change: sortedChange
      })
    } catch (error) {
      next(error)
    }
    
  }





}

export default ProductController