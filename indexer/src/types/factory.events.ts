import { Sails, getFnNamePrefix, getServiceNamePrefix } from "sails-js";
import { readFileSync } from "fs";
import { HexString } from "@gear-js/api";
import { ActorId, InitConfig } from "../factory-types/lib";
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
}

export type MemeCreatedEvent = {
  type: FactoryEventType.MemeCreated;
  address: string;
  config: CreatedConfig;
};

export type CreatedConfig = {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  initialSupply: bigint;
  totalSupply: bigint;
  admin: string;
  initialCapacity: bigint;
  image?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  website?: string | null;
  tokenomics?: string | null;
};

export type FactoryEvent = MemeCreatedEvent;

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
          init_config: InitConfig;
        };
        return {
          type: FactoryEventType.MemeCreated,
          address: event.meme_address.toString(),
          config: {
            name: event.init_config.name,
            symbol: event.init_config.symbol,
            decimals: safeUnwrapToNumber(event.init_config.decimals)!,
            description: event.init_config.description,
            initialSupply: safeUnwrapToBigInt(
              event.init_config.initial_supply
            )!,
            totalSupply: safeUnwrapToBigInt(event.init_config.total_supply)!,
            admin: event.init_config.admin.toString(),
            initialCapacity: safeUnwrapToBigInt(
              event.init_config.initial_capacity
            )!,
            image: event.init_config.external_links.image,
            twitter: event.init_config.external_links.twitter,
            telegram: event.init_config.external_links.telegram,
            discord: event.init_config.external_links.discord,
            website: event.init_config.external_links.website,
            tokenomics: event.init_config.external_links.tokenomics,
          },
        };
      }
    }
    return undefined;
  }
}
