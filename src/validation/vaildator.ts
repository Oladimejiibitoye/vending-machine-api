import { Length, IsNotEmpty, IsAlphanumeric, IsNumber, IsDivisibleBy , validate } from "class-validator";
import { plainToInstance } from "class-transformer";


export class UserDto{

    @Length(4, 200,{
      message: 'please provide username of length between 4 and 200'
    })
    @IsNotEmpty({
      message: 'please provide a username'
    })
    username: string;

    @IsNotEmpty({
      message: 'please provide a password',
    })
    @IsAlphanumeric()
    @Length(8, 20, {
      message: 'please provide passord of length between 8 and 20',
    })
    password: string;

}

export class UsernameDto{

  @Length(4, 200,{
    message: 'please provide username of length between 4 and 200'
  })
  @IsNotEmpty({
    message: 'please provide a username'
  })
  username: string;

}

export class PasswordDto{
  @IsAlphanumeric()
  @Length(8, 20, {
    message: 'please provide passord of length between 8 and 20',
  })
  password: string;

}



export class DepositDto{

  @IsNumber()
  @IsDivisibleBy(5)
  @IsNotEmpty()
  deposit: number;

}

export class ProductDto{

  @Length(4, 200)
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  amountAvailable: number;

  @IsNumber()
  @IsDivisibleBy(5)
  @IsNotEmpty()
  cost: number;

}

export const validationPipe = async (schema: new () => {}, requestObject: object) => {
  const transformedClass: any = plainToInstance(schema, requestObject);
  const errors = await validate(transformedClass);
  if(errors.length > 0){
    return errors
  }
  return true;
}


// export const validator = async(obj, res) => {
//   const errors = await validate(obj);
//   if (errors.length > 0) {
//     console.log(errors[0].constraints)
//    return res.status(422).send({
//     message: errors[0].constraints
//    })
//   }
// }
