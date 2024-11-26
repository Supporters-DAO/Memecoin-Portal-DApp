import { Store } from "@subsquid/typeorm-store";
import {
  AccountBalance,
  Coin,
  Factory,
  MemcoinFactoryEvent,
  Transfer,
} from "../model";

export class BatchService {
  private factory: Factory | null = null;
  private coins: Coin[] = [];
  private transfers: Transfer[] = [];
  private events: MemcoinFactoryEvent[] = [];
  private accountBalances: AccountBalance[] = [];

  private coinsToRemove: Coin[] = [];

  constructor(private readonly store: Store) {}

  async saveAll() {
    await this.store.save(this.coins);
    if (this.factory) {
      await this.store.save(this.factory);
    }
    await Promise.all([
      this.store.save(this.accountBalances),
      this.store.save(this.transfers),
      this.store.save(this.events),
    ]);
    if (this.coinsToRemove.length) {
      await Promise.all(
        this.coinsToRemove.map(async (c) => {
          const transfers = await this.store.find(Transfer, {
            where: { coin: c },
          });
          const balances = await this.store.find(AccountBalance, {
            where: { coin: c },
          });
          await Promise.all([
            this.store.remove(transfers),
            this.store.remove(balances),
            this.store.remove(c),
          ]);
        })
      );
    }
    this.clearAll();
  }

  clearAll() {
    this.coins = [];
    this.transfers = [];
    this.events = [];
    this.coinsToRemove = [];
    this.factory = null;
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

  addFactory(factory: Factory) {
    this.factory = factory;
  }

  removeCoin(coin: Coin) {}

  private safelyPush(entity: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[entity] = [...this[entity].filter((e) => e.id !== value.id), value];
  }
}
