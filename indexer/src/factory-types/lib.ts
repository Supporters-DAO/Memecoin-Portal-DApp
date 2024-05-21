// @ts-nocheck
import { GearApi } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import {
  TransactionBuilder,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
} from "sails-js";

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

export interface Init {
  name: string;
  symbol: string;
  decimals: number | string;
  description: string;
  external_links: ExternalLinks;
  initial_supply: number | string;
  max_supply: number | string;
  admin_id: ActorId;
}

export interface ExternalLinks {
  image: string;
  website: string | null;
  telegram: string | null;
  twitter: string | null;
  discord: string | null;
  tokenomics: string | null;
}

export interface MemeRecord {
  name: string;
  symbol: string;
  decimals: number | string;
  meme_program_id: ActorId;
  admins: Array<ActorId>;
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly memeFactory: MemeFactory;

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
      Init: {
        name: "String",
        symbol: "String",
        decimals: "u8",
        description: "String",
        external_links: "ExternalLinks",
        initial_supply: "U256",
        max_supply: "U256",
        admin_id: "ActorId",
      },
      ExternalLinks: {
        image: "String",
        website: "Option<String>",
        telegram: "Option<String>",
        twitter: "Option<String>",
        discord: "Option<String>",
        tokenomics: "Option<String>",
      },
      MemeRecord: {
        name: "String",
        symbol: "String",
        decimals: "u8",
        meme_program_id: "ActorId",
        admins: "Vec<ActorId>",
      },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.memeFactory = new MemeFactory(this);
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
}

export class MemeFactory {
  constructor(private _program: Program) {}

  public addAdminToFactory(
    admin_actor_id: ActorId
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["MemeFactory", "AddAdminToFactory", admin_actor_id],
      "(String, String, ActorId)",
      "Result<Null, MemeError>",
      this._program.programId
    );
  }

  public createFungibleProgram(
    init: Init
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["MemeFactory", "CreateFungibleProgram", init],
      "(String, String, Init)",
      "Result<Null, MemeError>",
      this._program.programId
    );
  }

  public removeMeme(
    meme_id: number | string
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["MemeFactory", "RemoveMeme", meme_id],
      "(String, String, u64)",
      "Result<Null, MemeError>",
      this._program.programId
    );
  }

  public updateCodeId(
    new_code_id: CodeId
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["MemeFactory", "UpdateCodeId", new_code_id],
      "(String, String, CodeId)",
      "Result<Null, MemeError>",
      this._program.programId
    );
  }

  public updateGasForProgram(
    new_gas_amount: number | string
  ): TransactionBuilder<{ ok: null } | { err: MemeError }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: null } | { err: MemeError }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["MemeFactory", "UpdateGasForProgram", new_gas_amount],
      "(String, String, u64)",
      "Result<Null, MemeError>",
      this._program.programId
    );
  }

  public async admins(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<ActorId>> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, Admins]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, Vec<ActorId>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async gasForProgram(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, GasForProgram]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, u64)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as number | string;
  }

  public async idToAddress(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<[number | string, ActorId]>> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, IdToAddress]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, Vec<(u64, ActorId)>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<[number | string, ActorId]>;
  }

  public async memNumber(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, MemNumber]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, u64)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as number | string;
  }

  public async memeCodeId(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<CodeId> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, MemeCodeId]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, CodeId)",
      reply.payload
    );
    return result[2].toJSON() as unknown as CodeId;
  }

  public async memeCoins(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<[ActorId, Array<[number | string, MemeRecord]>]>> {
    const payload = this._program.registry
      .createType("(String, String)", "[MemeFactory, MemeCoins]")
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      "(String, String, Vec<(ActorId, Vec<(u64, MemeRecord)>)>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<
      [ActorId, Array<[number | string, MemeRecord]>]
    >;
  }

  public subscribeToMemeCreatedEvent(
    callback: (data: {
      meme_id: number | string;
      meme_address: ActorId;
      init: Init;
    }) => void | Promise<void>
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "MemeFactory" &&
          getFnNamePrefix(payload) === "MemeCreated"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"meme_id":"u64","meme_address":"ActorId","init":"Init"})',
                message.payload
              )[2]
              .toJSON() as {
              meme_id: number | string;
              meme_address: ActorId;
              init: Init;
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
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "MemeFactory" &&
          getFnNamePrefix(payload) === "MemeRemoved"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"removed_by":"ActorId","meme_id":"u64"})',
                message.payload
              )[2]
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
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "MemeFactory" &&
          getFnNamePrefix(payload) === "GasUpdatedSuccessfully"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"updated_by":"ActorId","new_gas_amount":"u64"})',
                message.payload
              )[2]
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
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "MemeFactory" &&
          getFnNamePrefix(payload) === "CodeIdUpdatedSuccessfully"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"updated_by":"ActorId","new_code_id":"CodeId"})',
                message.payload
              )[2]
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
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "MemeFactory" &&
          getFnNamePrefix(payload) === "AdminAdded"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"updated_by":"ActorId","admin_actor_id":"ActorId"})',
                message.payload
              )[2]
              .toJSON() as { updated_by: ActorId; admin_actor_id: ActorId }
          );
        }
      }
    );
  }
}
