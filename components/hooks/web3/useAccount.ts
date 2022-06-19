import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: AccountHookFactory = (d: any) => (params) => {
    console.log(d);
    console.log(params);
    return useSwr("web3/useAccount", () => {
        return "Test user";
    });
}

