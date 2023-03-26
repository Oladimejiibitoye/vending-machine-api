import { Entity, Column, ManyToOne} from "typeorm"
import { SharedEntity } from "../common/model/sharedEntity";
import { User } from "./user";


@Entity()
export class Product extends SharedEntity{

    @Column({nullable: false})
    productName: string;

    @Column({nullable: false})
    amountAvailable: number;

    @Column({nullable: false})
    cost: number;

    @ManyToOne(() => User, user => user.products)
    user: User;

}