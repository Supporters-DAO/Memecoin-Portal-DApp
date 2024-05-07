// @ts-nocheck
import { GearApi, decodeAddress } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import {
  TransactionBuilder,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
} from "sails-js";

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

export type ActorId = [Array<number | string>];

export type Role = "admin" | "burner" | "minter";

export class Program {
  public readonly registry: TypeRegistry;
  public readonly admin: Admin;
  public readonly erc20: Erc20;
  public readonly pausable: Pausable;
  public readonly roles: Roles;

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
      ActorId: "([u8; 32])",
      Role: { _enum: ["Admin", "Burner", "Minter"] },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.admin = new Admin(this);
    this.erc20 = new Erc20(this);
    this.pausable = new Pausable(this);
    this.roles = new Roles(this);
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

export class Admin {
  constructor(private _program: Program) {}

  public allowancesReserve(
    additional: number | string
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "AllowancesReserve", additional],
      "(String, String, u32)",
      "Null",
      this._program.programId
    );
  }

  public balancesReserve(
    additional: number | string
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "BalancesReserve", additional],
      "(String, String, u32)",
      "Null",
      this._program.programId
    );
  }

  public burn(
    from: `0x${string}` | Uint8Array,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "Burn", from, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public grantRole(
    to: `0x${string}` | Uint8Array,
    role: Role
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "GrantRole", to, role],
      "(String, String, [u8;32], Role)",
      "bool",
      this._program.programId
    );
  }

  public kill(inheritor: `0x${string}` | Uint8Array): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "Kill", inheritor],
      "(String, String, [u8;32])",
      "Null",
      this._program.programId
    );
  }

  public mint(
    to: `0x${string}` | Uint8Array,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "Mint", to, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public removeRole(
    from: `0x${string}` | Uint8Array,
    role: Role
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "RemoveRole", from, role],
      "(String, String, [u8;32], Role)",
      "bool",
      this._program.programId
    );
  }

  public transferToUsers(
    to: Array<`0x${string}` | Uint8Array>,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Admin", "TransferToUsers", to, value],
      "(String, String, Vec<[u8;32]>, U256)",
      "bool",
      this._program.programId
    );
  }

  public async allowances(
    skip: number | string,
    take: number | string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<
    Array<
      [
        [`0x${string}` | Uint8Array, `0x${string}` | Uint8Array],
        number | string
      ]
    >
  > {
    const payload = this._program.registry
      .createType("(String, String, u32, u32)", [
        "Admin",
        "Allowances",
        skip,
        take,
      ])
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
      "(String, String, Vec<(([u8;32], [u8;32]), U256)>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<
      [
        [`0x${string}` | Uint8Array, `0x${string}` | Uint8Array],
        number | string
      ]
    >;
  }

  public async balances(
    skip: number | string,
    take: number | string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<[`0x${string}` | Uint8Array, number | string]>> {
    const payload = this._program.registry
      .createType("(String, String, u32, u32)", [
        "Admin",
        "Balances",
        skip,
        take,
      ])
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
      "(String, String, Vec<([u8;32], U256)>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<
      [`0x${string}` | Uint8Array, number | string]
    >;
  }

  public async mapsData(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<
    [[number | string, number | string], [number | string, number | string]]
  > {
    const payload = this._program.registry
      .createType("(String, String)", "[Admin, MapsData]")
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
      "(String, String, ((u32, u32), (u32, u32)))",
      reply.payload
    );
    return result[2].toJSON() as unknown as [
      [number | string, number | string],
      [number | string, number | string]
    ];
  }

  public subscribeToMintedEvent(
    callback: (data: {
      to: `0x${string}` | Uint8Array;
      value: number | string;
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
          getServiceNamePrefix(payload) === "Admin" &&
          getFnNamePrefix(payload) === "Minted"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"to":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as {
              to: `0x${string}` | Uint8Array;
              value: number | string;
            }
          );
        }
      }
    );
  }

  public subscribeToBurnedEvent(
    callback: (data: {
      from: `0x${string}` | Uint8Array;
      value: number | string;
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
          getServiceNamePrefix(payload) === "Admin" &&
          getFnNamePrefix(payload) === "Burned"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as {
              from: `0x${string}` | Uint8Array;
              value: number | string;
            }
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
          getServiceNamePrefix(payload) === "Admin" &&
          getFnNamePrefix(payload) === "Killed"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"inheritor":"[u8;32]"})',
                message.payload
              )[2]
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
      value: number | string;
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
          getServiceNamePrefix(payload) === "Admin" &&
          getFnNamePrefix(payload) === "TransferredToUsers"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","to":"Vec<[u8;32]>","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as {
              from: `0x${string}` | Uint8Array;
              to: Array<`0x${string}` | Uint8Array>;
              value: number | string;
            }
          );
        }
      }
    );
  }
}

export class Erc20 {
  constructor(private _program: Program) {}

