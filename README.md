# pt-v5-twab-history

Library to quickly query historical balance information for a Pool Together V5 vault or user account.

## Installation

`npm i pt-v5-twab-history`

## Example

```js
import { getTwabHistory } from "pt-v5-twab-history";
import { createPublicClient, http } from "viem";
import { optimism } from "viem/chains";

getTwabHistory({
  viemClient: createPublicClient({ chain: optimism, transport: http() }), // can also define `rpcUrl` or `customTransportParams` instead
  twabController: "0xCB0672dE558Ad8F122C0E081f0D35480aB3be167",
  vault: "0x03D3CE84279cB6F54f5e6074ff0F8319d830dafe",
  account: "0xa184aa8488908b43cCf43b5Ef13Ae528693Dfd00", // optional
  // blockNumber: BigInt(0x716462d), // optional, can be used to query further in the past
  // twabOffset: 0, // optional, can be used to skip the TWAB offset query if relative timestamps are acceptable or if the caller already knows the TWAB offset
}).then(console.log)

// Output:
[
  {
    cumulativeBalance: 13021898560n,
    balance: 357641957n,
    timestamp: 1733765167
  }
]
```