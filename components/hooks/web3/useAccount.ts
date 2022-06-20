import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";

type AccountHookFactory = CryptoHookFactory<string>

export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: AccountHookFactory = ({provider}) => (params) => {

    const swrRes = useSwr(
        provider ? "web3/useAccount" : null,
        () => {
            return "Test user"
        }
    )
    return swrRes;
}

