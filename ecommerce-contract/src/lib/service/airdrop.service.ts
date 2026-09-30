import { http } from "../baseRequest";

export interface IMyAirdrop {
    campaignId: number;
    name: string;
    amountWei: string;
    proof: string[];
}

const airdropService = {
    getMyAirdrops: (): Promise<IMyAirdrop[]> =>
        http.axios.request({
            method: "GET",
            url: `/airdrop/me`,
        }),

    markClaimed: (campaignId: number, txHash: string): Promise<void> =>
        http.axios.request({
            method: "PATCH",
            url: `/airdrop/claims/${campaignId}`,
            data: { txHash },
        }),
};

export default airdropService;
