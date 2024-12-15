import { decodeFunctionResult, encodeFunctionData, parseAbi } from "viem"

/**
 * Fetches an account's balance history for a vault.
 * 
 * @dev Pass in the `twabOffset` to save on extra queries when fetching data from the same twab controller more than once.
 * @param {{
 *  client: import("viem").PublicClient
 *  account?: import("viem").Address
 *  vault: import("viem").Address
 *  twabController: import("viem").Address
 *  twabOffset?: number
 *  blockNumber?: bigint
 * }}
 * @returns {{
 *  cumulativeBalance: BigInt,
 *  balance: BigInt,
 *  timestamp: number
 * }[]}
 */
export const getMaxObservationHistory = async ({
  client,
  account,
  vault,
  twabController,
  twabOffset,
  blockNumber
}) => {
  if (twabOffset === undefined) {
    twabOffset = await client.readContract({
      address: twabController,
      abi: parseAbi(["function PERIOD_OFFSET() external view returns (uint32)"]),
      functionName: "PERIOD_OFFSET"
    })
  }
  const res = await client.call({
    to: twabController,
    data: encodeFunctionData({
      abi: observationFetcherAbi,
      functionName: "getObservations",
      args: [vault, ...(account ? [account] : [])]
    }),
    stateOverride: [{
      address: twabController,
      code: observationFetcherBytecode
    }],
    blockNumber
  })
  if (res.data) {
    const observations = decodeFunctionResult({
      abi: parseAbi(["function foo() returns(bytes32[] memory)"]),
      data: res.data
    })
    return observations.map(x => ({
      cumulativeBalance: BigInt(`0x${x.slice(34)}`),
      balance: BigInt(`0x${x.slice(10, 34)}`),
      timestamp: parseInt(`0x${x.slice(2, 10)}`) + twabOffset
    }))
  } else {
    throw new Error(`Failed to fetch twab history...`)
  }
}

const observationFetcherAbi = parseAbi([
  "function getObservations(address vault) external view returns (bytes32[] memory)",
  "function getObservations(address vault, address account) external view returns (bytes32[] memory)"
])
const observationFetcherBytecode = "0x608060405234801561001057600080fd5b50600436106100365760003560e01c80638ecc5eda1461003b578063ef2976a914610064575b600080fd5b61004e6100493660046101f3565b610077565b60405161005b919061020e565b60405180910390f35b61004e610072366004610252565b6100a1565b6001600160a01b038116600090815260016020526040902060609061009b906100d7565b92915050565b6001600160a01b038083166000908152602081815260408083209385168352929052206060906100d0906100d7565b9392505050565b80546060906001830190600160d01b900461ffff168067ffffffffffffffff81111561010557610105610285565b60405190808252806020026020018201604052801561012e578160200160208202803683370190505b508454909350600160c01b900461ffff16600061447083106101505781610153565b60005b9050600061447084106101715761016c836144706102b1565b610173565b835b90505b808210156101cd578461018b614470846102c4565b614470811061019c5761019c6102e6565b01548683815181106101b0576101b06102e6565b6020908102919091010152816101c5816102fc565b925050610176565b5050505050919050565b80356001600160a01b03811681146101ee57600080fd5b919050565b60006020828403121561020557600080fd5b6100d0826101d7565b6020808252825182820181905260009190848201906040850190845b818110156102465783518352928401929184019160010161022a565b50909695505050505050565b6000806040838503121561026557600080fd5b61026e836101d7565b915061027c602084016101d7565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561009b5761009b61029b565b6000826102e157634e487b7160e01b600052601260045260246000fd5b500690565b634e487b7160e01b600052603260045260246000fd5b60006001820161030e5761030e61029b565b506001019056fea264697066735822122067217eb60424e6d03c16a4ac36935e23f71560f62296e95462dcc0cf59b3149764736f6c63430008130033"