  public approve(
    spender: `0x${string}` | Uint8Array,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Erc20", "Approve", spender, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public transfer(
    to: `0x${string}` | Uint8Array,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Erc20", "Transfer", to, value],
      "(String, String, [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public transferFrom(
    from: `0x${string}` | Uint8Array,
    to: `0x${string}` | Uint8Array,
    value: number | string
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Erc20", "TransferFrom", from, to, value],
      "(String, String, [u8;32], [u8;32], U256)",
      "bool",
      this._program.programId
    );
  }

  public async allowance(
    owner: `0x${string}` | Uint8Array,
    spender: `0x${string}` | Uint8Array,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String, [u8;32], [u8;32])", [
        "Erc20",
        "Allowance",
        owner,
        spender,
      ])
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
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as number | string;
  }

  public async balanceOf(
    owner: `0x${string}` | Uint8Array,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String, [u8;32])", ["Erc20", "BalanceOf", owner])
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
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as number | string;
  }

  public async decimals(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String)", "[Erc20, Decimals]")
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
      "(String, String, u8)",
      reply.payload
    );
    return result[2].toNumber() as unknown as number | string;
  }

  public async name(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this._program.registry
      .createType("(String, String)", "[Erc20, Name]")
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
      "(String, String, String)",
      reply.payload
    );
    return result[2].toString() as unknown as string;
  }

  public async symbol(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<string> {
    const payload = this._program.registry
      .createType("(String, String)", "[Erc20, Symbol]")
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
      "(String, String, String)",
      reply.payload
    );
    return result[2].toString() as unknown as string;
  }

  public async totalSupply(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<number | string> {
    const payload = this._program.registry
      .createType("(String, String)", "[Erc20, TotalSupply]")
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
      "(String, String, U256)",
      reply.payload
    );
    return result[2].toBigInt() as unknown as number | string;
  }

  public subscribeToApprovalEvent(
    callback: (data: {
      owner: `0x${string}` | Uint8Array;
      spender: `0x${string}` | Uint8Array;
      value: number | string;
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
          getServiceNamePrefix(payload) === "Erc20" &&
          getFnNamePrefix(payload) === "Approval"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"owner":"[u8;32]","spender":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as {
              owner: `0x${string}` | Uint8Array;
              spender: `0x${string}` | Uint8Array;
              value: number | string;
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
      value: number | string;
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
          getServiceNamePrefix(payload) === "Erc20" &&
          getFnNamePrefix(payload) === "Transfer"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"from":"[u8;32]","to":"[u8;32]","value":"U256"})',
                message.payload
              )[2]
              .toJSON() as {
              from: `0x${string}` | Uint8Array;
              to: `0x${string}` | Uint8Array;
              value: number | string;
            }
          );
        }
      }
    );
  }
}

export class Pausable {
  constructor(private _program: Program) {}

  public delegateAdmin(
    actor: `0x${string}` | Uint8Array
  ): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Pausable", "DelegateAdmin", actor],
      "(String, String, [u8;32])",
      "bool",
      this._program.programId
    );
  }

  public pause(): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Pausable", "Pause"],
      "(String, String)",
      "bool",
      this._program.programId
    );
  }

  public unpause(): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Pausable", "Unpause"],
      "(String, String)",
      "bool",
      this._program.programId
    );
  }

  public async isPaused(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<boolean> {
    const payload = this._program.registry
      .createType("(String, String)", "[Pausable, IsPaused]")
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
      "(String, String, bool)",
      reply.payload
    );
    return result[2].toJSON() as unknown as boolean;
  }

  public subscribeToPausedEvent(
    callback: (data: null) => void | Promise<void>
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
          getServiceNamePrefix(payload) === "Pausable" &&
          getFnNamePrefix(payload) === "Paused"
        ) {
          callback(null);
        }
      }
    );
  }

  public subscribeToUnpausedEvent(
    callback: (data: null) => void | Promise<void>
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
          getServiceNamePrefix(payload) === "Pausable" &&
          getFnNamePrefix(payload) === "Unpaused"
        ) {
          callback(null);
        }
      }
    );
  }
}

export class Roles {
  constructor(private _program: Program) {}

  public async hasRole(
    actor: `0x${string}` | Uint8Array,
    role: string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<boolean> {
    const payload = this._program.registry
      .createType("(String, String, [u8;32], String)", [
        "Roles",
        "HasRole",
        actor,
        role,
      ])
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
      "(String, String, bool)",
      reply.payload
    );
    return result[2].toJSON() as unknown as boolean;
  }

  public async roles(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`
  ): Promise<Array<string>> {
    const payload = this._program.registry
      .createType("(String, String)", "[Roles, Roles]")
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
      "(String, String, Vec<String>)",
      reply.payload
    );
    return result[2].toJSON() as unknown as Array<string>;
  }

  public subscribeToRoleGrantedEvent(
    callback: (data: {
      actor: `0x${string}` | Uint8Array;
      role: string;
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
          getServiceNamePrefix(payload) === "Roles" &&
          getFnNamePrefix(payload) === "RoleGranted"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"actor":"[u8;32]","role":"String"})',
                message.payload
              )[2]
              .toJSON() as { actor: `0x${string}` | Uint8Array; role: string }
          );
        }
      }
    );
  }

  public subscribeToRoleRemovedEvent(
    callback: (data: {
      actor: `0x${string}` | Uint8Array;
      role: string;
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
          getServiceNamePrefix(payload) === "Roles" &&
          getFnNamePrefix(payload) === "RoleRemoved"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"actor":"[u8;32]","role":"String"})',
                message.payload
              )[2]
              .toJSON() as { actor: `0x${string}` | Uint8Array; role: string }
          );
        }
      }
    );
  }
}
