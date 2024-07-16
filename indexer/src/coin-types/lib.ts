// @ts-nocheck
import {
  ActorId,
  TransactionBuilder,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
} from "sails-js";
import { GearApi, decodeAddress } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";

export interface Init {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  external_links: ExternalLinks;
  initial_supply: number | string | bigint;
  max_supply: number | string | bigint;
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

export class Program {
  public readonly registry: TypeRegistry;
  public readonly vft: Vft;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      Init: {
        name: "String",
        symbol: "String",
        decimals: "u8",
        description: "String",
        external_links: "ExternalLinks",
        initial_supply: "U256",
        max_supply: "U256",
        admin_id: "[u8;32]",
      },
      ExternalLinks: {
        image: "String",
        website: "Option<String>",
        telegram: "Option<String>",
        twitter: "Option<String>",
        discord: "Option<String>",
        tokenomics: "Option<String>",
      },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.vft = new Vft(this);
  }

  newCtorFromCode(
    code: Uint8Array | Buffer,
    init: Init
  ): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "upload_program",
      ["New", init],
      "(String, Init)",
      "String",
      code
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, init: Init) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "create_program",
      ["New", init],
      "(String, Init)",
      "String",
      codeId
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class Vft {
  constructor(private _program: Program) {}

  public burn(
    from: ActorId,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "Burn", from, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public changeDescription(new_description: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "ChangeDescription", new_description],
      "(String, String, String)",
      "Null",
      this._program.programId
    );
  }

  public changeExternalLinks(
    new_external_links: ExternalLinks
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "ChangeExternalLinks", new_external_links],
      "(String, String, ExternalLinks)",
      "Null",
      this._program.programId
    );
  }

  public changeImageLink(new_image_link: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "ChangeImageLink", new_image_link],
      "(String, String, String)",
      "Null",
      this._program.programId
    );
  }

  public grantAdminRole(to: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "GrantAdminRole", to],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public grantBurnerRole(to: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "GrantBurnerRole", to],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public grantMinterRole(to: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "GrantMinterRole", to],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public kill(inheritor: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "Kill", inheritor],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public mint(
    to: ActorId,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "Mint", to, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public revokeAdminRole(from: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "RevokeAdminRole", from],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public revokeBurnerRole(from: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "RevokeBurnerRole", from],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public revokeMinterRole(from: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "RevokeMinterRole", from],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public transferToUsers(
    to: Array<ActorId>,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "TransferToUsers", to, value],
      "(String, String, Vec<[u8;32]>, U256)",
      "bool",
      this._program.programId
    );
  }

  public approve(
    spender: ActorId,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "Approve", spender, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public transfer(
    to: ActorId,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "Transfer", to, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public transferFrom(
    from: ActorId,
    to: ActorId,
    value: number | string | bigint
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Vft", "TransferFrom", from, to, value],
      "(String, String, [u8;32], [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public async admins(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<ActorId>> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Admins"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async burners(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<ActorId>> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Burners"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async description(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Description"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, String)",
      reply.payload
    );
    return result[2].toString() as unknown as string;
  }

  public async externalLinks(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<ExternalLinks> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "ExternalLinks"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, ExternalLinks)",
      reply.payload
    );
    return result[2].toJSON() as unknown as ExternalLinks;
  }

  public async maxSupply(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "MaxSupply"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as bigint;
  }

  public async minters(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<ActorId>> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Minters"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async allowance(
    owner: ActorId,
    spender: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType("(String, String, [u8;32], [u8;32])", [
        "Vft",
        "Allowance",
        owner,
        spender,
      ])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as bigint;
  }

  public async balanceOf(
    account: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType("(String, String, [u8;32])", ["Vft", "BalanceOf", account])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as bigint;
  }

  public async decimals(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Decimals"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, u8)",
      reply.payload
    );
    return result[2].toNumber() as unknown as number;
  }

  public async name(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Name"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, String)",
      reply.payload
    );
    return result[2].toString() as unknown as string;
  }

  public async symbol(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "Symbol"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, String)",
      reply.payload
    );
    return result[2].toString() as unknown as string;
  }

  public async totalSupply(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType("(String, String)", ["Vft", "TotalSupply"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString()
      );
    const result = this._program.registry.createType(
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as bigint;
  }

  public subscribeToMintedEvent(
    callback: (data: {
      to: ActorId;
      value: number | string | bigint;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "Minted"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"to":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as unknown as {
              to: ActorId;
              value: number | string | bigint;
            }
          );
        }
      }
    );
  }

  public subscribeToBurnedEvent(
    callback: (data: {
      from: ActorId;
      value: number | string | bigint;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "Burned"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as unknown as {
              from: ActorId;
              value: number | string | bigint;
            }
          );
        }
      }
    );
  }

  public subscribeToKilledEvent(
    callback: (data: { inheritor: ActorId }) => void | Promise<void>
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "Killed"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"inheritor":"[u8;32]"})',
                message.payload
              )[2]
              .toJSON() as unknown as { inheritor: ActorId }
          );
        }
      }
    );
  }

  public subscribeToTransferredToUsersEvent(
    callback: (data: {
      from: ActorId;
      to: Array<ActorId>;
      value: number | string | bigint;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "TransferredToUsers"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","to":"Vec<[u8;32]>","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as unknown as {
              from: ActorId;
              to: Array<ActorId>;
              value: number | string | bigint;
            }
          );
        }
      }
    );
  }

  public subscribeToDescriptionChangedEvent(
    callback: (data: { new_description: string }) => void | Promise<void>
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "DescriptionChanged"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"new_description":"String"})',
                message.payload
              )[2]
              .toJSON() as unknown as { new_description: string }
          );
        }
      }
    );
  }

  public subscribeToImageLinkChangedEvent(
    callback: (data: { new_image_link: string }) => void | Promise<void>
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "ImageLinkChanged"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"new_image_link":"String"})',
                message.payload
              )[2]
              .toJSON() as unknown as { new_image_link: string }
          );
        }
      }
    );
  }

  public subscribeToExternalLinksChangedEvent(
    callback: (data: {
      new_external_links: ExternalLinks;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "ExternalLinksChanged"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"new_external_links":"ExternalLinks"})',
                message.payload
              )[2]
              .toJSON() as unknown as { new_external_links: ExternalLinks }
          );
        }
      }
    );
  }

  public subscribeToApprovalEvent(
    callback: (data: {
      owner: ActorId;
      spender: ActorId;
      value: number | string | bigint;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "Approval"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"owner":"[u8;32]","spender":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as unknown as {
              owner: ActorId;
              spender: ActorId;
              value: number | string | bigint;
            }
          );
        }
      }
    );
  }

  public subscribeToTransferEvent(
    callback: (data: {
      from: ActorId;
      to: ActorId;
      value: number | string | bigint;
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
          getServiceNamePrefix(payload) === "Vft" &&
          getFnNamePrefix(payload) === "Transfer"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","to":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as unknown as {
              from: ActorId;
              to: ActorId;
              value: number | string | bigint;
            }
          );
        }
      }
    );
  }
}
