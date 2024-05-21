import { EntitiesService } from "../entities.service";
import { CoinEvent } from "../../types/coin.events";
import { EventInfo } from "../event-info.type";

export interface ICoinEventHandler {
  handle(
    event: CoinEvent,
    eventInfo: EventInfo,
    storage: EntitiesService
  ): Promise<void>;
}
