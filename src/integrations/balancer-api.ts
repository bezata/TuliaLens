import axios from "axios";
import { BalancerPool, BalancerPoolDetails, Token } from "../types";

const BALANCER_API_URL = "https://api-v3.balancer.fi/graphql";

export class BalancerService {
  async getPools(): Promise<BalancerPool[]> {
    try {
      const response = await axios.post(BALANCER_API_URL, {
        query: `
          {
            poolGetPools(where: {chainIn: [AVALANCHE, ARBITRUM], minTvl: 10000}) {
              id
              address
              name
              chain
            }
          }
        `,
      });

      return response.data.data.poolGetPools;
    } catch (error) {
      console.error("Error fetching Balancer pools:", error);
      throw error;
    }
  }

  async getPoolDetails(
    chainId: string,
    poolId: string
  ): Promise<BalancerPoolDetails> {
    try {
      const response = await axios.post(BALANCER_API_URL, {
        query: `
          query ($poolId: String!, $chain: GqlChain!) {
            poolGetPool(id: $poolId, chain: $chain) {
              id
              address
              name
              type
              allTokens {
                address
                symbol
              }
              poolTokens {
                address
                symbol
                balance
              }
              dynamicData {
                totalLiquidity
                aprItems {
                  title
                  type
                  apr
                }
              }
            }
          }
        `,
        variables: {
          poolId,
          chain: chainId.toUpperCase(),
        },
      });

      const poolData = response.data.data.poolGetPool;

      // Calculate total APR
      const totalApr = poolData.dynamicData.aprItems.reduce(
        (sum: number, item: { apr: number }) => sum + item.apr,
        0
      );

      // Ensure the response matches our BalancerPoolDetails interface
      const poolDetails: BalancerPoolDetails = {
        id: poolData.id,
        address: poolData.address,
        name: poolData.name,
        chain: chainId, // We're using the provided chainId here
        tokens: poolData.poolTokens.map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          balance: parseFloat(token.balance),
        })),
        tvl: parseFloat(poolData.dynamicData.totalLiquidity),
        apr: totalApr,
      };

      return poolDetails;
    } catch (error) {
      console.error(
        `Error fetching pool details for ${chainId}/${poolId}:`,
        error
      );
      throw error;
    }
  }
}