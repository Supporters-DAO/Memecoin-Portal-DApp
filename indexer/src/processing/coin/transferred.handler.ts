import { EntitiesService } from "../entities.service";
import { v4 as uuidv4 } from "uuid";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin, Transfer } from "../../model";
import { NullAddress } from "../../consts";
import { TransferEvent } from "../../types/coin.events";

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
      await storage.setCoin(
        new Coin({
          ...coin,
          distributed: coin.distributed + amount,
        })
      );
    } else if (to === NullAddress) {
      await storage.setCoin(
        new Coin({
          ...coin,
          distributed: coin.distributed - amount,
        })
      );
    }
  }
}
