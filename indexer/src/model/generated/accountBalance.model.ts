import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  ManyToOne as ManyToOne_,
} from "typeorm";
import * as marshal from "./marshal";
import { Coin } from "./coin.model";

@Entity_()
export class AccountBalance {
  constructor(props?: Partial<AccountBalance>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @Column_("text", { nullable: false })
  address!: string;

  @Index_()
  @ManyToOne_(() => Coin, { nullable: true })
  coin!: Coin;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  balance!: bigint;
}
