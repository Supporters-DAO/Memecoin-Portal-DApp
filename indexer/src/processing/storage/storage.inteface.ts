import { AccountBalance, Coin, Factory } from "../../model";

export interface IStorage {
  getFactory(): Factory;

  getCoin(address: string): Promise<Coin | undefined>;
  updateCoin(coin: Coin): Promise<void>;

  getAccountBalance(
    address: string,
    contract: string
  ): Promise<AccountBalance | undefined>;
  updateAccountBalance(balance: AccountBalance): Promise<void>;
}
