import { EntitiesService } from "../entities.service";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin } from "../../model";
import { ExternalLinksChangedEvent } from "../../types/coin.events";

export class ExternalLinkChangedHandler implements ICoinEventHandler {
  async handle(
    event: ExternalLinksChangedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { externalLink } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[ExternalLinkChangedHandler] ${address}: coin is not found`);
      return;
    }
    await storage.setCoin(
      new Coin({
        ...coin,
        twitter: externalLink.twitter,
        telegram: externalLink.telegram,
        discord: externalLink.discord,
        website: externalLink.website,
        tokenomics: externalLink.tokenomics,
        image: externalLink.image,
      })
    );
  }
}
