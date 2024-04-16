import { EntitiesService } from "../entities.service";
import { v4 as uuidv4 } from "uuid";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin, Transfer } from "../../model";
import { NullAddress } from "../../consts";
import { TransferEvent } from "../../types/coin.events";
import {deductBalance} from "../../types/balance.utils";

export class TransferredHandler implements ICoinEventHandler {
  async handle(
    event: TransferEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { from, to, amount } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[TransferredHandler] ${address}: coin is not found`);
      return;
    }
    const fromBalance = await storage.getAccountBalance(from, coin);
    storage.addTransfer(
      new Transfer({
        id: uuidv4(),
        coin: coin,
        from,
        to,
        amount,
        blockNumber,
        timestamp,
        extrinsicHash: txHash,
      })
    );
    if (from === NullAddress) {
      console.log(`from is NullAddress and amount is added to to account balance ${amount}`)
      fromBalance.balance += amount;
      const toBalance = await storage.getAccountBalance(to, coin);
      if (toBalance.balance === BigInt(0)) {
        coin.holders += 1;
      }
      toBalance.balance += amount;
      await storage.setAccountBalance(toBalance);
      coin.circulatingSupply = coin.circulatingSupply + amount
    } else if (to === NullAddress) {
      deductBalance(fromBalance, amount);
      coin.circulatingSupply = coin.circulatingSupply - amount
      coin.burned = coin.burned + amount
    } else {
      fromBalance.balance -= amount;
      const toBalance = await storage.getAccountBalance(to, coin);
      if (toBalance.balance === BigInt(0)) {
        coin.holders += 1;
      }
      toBalance.balance += amount;
      await storage.setAccountBalance(toBalance);
      if (!coin.admins.includes(to)) {
        coin.distributed += amount
      }
    }
    if (fromBalance.balance === BigInt(0)) {
      coin.holders -= 1;
    }
    await storage.setAccountBalance(fromBalance);

    await storage.setCoin(
      new Coin({
        ...coin,
      })
    );
  }
}
