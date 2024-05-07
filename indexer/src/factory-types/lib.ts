// @ts-nocheck
import { GearApi } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { TransactionBuilder } from "sails-js";
import { u8aToHex, compactFromU8aLim } from "@polkadot/util";

const ZERO_ADDRESS = u8aToHex(new Uint8Array(32));

export interface InitConfigFactory {
  meme_code_id: CodeId;
  factory_admin_account: Array<ActorId>;
  gas_for_program: number | string;
}

export type CodeId = [Array<number | string>];

export type ActorId = [Array<number | string>];

export type MemeError =
  | { programInitializationFailedWithContext: string }
  | { unauthorized: null }
  | { memeExists: null }
  | { memeNotFound: null };

export interface InitConfig {
  name: string;
  symbol: string;
  decimals: number | string;
  description: string;
  external_links: ExternalLinks;
  initial_supply: number | string;
  total_supply: number | string;
  admin: ActorId;
  initial_capacity: number | string | null;
  config: Config;
}

export interface ExternalLinks {
  image: string;
  website: string | null;
  telegram: string | null;
  twitter: string | null;
  discord: string | null;
  tokenomics: string | null;
}

export interface Config {
  tx_storage_period: number | string;
  tx_payment: number | string;
}

export class Program {
  private registry: TypeRegistry;
  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      InitConfigFactory: {
        meme_code_id: "CodeId",
        factory_admin_account: "Vec<ActorId>",
        gas_for_program: "u64",
      },
      CodeId: "([u8; 32])",
      ActorId: "([u8; 32])",
      MemeError: {
        _enum: {
          ProgramInitializationFailedWithContext: "String",
          Unauthorized: "Null",
          MemeExists: "Null",
          MemeNotFound: "Null",
        },
      },
      InitConfig: {
        name: "String",
        symbol: "String",
        decimals: "u8",
        description: "String",
        external_links: "ExternalLinks",
        initial_supply: "u128",
        total_supply: "u128",
        admin: "ActorId",
        initial_capacity: "Option<u32>",
        config: "Config",
      },
      ExternalLinks: {
        image: "String",
        website: "Option<String>",
        telegram: "Option<String>",
        twitter: "Option<String>",
        discord: "Option<String>",
        tokenomics: "Option<String>",
      },
      Config: { tx_storage_period: "u64", tx_payment: "u128" },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  newCtorFromCode(
    code: Uint8Array | Buffer,
    config: InitConfigFactory
  ): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "upload_program",
      ["New", config],
      "(String, InitConfigFactory)",
      "String",
      code
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, config: InitConfigFactory) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "create_program",
      ["New", config],
      "(String, InitConfigFactory)",
      "String",
      codeId
    );

    this.programId = builder.programId;
    return builder;
  }

  public addAdminToFactory(
    admin_actor_id: ActorId
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this.api,
      this.registry,
      "send_message",
      ["AddAdminToFactory", admin_actor_id],
      "(String, ActorId)",
      "Result<Null, MemeError>",
      this.programId
    );
  }

  public createFungibleProgram(
    init_config: InitConfig
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this.api,
      this.registry,
      "send_message",
      ["CreateFungibleProgram", init_config],
      "(String, InitConfig)",
      "Result<Null, MemeError>",
      this.programId
    );
  }

  public removeMeme(
    meme_id: number | string
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this.api,
      this.registry,
      "send_message",
      ["RemoveMeme", meme_id],
      "(String, u64)",
      "Result<Null, MemeError>",
      this.programId
    );
  }

  public updateCodeId(
    new_code_id: CodeId
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this.api,
      this.registry,
      "send_message",
      ["UpdateCodeId", new_code_id],
      "(String, CodeId)",
      "Result<Null, MemeError>",
      this.programId
    );
  }

  public updateGasForProgram(
    new_gas_amount: number | string
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this.api,
      this.registry,
      "send_message",
      ["UpdateGasForProgram", new_gas_amount],
      "(String, u64)",
      "Result<Null, MemeError>",
      this.programId
    );
  }

  public subscribeToMemeCreatedEvent(
    callback: (data: {
      meme_id: number | string;
      meme_address: ActorId;
      init_config: InitConfig;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toU8a();
        const [offset, limit] = compactFromU8aLim(payload);
        const name = this.registry
          .createType("String", payload.subarray(offset, limit))
          .toString();
        if (name === "MemeCreated") {
          callback(
            this.registry
              .createType(
                '(String, {"meme_id":"u64","meme_address":"ActorId","init_config":"InitConfig"})',
                message.payload
              )[1]
              .toJSON() as {
              meme_id: number | string;
              meme_address: ActorId;
              init_config: InitConfig;
            }
          );
        }
      }
    );
  }

  public subscribeToMemeRemovedEvent(
    callback: (data: {
      removed_by: ActorId;
      meme_id: number | string;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toU8a();
        const [offset, limit] = compactFromU8aLim(payload);
        const name = this.registry
          .createType("String", payload.subarray(offset, limit))
          .toString();
        if (name === "MemeRemoved") {
          callback(
            this.registry
              .createType(
                '(String, {"removed_by":"ActorId","meme_id":"u64"})',
                message.payload
              )[1]
              .toJSON() as { removed_by: ActorId; meme_id: number | string }
          );
        }
      }
    );
  }

  public subscribeToGasUpdatedSuccessfullyEvent(
    callback: (data: {
      updated_by: ActorId;
      new_gas_amount: number | string;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toU8a();
        const [offset, limit] = compactFromU8aLim(payload);
        const name = this.registry
          .createType("String", payload.subarray(offset, limit))
          .toString();
        if (name === "GasUpdatedSuccessfully") {
          callback(
            this.registry
              .createType(
                '(String, {"updated_by":"ActorId","new_gas_amount":"u64"})',
                message.payload
              )[1]
              .toJSON() as {
              updated_by: ActorId;
              new_gas_amount: number | string;
            }
          );
        }
      }
    );
  }

  public subscribeToCodeIdUpdatedSuccessfullyEvent(
    callback: (data: {
      updated_by: ActorId;
      new_code_id: CodeId;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toU8a();
        const [offset, limit] = compactFromU8aLim(payload);
        const name = this.registry
          .createType("String", payload.subarray(offset, limit))
          .toString();
        if (name === "CodeIdUpdatedSuccessfully") {
          callback(
            this.registry
              .createType(
                '(String, {"updated_by":"ActorId","new_code_id":"CodeId"})',
                message.payload
              )[1]
              .toJSON() as { updated_by: ActorId; new_code_id: CodeId }
          );
        }
      }
    );
  }

  public subscribeToAdminAddedEvent(
    callback: (data: {
      updated_by: ActorId;
      admin_actor_id: ActorId;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toU8a();
        const [offset, limit] = compactFromU8aLim(payload);
        const name = this.registry
          .createType("String", payload.subarray(offset, limit))
          .toString();
        if (name === "AdminAdded") {
          callback(
            this.registry
              .createType(
                '(String, {"updated_by":"ActorId","admin_actor_id":"ActorId"})',
                message.payload
              )[1]
              .toJSON() as { updated_by: ActorId; admin_actor_id: ActorId }
          );
        }
      }
    );
  }
}
