import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from "typeorm";
import * as marshal from "./marshal";
import { Coin } from "./coin.model";
import { Factory } from "./factory.model";

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Coin, { nullable: true })
  coin!: Coin;

  @Index_()
  @Column_("int4", { nullable: false })
  blockNumber!: number;

  @Index_()
  @Column_("timestamp with time zone", { nullable: false })
  timestamp!: Date;

  @Index_()
  @Column_("text", { nullable: true })
  extrinsicHash!: string | undefined | null;

  @Column_("text", { nullable: false })
  from!: string;

  @Column_("text", { nullable: false })
  to!: string;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  amount!: bigint;

  @Index_()
  @ManyToOne_(() => Factory, { nullable: true })
  factory!: Factory | undefined | null;
}
