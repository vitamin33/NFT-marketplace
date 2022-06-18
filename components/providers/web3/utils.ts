import {MetaMaskInpageProvider} from "@metamask/providers";
import {Contract, providers} from "ethers";
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

export const loadContract = async (name: string, provider: Web3Provider) => {

}