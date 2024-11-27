import { Sails, getFnNamePrefix, getServiceNamePrefix } from "sails-js";
import { readFileSync } from "fs";
import { HexString } from "@gear-js/api";
import { ActorId, Init } from "../factory-types/lib";
import { safeUnwrapToBigInt, safeUnwrapToNumber } from "./event.utils";

let instance: MemeFactoryEventsParser | undefined;

export async function getMemeFactoryEventsParser(): Promise<MemeFactoryEventsParser> {
  if (!instance) {
    instance = new MemeFactoryEventsParser();
    await instance.init();
  }
  return instance;
}

export enum FactoryEventType {
  MemeCreated = "MemeCreated",
  MemeRemoved = "MemeRemoved",
}

export type MemeCreatedEvent = {
  type: FactoryEventType.MemeCreated;
  address: string;
  memeId: string;
  config: CreatedConfig;
};

export type MemeRemovedEvent = {
  type: FactoryEventType.MemeRemoved;
  memeId: string;
};

export type CreatedConfig = {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  initialSupply: bigint;
  maxSupply: bigint;
  admin: string;
  initialCapacity: bigint;
  image?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  website?: string | null;
  tokenomics?: string | null;
};

export type FactoryEvent = MemeCreatedEvent | MemeRemovedEvent;

export class MemeFactoryEventsParser {
  private sails?: Sails;

  async init() {
    const idl = readFileSync("./assets/meme-factory.idl", "utf-8");
    this.sails = await Sails.new();

    this.sails.parseIdl(idl);
  }

  getFactoryEvent(payload: HexString): FactoryEvent | undefined {
    if (!this.sails) {
      throw new Error(`sails is not initialized`);
    }
    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);
    if (!this.sails.services[serviceName].events[functionName]) {
      return undefined;
    }
    const ev =
      this.sails.services[serviceName].events[functionName].decode(payload);
    switch (functionName) {
      case "MemeCreated": {
        const event = ev as {
          meme_id: number | string;
          meme_address: ActorId;
          init: Init;
        };
        return {
          type: FactoryEventType.MemeCreated,
          address: event.meme_address.toString(),
          memeId: event.meme_id.toString(),
          config: {
            name: event.init.name,
            symbol: event.init.symbol,
            decimals: safeUnwrapToNumber(event.init.decimals)!,
            description: event.init.description,
            initialSupply: safeUnwrapToBigInt(event.init.initial_supply)!,
            maxSupply: safeUnwrapToBigInt(event.init.max_supply)!,
            admin: event.init.admin_id.toString(),
            initialCapacity: safeUnwrapToBigInt(event.init.initial_supply)!,
            image: event.init.external_links.image,
            twitter: event.init.external_links.twitter,
            telegram: event.init.external_links.telegram,
            discord: event.init.external_links.discord,
            website: event.init.external_links.website,
            tokenomics: event.init.external_links.tokenomics,
          },
        };
      }
      case "MemeRemoved": {
        const event = ev as {
          meme_id: number | string;
        };
        return {
          type: FactoryEventType.MemeRemoved,
          memeId: event.meme_id.toString(),
        };
      }
    }
    return undefined;
  }
}
