import { EntitiesService } from "../entities.service";
import { EventInfo } from "../event-info.type";
import { FactoryEvent } from "../../types/factory.events";

export interface IFactoryEventHandler {
  handle(
    event: FactoryEvent,
    eventInfo: EventInfo,
    storage: EntitiesService
  ): Promise<void>;
}
