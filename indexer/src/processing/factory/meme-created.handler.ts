import { EntitiesService } from "../entities.service";
import { EventInfo } from "../event-info.type";
import { MemeCreatedEvent } from "../../types/factory.events";
import { IFactoryEventHandler } from "./factory.handler";
import { Coin } from "../../model";

export class MemeCreatedHandler implements IFactoryEventHandler {
  async handle(
    event: MemeCreatedEvent,
    eventInfo: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const {
      address,
      config: {
        name,
        symbol,
        decimals,
        description,
        initialCapacity,
        initialSupply,
        totalSupply,
        admin,
        image,
        twitter,
        telegram,
        discord,
        website,
      },
    } = event;
    const existed = await storage.getCoin(address);
    if (existed !== undefined) {
      console.warn(`[MemeCreatedHandler] ${address}: coin already exists`);
      return;
    }
    await storage.setCoin(
      new Coin({
        id: address,
        name,
        symbol,
        decimals,
        description,
        initialSupply,
        image,
        twitter,
        telegram,
        discord,
        website,
        distributed: initialSupply,
        admins: [admin],
        screenshots: [],
        maxSupply: totalSupply,
        createdBy: admin || eventInfo.destination,
        timestamp: eventInfo.timestamp,
      })
    );
  }
}
