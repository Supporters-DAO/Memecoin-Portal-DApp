import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_,
} from "typeorm";
import { Coin } from "./coin.model";

@Entity_()
export class Factory {
  constructor(props?: Partial<Factory>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("text", { nullable: false })
  address!: string;

  @Column_("text", { nullable: false })
  meta!: string;

  @Column_("text", { nullable: false })
  coinMeta!: string;

  @OneToMany_(() => Coin, (e) => e.factory)
  coins!: Coin[];
}
