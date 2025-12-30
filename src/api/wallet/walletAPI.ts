import type { CreateDeposit, Deposit, ListDeposit } from "@/types/wallet";
import { apiCall } from "../http";

export async function createDeposit(input: CreateDeposit) : Promise<Deposit> {
    return apiCall<Deposit>("/deposit", "POST", input)
}

export async function getDeposit():Promise<ListDeposit>{
    return apiCall<ListDeposit>("/deposit", "GET")
}

export async function getDepositById(id: string):Promise<Deposit>{
    return apiCall<Deposit>(`/deposit/${id}`, "GET")
}