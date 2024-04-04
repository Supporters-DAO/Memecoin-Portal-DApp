import { Coin, Factory } from "../../model";
import { Store } from "@subsquid/typeorm-store";
import { IStorage } from "./storage.inteface";
import { readFileSync } from "fs";
import { config } from "../../config";

let storage: LocalStorage | undefined;

export async function getLocalStorage(store: Store): Promise<LocalStorage> {
  if (storage === undefined) {
    storage = new LocalStorage(store);
    await storage.waitInit();
  }
  storage.setStore(store);
  return storage;
}

const factoryMeta = readFileSync("./assets/factory.meta.txt", "utf8");
const coinMeta = readFileSync("./assets/coin.meta.txt", "utf8");

export class LocalStorage implements IStorage {
  private initialized = false;
  private factory: Factory | undefined;
  // address -> Coin
  private coins: Record<string, Coin> = {};

  constructor(private store: Store) {}

  async waitInit() {
    if (this.initialized) {
      return;
    }
    await this.loadEntities();
    this.initialized = true;
  }

  getFactory(): Factory {
    return this.factory!;
  }

  setStore(store: Store) {
    this.store = store;
    this.coins = {};
  }

  async getCoin(address: string): Promise<Coin | undefined> {
    if (this.coins[address] !== undefined) {
      return this.coins[address];
    }
    return this.store.findOne(Coin, { where: { id: address } });
  }

  async updateCoin(coin: Coin): Promise<void> {
    this.coins[coin.id] = coin;
  }

  private async loadEntities() {
    await Promise.all([this.loadFactory(), this.loadCoins()]);
  }

  private async loadFactory() {
    try {
      this.factory = await this.store.findOne(Factory, { where: {} });
      if (!this.factory) {
        this.factory = new Factory({
          address: config.factoryProgram,
          meta: factoryMeta,
          coinMeta: coinMeta,
        });
        await this.store.save(this.factory);
      }
    } catch (e) {}
  }

  private async loadCoins() {
    const coins = await this.store.find(Coin, { where: {} });
    for (const entity of coins) {
      this.coins[entity.id] = entity;
    }
  }
}
