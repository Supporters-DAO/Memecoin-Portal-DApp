import { Coin, Factory, MemcoinFactoryEvent, Transfer } from "../model";
import { IStorage } from "./storage/storage.inteface";
import { BatchService } from "./batch.service";
import { v4 as uuidv4 } from "uuid";

export class EntitiesService {
  constructor(
    private readonly storage: IStorage,
    private readonly batchService: BatchService
  ) {}

  async saveAll() {
    await this.batchService.saveAll();
  }

  getFactory(): Factory {
    return this.storage.getFactory();
  }

  async getCoin(collectionAddress: string) {
    return this.storage.getCoin(collectionAddress);
  }

  async setCoin(coin: Coin) {
    await this.storage.updateCoin(coin);
    this.batchService.addCoinUpdate(coin);
  }

  addTransfer(transfer: Transfer) {
    this.batchService.addTransfer(transfer);
  }

  async addEvent(event: Omit<MemcoinFactoryEvent, "factory" | "id">) {
    const entity = new MemcoinFactoryEvent({
      ...event,
      id: uuidv4(),
      factory: this.storage.getFactory(),
    } as MemcoinFactoryEvent);
    this.batchService.addEvent(entity);
  }
}
