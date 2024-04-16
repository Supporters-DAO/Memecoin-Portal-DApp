import { ICoinEventHandler } from "./coin/coin.handler";
import { EventInfo } from "./event-info.type";
import { EntitiesService } from "./entities.service";
import { IStorage } from "./storage/storage.inteface";
import { ProgramMetadata } from "@gear-js/api";
import {
  FactoryEvent,
  FactoryEventPlain,
  FactoryEventType,
  getFactoryEvent,
} from "../types/factory.events";
import {
  CoinEvent,
  CoinEventPlain,
  CoinEventType,
  getCoinEvent,
} from "../types/coin.events";
import { MemeCreatedHandler } from "./factory/meme-created.handler";
import { IFactoryEventHandler } from "./factory/factory.handler";
import { AdminDeletedHandler } from "./coin/admin-deleted.handler";
import { AdminAddedHandler } from "./coin/admin-added.handler";
import { TransferredHandler } from "./coin/transferred.handler";
import { TransferredToUsersHandler } from "./coin/transferred-to-users.handler";

const factoryEventsToHandler: Record<
  FactoryEventType,
  IFactoryEventHandler | undefined
> = {
  [FactoryEventType.MemeCreated]: new MemeCreatedHandler(),
};

const coinEventsToHandler: Record<
  CoinEventType,
  ICoinEventHandler | undefined
> = {
  [CoinEventType.AdminRemoved]: new AdminDeletedHandler(),
  [CoinEventType.AdminAdded]: new AdminAddedHandler(),
  [CoinEventType.Transferred]: new TransferredHandler(),
  [CoinEventType.TransferredToUsers]: new TransferredToUsersHandler(),
};

export class EventsProcessing {
  private readonly factoryMeta: ProgramMetadata;
  private readonly coinMeta: ProgramMetadata;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly storage: IStorage
  ) {
    const factory = this.storage.getFactory();
    this.factoryMeta = ProgramMetadata.from(factory.meta);
    this.coinMeta = ProgramMetadata.from(factory.coinMeta);
  }

  saveAll() {
    return this.entitiesService.saveAll();
  }

  async handleFactoryEvent(
    payload: string,
    eventInfo: EventInfo
  ): Promise<FactoryEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling marketplace event`);
      const data = this.factoryMeta.createType<FactoryEventPlain>(
        this.factoryMeta.types.handle.output!,
        payload
      );
      const parsed = data.toJSON() as { ok: FactoryEventPlain } | null;
      if (!parsed || !parsed.ok) {
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting factory event ${JSON.stringify(
          parsed.ok
        )}`
      );
      const event = getFactoryEvent(parsed.ok);
      if (!event) {
        console.warn(`${blockNumber}-${messageId}: unknown event type`, parsed);
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
    payload: string,
    eventInfo: EventInfo
  ): Promise<CoinEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling coin event`);
      const data = this.coinMeta.createType<CoinEventPlain>(
        this.coinMeta.types.handle.output!,
        payload
      );
      const parsed = data.toJSON() as { ok: CoinEventPlain } | null;
      if (!parsed || !parsed.ok) {
        console.warn(
          `${blockNumber}-${messageId}: failed to parse event`,
          parsed,
          payload
        );
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting coin event ${JSON.stringify(
          parsed.ok
        )}`
      );
      const event = getCoinEvent(parsed.ok);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown coin event type`,
          parsed
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
