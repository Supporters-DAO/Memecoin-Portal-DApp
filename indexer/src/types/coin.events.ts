import { Enum, u128 } from "@polkadot/types";
import { Hash } from "@polkadot/types/interfaces";
import { safeUnwrapToBigInt } from "./event.utils";

export enum CoinEventType {
  Transferred = "Transferred",
  AdminAdded = "AdminAdded",
  AdminRemoved = "AdminRemoved",
}

export type TransferEvent = {
  type: CoinEventType.Transferred;
  from: string;
  to: string;
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

export type CoinEvent = TransferEvent | AdminAddedEvent | AdminDeletedEvent;

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
}

export function getCoinEvent(event: CoinEventPlain): CoinEvent | undefined {
  if (event.transferred) {
    return {
      type: CoinEventType.Transferred,
      from: event.transferred.from.toString(),
      to: event.transferred.to.toString(),
      amount: safeUnwrapToBigInt(event.transferred.amount)!,
    };
  }
  if (event.adminAdded) {
    return {
      type: CoinEventType.AdminAdded,
      admin: event.adminAdded.adminId.toString(),
    };
  }
  if (event.adminDeleted) {
    return {
      type: CoinEventType.AdminRemoved,
      admin: event.adminDeleted.adminId.toString(),
    };
  }
  return undefined;
}
