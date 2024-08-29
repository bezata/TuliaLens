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
      const response = await axios.get<BalancerPoolDetails>(
        `https://api-v3.balancer.fi/pools/${chainId}/${poolId}`
      );

      // Ensure the response matches our BalancerPoolDetails interface
      const poolDetails: BalancerPoolDetails = {
        id: response.data.id,
        address: response.data.address,
        name: response.data.name,
        chain: response.data.chain,
        tokens: response.data.tokens.map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          balance: parseFloat(token.balance),
        })),
        tvl: parseFloat(response.data.tvl),
        apr: parseFloat(response.data.apr),
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
