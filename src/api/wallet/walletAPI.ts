import type { Asset, CreateDeposit, Deposit, ListDeposit,ListDepositParams } from "@/types/wallet";
import { apiCall } from "../http";

export async function createDeposit(input: CreateDeposit) : Promise<Deposit> {
    return apiCall<Deposit>("/deposit", "POST", input)
}

export async function getDeposit(params: ListDepositParams):Promise<ListDeposit>{
    const { limit, offset } = params;
    return apiCall<ListDeposit>(`/deposit?limit=${limit}&offset=${offset}`, "GET")
}

export async function getDepositById(id: string):Promise<Deposit>{
    return apiCall<Deposit>(`/deposit/${id}`, "GET")
}

export async function getAssets():Promise<Asset[]>{
    return apiCall<Asset[]>(`/asset`, "GET")
}