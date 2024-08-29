import axios from "axios";
import { BalancerPool, BalancerPoolDetails, PoolToken, AprItem } from "../types";

const BALANCER_API_URL = "https://api-v3.balancer.fi/graphql";

export class BalancerService {
  async getPools(): Promise<BalancerPool[]> {
    const query = `
      {
        poolGetPools(where: {chainIn: [AVALANCHE, ARBITRUM], minTvl: 10000}) {
          id
          address
          name
          chain
        }
      }
    `;

    try {
      const response = await axios.post(BALANCER_API_URL, { query });
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
    const query = `
      query getPoolDetails($chain: GqlChain!, $id: String!) {
        poolGetPool(chain: $chain, id: $id) {
          id
          name
          type
          version
          address
          chain
          allTokens {
            address
            name
          }
          poolTokens {
            address
            symbol
            balance
            hasNestedPool
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
    `;

    try {
      const response = await axios.post(BALANCER_API_URL, {
        query,
        variables: { chain: chainId.toUpperCase(), id: poolId },
      });

      const poolData = response.data.data.poolGetPool;

      return {
        id: poolData.id,
        address: poolData.address,
        name: poolData.name,
        chain: poolData.chain,
        type: poolData.type,
        version: poolData.version,
        tokens: poolData.poolTokens.map(this.mapPoolToken),
        allTokens: poolData.allTokens,
        tvl: parseFloat(poolData.dynamicData.totalLiquidity),
        aprItems: poolData.dynamicData.aprItems.map(this.mapAprItem),
      };
    } catch (error) {
      console.error(
        `Error fetching pool details for ${chainId}/${poolId}:`,
        error
      );
      throw error;
    }
  }

  private mapPoolToken(token: any): PoolToken {
    return {
      address: token.address,
      symbol: token.symbol,
      balance: parseFloat(token.balance),
      hasNestedPool: token.hasNestedPool,
    };
  }

  private mapAprItem(item: any): AprItem {
    return {
      title: item.title,
      type: item.type,
      apr: parseFloat(item.apr),
    };
  }
}
