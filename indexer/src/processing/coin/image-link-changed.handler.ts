import { EntitiesService } from "../entities.service";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin } from "../../model";
import { uniq } from "lodash";
import { AdminAddedEvent, ImageLinkChangedEvent } from "../../types/coin.events";

export class ImageLinkChangedHandler implements ICoinEventHandler {
  async handle(
    event: ImageLinkChangedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { imageLink } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[ImageLinkChangedHandler] ${address}: coin is not found`);
      return;
    }
    await storage.setCoin(
      new Coin({
        ...coin,
        image: imageLink,
      })
    );
  }
}
