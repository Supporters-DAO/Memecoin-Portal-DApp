import { Enum, u128, Vec } from "@polkadot/types";
import { Hash } from "@polkadot/types/interfaces";
import { safeUnwrapToBigInt } from "./event.utils";

export enum CoinEventType {
  Transferred = "Transferred",
  TransferredToUsers = "TransferredToUsers",
  AdminAdded = "AdminAdded",
  AdminRemoved = "AdminRemoved",
}

export type TransferEvent = {
  type: CoinEventType.Transferred;
  from: string;
  to: string;
  amount: bigint;
};

export type TransferredToUsersEvent = {
  type: CoinEventType.TransferredToUsers;
  from: string;
  to: string[];
  amount: bigint;
};

export type AdminAddedEvent = {
  type: CoinEventType.AdminAdded;
  admin: string;
};

export type AdminDeletedEvent = {
  type: CoinEventType.AdminRemoved;
  admin: string;
};

export type CoinEvent =
  | TransferEvent
  | TransferredToUsersEvent
  | AdminAddedEvent
  | AdminDeletedEvent;

export interface CoinEventPlain extends Enum {
  transferred: {
    from: Hash;
    to: Hash;
    amount: u128;
  };
  burned: {
    amount: u128;
  };
  adminAdded: {
    adminId: Hash;
  };
  adminDeleted: {
    adminId: Hash;
  };
  transferredToUsers: {
    from: Hash;
    amount: u128;
    toUsers: Vec<Hash>;
  };
}

export function getCoinEvent(event: CoinEventPlain): CoinEvent | undefined {
  // if (event.transferred) {
  //   return {
  //     type: CoinEventType.Transferred,
  //     from: event.transferred.from.toString(),
  //     to: event.transferred.to.toString(),
  //     amount: safeUnwrapToBigInt(event.transferred.amount)!,
  //   };
  // }
  // if (event.adminAdded) {
  //   return {
  //     type: CoinEventType.AdminAdded,
  //     admin: event.adminAdded.adminId.toString(),
  //   };
  // }
  // if (event.adminDeleted) {
  //   return {
  //     type: CoinEventType.AdminRemoved,
  //     admin: event.adminDeleted.adminId.toString(),
  //   };
  // }
  // if (event.transferredToUsers) {
  //   return {
  //     type: CoinEventType.TransferredToUsers,
  //     from: event.transferredToUsers.from.toString(),
  //     to: event.transferredToUsers.toUsers.map((u) => u.toString()),
  //     amount: safeUnwrapToBigInt(event.transferredToUsers.amount)!,
  //   };
  // }
  return undefined;
}
