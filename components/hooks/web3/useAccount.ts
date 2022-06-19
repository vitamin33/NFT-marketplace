import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: CryptoHookFactory<string, string> = (d: any) => (params) => {
    console.log(d);
    console.log(params);
    return useSwr("web3/useAccount", () => {
        return "Test user";
    });
}

export const useAccount = hookFactory({ ethereum: undefined, provider: undefined});