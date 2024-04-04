import { Coin, Factory } from "../../model";

export interface IStorage {
  getFactory(): Factory;

  getCoin(address: string): Promise<Coin | undefined>;
  updateCoin(coin: Coin): Promise<void>;
}
