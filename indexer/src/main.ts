import { TypeormDatabase } from "@subsquid/typeorm-store";

import { processor } from "./processor";
import { EventsProcessing } from "./processing/events.processing";
import { EventInfo } from "./processing/event-info.type";
import { Block } from "@subsquid/substrate-processor";
import { EntitiesService } from "./processing/entities.service";
import { getLocalStorage } from "./processing/storage/local.storage";
import { BatchService } from "./processing/batch.service";
import { getMemeFactoryEventsParser } from "./types/factory.events";
import { getCoinEventsParser } from "./types/coin.events";
import { DnsService, getDnsService } from "./dns/dns.service";
import { config } from "./config";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

function getBlockDate(
  block: Block<{ block: { timestamp: boolean }; event: { args: boolean } }>
) {
  return new Date(block.header.timestamp ?? new Date().getTime());
}

processor.run(new TypeormDatabase(), async (ctx) => {
  const dnsService = await getDnsService(config.dnsApiUrl);
  const localStorage = await getLocalStorage(ctx.store);
  const batchService = new BatchService(ctx.store);
  const entitiesService = new EntitiesService(
    localStorage,
    batchService,
    dnsService
  );
  await entitiesService.init();
  const memeFactoryParser = await getMemeFactoryEventsParser();
  const coinParser = await getCoinEventsParser();
  const processing = new EventsProcessing(
    entitiesService,
    localStorage,
    memeFactoryParser,
    coinParser
  );
  const firstBlockDate = getBlockDate(ctx.blocks[0]);
  console.log(
    `[main] start processing ${ctx.blocks.length} blocks at ${firstBlockDate}.`
  );
  for (const block of ctx.blocks) {
    const { events } = block;
    const timestamp = getBlockDate(block);
    for (const item of events) {
      const {
        message: { source, payload, details, destination, id },
      } = item.args;
      if (payload === "0x") {
        continue;
      }
      if (details && details.code.__kind !== "Success") {
        continue;
      }
      const eventInfo: EventInfo = {
        blockNumber: block.header.height,
        destination,
        source,
        timestamp,
        messageId: id,
        txHash: id,
      };
      const dnsEvent = await dnsService.handleEvent(item);
      if (dnsEvent && dnsEvent.address === config.dnsProgramName) {
        const factory = await localStorage.getFactory();
        if (factory) {
          factory.address = dnsEvent.address;
          localStorage.setFactory(factory);
          batchService.addFactory(factory);
        }
      }
      const factoryAddress = await dnsService.getAddressByName(
        config.dnsProgramName
      );
      if (factoryAddress === source) {
        await processing.handleFactoryEvent(payload, eventInfo);
      } else {
        const coin = await localStorage.getCoin(source);
        if (coin) {
          await processing.handleCoinEvent(payload, eventInfo);
        }
      }
    }
  }
  await processing.saveAll();
});
