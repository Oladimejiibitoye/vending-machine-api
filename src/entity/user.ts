import { Entity, Column, BeforeInsert, OneToOne, OneToMany } from "typeorm"
import { SharedEntity } from "../common/model/sharedEntity";
import * as bcrypt from "bcryptjs";
import { Length, IsNotEmpty, IsEmail, IsAlphanumeric, IsEnum, IsBoolean, IsDivisibleBy ,IsOptional } from "class-validator";
import { Product } from "./product";

export type ROLE = 'seller' | 'buyer' 

@Entity()
export class User extends SharedEntity{

    @Column({nullable: false})
    username: string;

    @Column({
      type: 'enum',
      enum: ['seller', 'buyer'],
      nullable: false
    })
    role: ROLE;

    @Column({nullable: false})
    password: string;

    @Column({
      default: 0
    })
    deposit: number;


    @Column({default: false})
    isLoggedIn: boolean;

    @OneToMany(() => Product, products => products.user)
    products: Product[]

    @BeforeInsert()
    public setPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
        return this.password;
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      }

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
      }

}
