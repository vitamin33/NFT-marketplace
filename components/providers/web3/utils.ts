import {MetaMaskInpageProvider} from "@metamask/providers";
import {Contract, ethers, providers} from "ethers";
import {Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

export type Web3Params = {
    ethereum?: MetaMaskInpageProvider | null;
    provider?: providers.Web3Provider | null;
    contract?: Contract | null;
}

export type Web3State = {
    isLoading: boolean; //true while loading web3State
} & Web3Params

export const createDefaultState = () => {
    return {
         ethereum: null,
        provider: null,
        contract: null,
        isLoading: true
    }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
    name: string,
    provider: Web3Provider
): Promise<Contract> => {
    if(!NETWORK_ID) {
        return Promise.reject("Network id is not defined.");
    }
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    if(Artifact.networks[NETWORK_ID].address) {
        return new ethers.Contract(
            Artifact.networks[NETWORK_ID].address,
            Artifact.abi,
            provider
        );
    } else {
        return Promise.reject(`Contract: ${name} can not be loaded.`)
    }
}