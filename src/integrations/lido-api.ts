import axios from "axios";
import { Resolvers, LidoAPR } from "../types";

interface LidoApiResponse {
  data: {
    timeUnix: number;
    apr: number;
  };
  meta: {
    symbol: string;
    address: string;
    chainId: number;
  };
}

const LIDO_API_URL = "https://eth-api.lido.fi/v1/protocol/steth/apr/last";

export async function LidoService(): Promise<LidoAPR> {
  try {
    const response = await axios.get<LidoApiResponse>(LIDO_API_URL);
    const { data, meta } = response.data;

    return {
      timeUnix: data.timeUnix,
      apr: data.apr,
      symbol: meta.symbol,
      address: meta.address,
      chainId: meta.chainId,
    };
  } catch (error) {
    console.error("Error fetching Lido APR:", error);
    throw new Error("Failed to fetch Lido stETH APR");
  }
}
