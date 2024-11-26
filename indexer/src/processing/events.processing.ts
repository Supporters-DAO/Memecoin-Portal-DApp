import { ICoinEventHandler } from "./coin/coin.handler";
import { EventInfo } from "./event-info.type";
import { EntitiesService } from "./entities.service";
import { IStorage } from "./storage/storage.inteface";
import { HexString, ProgramMetadata } from "@gear-js/api";
import {
  FactoryEvent,
  FactoryEventType,
  MemeFactoryEventsParser,
} from "../types/factory.events";
import {
  CoinEvent,
  CoinEventsParser,
  CoinEventType,
} from "../types/coin.events";
import { MemeCreatedHandler } from "./factory/meme-created.handler";
import { IFactoryEventHandler } from "./factory/factory.handler";
import { AdminDeletedHandler } from "./coin/admin-deleted.handler";
import { AdminAddedHandler } from "./coin/admin-added.handler";
import { TransferredHandler } from "./coin/transferred.handler";
import { TransferredToUsersHandler } from "./coin/transferred-to-users.handler";
import { BurnedHandler } from "./coin/burned.handler";
import { MintedHandler } from "./coin/minted.handler";
import { MemeRemovedHandler } from "./factory/meme-removed.handler";

const factoryEventsToHandler: Record<
  FactoryEventType,
  IFactoryEventHandler | undefined
> = {
  [FactoryEventType.MemeCreated]: new MemeCreatedHandler(),
  [FactoryEventType.MemeRemoved]: new MemeRemovedHandler(),
};

const coinEventsToHandler: Record<
  CoinEventType,
  ICoinEventHandler | undefined
> = {
  [CoinEventType.AdminRemoved]: new AdminDeletedHandler(),
  [CoinEventType.AdminAdded]: new AdminAddedHandler(),
  [CoinEventType.Transferred]: new TransferredHandler(),
  [CoinEventType.TransferredToUsers]: new TransferredToUsersHandler(),
  [CoinEventType.Burned]: new BurnedHandler(),
  [CoinEventType.Minted]: new MintedHandler(),
};

export class EventsProcessing {
  private readonly factoryMeta: ProgramMetadata;
  private readonly coinMeta: ProgramMetadata;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly storage: IStorage,
    private readonly memeFactoryParser: MemeFactoryEventsParser,
    private readonly coinParser: CoinEventsParser
  ) {
    const factory = this.storage.getFactory();
    this.factoryMeta = ProgramMetadata.from(factory.meta);
    this.coinMeta = ProgramMetadata.from(factory.coinMeta);
  }

  saveAll() {
    return this.entitiesService.saveAll();
  }

  async handleFactoryEvent(
    payload: HexString,
    eventInfo: EventInfo
  ): Promise<FactoryEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling memecoin event`);
      const event = this.memeFactoryParser.getFactoryEvent(payload);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown event type`,
          payload
        );
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`
      );
      await this.entitiesService
        .addEvent({
          blockNumber: eventInfo.blockNumber,
          timestamp: eventInfo.timestamp,
          type: event.type,
          raw: JSON.stringify(
            event,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          ),
          txHash: eventInfo.txHash,
        })
        .catch((err) =>
          console.error(`${blockNumber}-${messageId}: error adding event`, err)
        );
      const eventHandler = factoryEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${messageId}: no event handlers found for ${event.type}`
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${messageId}: error handling factory event`,
        e
      );
      return null;
    }
  }

  async handleCoinEvent(
    payload: HexString,
    eventInfo: EventInfo
  ): Promise<CoinEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      const event = this.coinParser.getCoinEvent(payload);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown event type`,
          payload
        );
        return null;
      }
      await this.entitiesService
        .addEvent({
          blockNumber: eventInfo.blockNumber,
          timestamp: eventInfo.timestamp,
          type: event.type,
          raw: JSON.stringify(
            event,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          ),
          txHash: eventInfo.txHash,
        })
        .catch((err) =>
          console.error(`${blockNumber}-${messageId}: error adding event`, err)
        );
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`
      );
      const eventHandler = coinEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${messageId}: no coin event handlers found for ${event.type}`
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${messageId}: error handling coin event`,
        e,
        payload
      );
      return null;
    }
  }
}
