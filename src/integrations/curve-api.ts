import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CurvePool, CurveApiResponse } from "../types";

export class CurveService {
  private readonly api: AxiosInstance;

  constructor(baseUrl: string = "https://api.curve.fi/v1") {
    this.api = axios.create({
      baseURL: baseUrl,
    });
  }

  async getAllPools(blockchainId: string): Promise<CurvePool[]> {
    try {
      const response = await this.fetchPoolsData(blockchainId);
      this.validateApiResponse(response);
      return this.extractPoolsData(response.data.data);
    } catch (error) {
      this.handleError(error, blockchainId);
      throw error;
    }
  }

  private async fetchPoolsData(
    blockchainId: string
  ): Promise<AxiosResponse<CurveApiResponse>> {
    return this.api.get<CurveApiResponse>(`/getPools/${blockchainId}`);
  }

  private validateApiResponse(response: AxiosResponse<CurveApiResponse>): void {
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error("Unexpected API response structure");
    }
  }

  private extractPoolsData(data: any): CurvePool[] {
    const poolsData = data.poolData;
    if (!Array.isArray(poolsData)) {
      throw new Error("Unexpected pools data structure");
    }
    return poolsData;
  }

  private handleError(error: any, blockchainId: string): void {
    console.error(`Error fetching pools for ${blockchainId}:`, error);
  }
}
