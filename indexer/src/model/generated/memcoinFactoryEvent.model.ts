import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from "typeorm";
import { Factory } from "./factory.model";

@Entity_()
export class MemcoinFactoryEvent {
  constructor(props?: Partial<MemcoinFactoryEvent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("text", { nullable: false })
  type!: string;

  @Column_("text", { nullable: false })
  raw!: string;

  @Column_("int4", { nullable: false })
  blockNumber!: number;

  @Column_("text", { nullable: false })
  txHash!: string;

  @Index_()
  @ManyToOne_(() => Factory, { nullable: true })
  factory!: Factory | undefined | null;

  @Column_("timestamp with time zone", { nullable: false })
  timestamp!: Date;
}
