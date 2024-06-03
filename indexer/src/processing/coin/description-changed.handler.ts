import { EntitiesService } from "../entities.service";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin } from "../../model";
import { uniq } from "lodash";
import { AdminAddedEvent, DescriptionChangedEvent, ImageLinkChangedEvent } from "../../types/coin.events";

export class DescriptionChangedHandler implements ICoinEventHandler {
  async handle(
    event: DescriptionChangedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { description } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[DescriptionChangedHandler] ${address}: coin is not found`);
      return;
    }
    await storage.setCoin(
      new Coin({
        ...coin,
        description,
      })
    );
  }
}
