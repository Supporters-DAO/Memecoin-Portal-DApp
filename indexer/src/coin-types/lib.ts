// @ts-nocheck
import { GearApi, decodeAddress } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { TransactionBuilder } from "sails-js";
import { u8aToHex, compactFromU8aLim } from "@polkadot/util";

const ZERO_ADDRESS = u8aToHex(new Uint8Array(32));

export interface Init {
  name: string;
  symbol: string;
  decimals: number | string;
  description: string;
  external_links: ExternalLinks;
  initial_supply: u256;
  max_supply: u256;
  admin_id: `0x${string}` | Uint8Array;
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
  private registry: TypeRegistry;
  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      Init: {
        name: "String",
        symbol: "String",
        decimals: "u8",
        description: "String",
        external_links: "ExternalLinks",
        initial_supply: "u256",
        max_supply: "u256",
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

  public burn(
    from: `0x${string}` | Uint8Array,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["Burn", from, value],
      "(String, [u8;32], u256)",
      "bool",
      this.programId
    );
  }

  public changeDescription(new_description: string): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["ChangeDescription", new_description],
      "(String, String)",
      "Null",
      this.programId
    );
  }

  public changeExternalLinks(
    new_external_links: ExternalLinks
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["ChangeExternalLinks", new_external_links],
      "(String, ExternalLinks)",
      "Null",
      this.programId
    );
  }

  public changeImageLink(new_image_link: string): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["ChangeImageLink", new_image_link],
      "(String, String)",
      "Null",
      this.programId
    );
  }

  public grantAdminRole(
    to: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["GrantAdminRole", to],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public grantBurnerRole(
    to: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["GrantBurnerRole", to],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public grantMinterRole(
    to: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["GrantMinterRole", to],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public kill(inheritor: `0x${string}` | Uint8Array): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["Kill", inheritor],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public mint(
    to: `0x${string}` | Uint8Array,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["Mint", to, value],
      "(String, [u8;32], u256)",
      "bool",
      this.programId
    );
  }

  public revokeAdminRole(
    from: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["RevokeAdminRole", from],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public revokeBurnerRole(
    from: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["RevokeBurnerRole", from],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public revokeMinterRole(
    from: `0x${string}` | Uint8Array
  ): TransactionBuilder<null> {
    return new TransactionBuilder<null>(
      this.api,
      this.registry,
      "send_message",
      ["RevokeMinterRole", from],
      "(String, [u8;32])",
      "Null",
      this.programId
    );
  }

  public transferToUsers(
    to: Array<`0x${string}` | Uint8Array>,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["TransferToUsers", to, value],
      "(String, Vec<[u8;32]>, u256)",
      "bool",
      this.programId
    );
  }

  public approve(
    spender: `0x${string}` | Uint8Array,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["Approve", spender, value],
      "(String, [u8;32], u256)",
      "bool",
      this.programId
    );
  }

  public transfer(
    to: `0x${string}` | Uint8Array,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["Transfer", to, value],
      "(String, [u8;32], u256)",
      "bool",
      this.programId
    );
  }

  public transferFrom(
    from: `0x${string}` | Uint8Array,
    to: `0x${string}` | Uint8Array,
    value: u256
  ): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      "send_message",
      ["TransferFrom", from, to, value],
      "(String, [u8;32], [u8;32], u256)",
      "bool",
      this.programId
    );
  }

  public async admins(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<`0x${string}` | Uint8Array>> {
    const payload = this.registry.createType("String", "Admins").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType(
      "(String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[1].toJSON() as unknown as Array<`0x${string}` | Uint8Array>;
  }

  public async burners(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<`0x${string}` | Uint8Array>> {
    const payload = this.registry.createType("String", "Burners").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType(
      "(String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[1].toJSON() as unknown as Array<`0x${string}` | Uint8Array>;
  }

  public async description(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this.registry.createType("String", "Description").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, String)", reply.payload);
    return result[1].toString() as unknown as string;
  }

  public async externalLinks(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<ExternalLinks> {
    const payload = this.registry.createType("String", "ExternalLinks").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType(
      "(String, ExternalLinks)",
      reply.payload
    );
    return result[1].toJSON() as unknown as ExternalLinks;
  }

  public async maxSupply(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<u256> {
    const payload = this.registry.createType("String", "MaxSupply").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, u256)", reply.payload);
    return result[1].toJSON() as unknown as u256;
  }

  public async minters(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<`0x${string}` | Uint8Array>> {
    const payload = this.registry.createType("String", "Minters").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType(
      "(String, Vec<[u8;32]>)",
      reply.payload
    );
    return result[1].toJSON() as unknown as Array<`0x${string}` | Uint8Array>;
  }

  public async allowance(
    owner: `0x${string}` | Uint8Array,
    spender: `0x${string}` | Uint8Array,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<u256> {
    const payload = this.registry
      .createType("(String, [u8;32], [u8;32])", ["Allowance", owner, spender])
      .toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, u256)", reply.payload);
    return result[1].toJSON() as unknown as u256;
  }

  public async balanceOf(
    account: `0x${string}` | Uint8Array,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<u256> {
    const payload = this.registry
      .createType("(String, [u8;32])", ["BalanceOf", account])
      .toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, u256)", reply.payload);
    return result[1].toJSON() as unknown as u256;
  }

  public async decimals(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this.registry.createType("String", "Decimals").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, u8)", reply.payload);
    return result[1].toNumber() as unknown as number | string;
  }

  public async name(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this.registry.createType("String", "Name").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, String)", reply.payload);
    return result[1].toString() as unknown as string;
  }

  public async symbol(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this.registry.createType("String", "Symbol").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, String)", reply.payload);
    return result[1].toString() as unknown as string;
  }

  public async totalSupply(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<u256> {
    const payload = this.registry.createType("String", "TotalSupply").toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType("(String, u256)", reply.payload);
    return result[1].toJSON() as unknown as u256;
  }

  public subscribeToMintedEvent(
    callback: (data: {
      to: `0x${string}` | Uint8Array;
      value: u256;
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
        if (name === "Minted") {
          callback(
            this.registry
              .createType(
                '(String, {"to":"[u8;32]","value":"u256"})',
                message.payload
              )[1]
              .toJSON() as { to: `0x${string}` | Uint8Array; value: u256 }
          );
        }
      }
    );
  }

  public subscribeToBurnedEvent(
    callback: (data: {
      from: `0x${string}` | Uint8Array;
      value: u256;
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
        if (name === "Burned") {
          callback(
            this.registry
              .createType(
                '(String, {"from":"[u8;32]","value":"u256"})',
                message.payload
              )[1]
              .toJSON() as { from: `0x${string}` | Uint8Array; value: u256 }
          );
        }
      }
    );
  }

  public subscribeToKilledEvent(
    callback: (data: {
      inheritor: `0x${string}` | Uint8Array;
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
        if (name === "Killed") {
          callback(
            this.registry
              .createType(
                '(String, {"inheritor":"[u8;32]"})',
                message.payload
              )[1]
              .toJSON() as { inheritor: `0x${string}` | Uint8Array }
          );
        }
      }
    );
  }

  public subscribeToTransferredToUsersEvent(
    callback: (data: {
      from: `0x${string}` | Uint8Array;
      to: Array<`0x${string}` | Uint8Array>;
      value: u256;
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
        if (name === "TransferredToUsers") {
          callback(
            this.registry
              .createType(
                '(String, {"from":"[u8;32]","to":"Vec<[u8;32]>","value":"u256"})',
                message.payload
              )[1]
              .toJSON() as {
              from: `0x${string}` | Uint8Array;
              to: Array<`0x${string}` | Uint8Array>;
              value: u256;
            }
          );
        }
      }
    );
  }

  public subscribeToDescriptionChangedEvent(
    callback: (data: { new_description: string }) => void | Promise<void>
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
        if (name === "DescriptionChanged") {
          callback(
            this.registry
              .createType(
                '(String, {"new_description":"String"})',
                message.payload
              )[1]
              .toJSON() as { new_description: string }
          );
        }
      }
    );
  }

  public subscribeToImageLinkChangedEvent(
    callback: (data: { new_image_link: string }) => void | Promise<void>
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
        if (name === "ImageLinkChanged") {
          callback(
            this.registry
              .createType(
                '(String, {"new_image_link":"String"})',
                message.payload
              )[1]
              .toJSON() as { new_image_link: string }
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
        if (name === "ExternalLinksChanged") {
          callback(
            this.registry
              .createType(
                '(String, {"new_external_links":"ExternalLinks"})',
                message.payload
              )[1]
              .toJSON() as { new_external_links: ExternalLinks }
          );
        }
      }
    );
  }

  public subscribeToApprovalEvent(
    callback: (data: {
      owner: `0x${string}` | Uint8Array;
      spender: `0x${string}` | Uint8Array;
      value: u256;
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
        if (name === "Approval") {
          callback(
            this.registry
              .createType(
                '(String, {"owner":"[u8;32]","spender":"[u8;32]","value":"u256"})',
                message.payload
              )[1]
              .toJSON() as {
              owner: `0x${string}` | Uint8Array;
              spender: `0x${string}` | Uint8Array;
              value: u256;
            }
          );
        }
      }
    );
  }

  public subscribeToTransferEvent(
    callback: (data: {
      from: `0x${string}` | Uint8Array;
      to: `0x${string}` | Uint8Array;
      value: u256;
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
        if (name === "Transfer") {
          callback(
            this.registry
              .createType(
                '(String, {"from":"[u8;32]","to":"[u8;32]","value":"u256"})',
                message.payload
              )[1]
              .toJSON() as {
              from: `0x${string}` | Uint8Array;
              to: `0x${string}` | Uint8Array;
              value: u256;
            }
          );
        }
      }
    );
  }
}
