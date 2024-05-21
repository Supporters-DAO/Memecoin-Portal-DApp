import { EntitiesService } from "../entities.service";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin } from "../../model";
import { AdminAddedEvent } from "../../types/coin.events";

export class AdminDeletedHandler implements ICoinEventHandler {
  async handle(
    event: AdminAddedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { admin } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[AdminDeletedHandler] ${address}: coin is not found`);
      return;
    }
    await storage.setCoin(
      new Coin({
        ...coin,
        admins: coin.admins.filter((a) => a !== admin),
      })
    );
  }
}
