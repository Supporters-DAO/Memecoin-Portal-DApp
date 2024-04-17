import {
  Enum,
  Option,
  Text,
  Vec,
  u64,
  u128,
  u32,
  u16,
  u8,
} from "@polkadot/types";
import { Hash } from "@polkadot/types/interfaces";
import {
  safeUnwrapOptional,
  safeUnwrapToBigInt,
  safeUnwrapToNumber,
} from "./event.utils";

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

export interface FactoryEventPlain extends Enum {
  memeCreated: {
    memeId: Option<u64>;
    memeAddress: Text;
    initConfig: {
      name: Text;
      symbol: Text;
      decimals: u8;
      description: Text;
      initialSupply: u128;
      totalSupply: u128;
      admin: Hash;
      initialCapacity: Option<u128>;
      externalLinks: {
        image: Option<Text>;
        twitter: Option<Text>;
        telegram: Option<Text>;
        discord: Option<Text>;
        website: Option<Text>;
        tokenomics: Option<Text>;
      };
    };
  };
}

export function getFactoryEvent(
  event: FactoryEventPlain
): FactoryEvent | undefined {
  if (event.memeCreated) {
    const capacity = safeUnwrapOptional<u128, u128>(
      event.memeCreated.initConfig.initialCapacity
    );
    return {
      type: FactoryEventType.MemeCreated,
      address: event.memeCreated.memeAddress.toString(),
      config: {
        name: event.memeCreated.initConfig.name.toString(),
        symbol: event.memeCreated.initConfig.symbol.toString(),
        decimals: safeUnwrapToNumber(event.memeCreated.initConfig.decimals)!,
        description: event.memeCreated.initConfig.description.toString(),
        initialSupply: safeUnwrapToBigInt(
          event.memeCreated.initConfig.initialSupply
        )!,
        totalSupply: safeUnwrapToBigInt(
          event.memeCreated.initConfig.totalSupply
        )!,
        admin: event.memeCreated.initConfig.admin.toString(),
        initialCapacity: safeUnwrapToBigInt(capacity)!,
        image: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.image
        ),
        twitter: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.twitter
        ),
        telegram: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.telegram
        ),
        discord: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.discord
        ),
        website: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.website
        ),
        tokenomics: safeUnwrapOptional<Text, string>(
          event.memeCreated.initConfig.externalLinks.tokenomics
        ),
      },
    };
  }
}
