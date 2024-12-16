import { createPublicClient, http } from "viem";
import { getTwabHistory } from "./src/index.js";
import { optimism } from "viem/chains";

getTwabHistory({
  // rpcUrl: "https://mainnet.optimism.io/", // can be used instead of `viemClient`
  // customTransportParams: [{ request: createPublicClient({ chain: optimism, transport: http() }).request }], // can be used instead of `viemClient` for custom providers
  viemClient: createPublicClient({ chain: optimism, transport: http() }),
  twabController: "0xCB0672dE558Ad8F122C0E081f0D35480aB3be167",
  vault: "0x03D3CE84279cB6F54f5e6074ff0F8319d830dafe",
  account: "0xa184aa8488908b43cCf43b5Ef13Ae528693Dfd00", // optional
  // blockNumber: BigInt(0x716462d), // optional, can be used to query further in the past
  // twabOffset: 0, // optional, can be used to skip the TWAB offset query if relative timestamps are acceptable or if the caller already knows the TWAB offset
}).then(console.log)
