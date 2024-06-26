import { Store } from "@subsquid/typeorm-store";
import { AccountBalance, Coin, MemcoinFactoryEvent, Transfer } from "../model";

export class BatchService {
  private coins: Coin[] = [];
  private transfers: Transfer[] = [];
  private events: MemcoinFactoryEvent[] = [];
  private accountBalances: AccountBalance[] = [];

  constructor(private readonly store: Store) {}

  async saveAll() {
    await this.store.save(this.coins);
    await Promise.all([
      this.store.save(this.accountBalances),
      this.store.save(this.transfers),
      this.store.save(this.events),
    ]);
    this.clearAll();
  }

  clearAll() {
    this.coins = [];
    this.transfers = [];
    this.events = [];
  }

  addCoinUpdate(coin: Coin) {
    this.safelyPush("coins", coin);
  }

  addBalanceUpdate(balance: AccountBalance) {
    this.safelyPush("accountBalances", balance);
  }

  addTransfer(transfer: Transfer) {
    this.transfers.push(transfer);
  }

  addEvent(event: MemcoinFactoryEvent) {
    this.events.push(event);
  }

  private safelyPush(entity: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[entity] = [...this[entity].filter((e) => e.id !== value.id), value];
  }
}
