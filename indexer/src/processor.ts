import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { config } from "./config";
import { hostname } from "os";

export const processor = new SubstrateBatchProcessor()
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ENDPOINT),
    rateLimit: config.rateLimit,
    headers: {
      "User-Agent": hostname(),
    },
  })
  .addEvent({
    name: ["Gear.UserMessageSent"],
  })
  .setFields({
    event: {
      args: true,
    },
    block: {
      timestamp: true,
    },
  })
  .setBlockRange({ from: config.minBlockNum });

if (config.gateway) {
  processor.setGateway(config.gateway);
}

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
