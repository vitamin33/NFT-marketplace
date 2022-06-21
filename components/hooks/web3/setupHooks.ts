import {Web3Dependencies} from "@_types/hooks";
import { hookFactory as createAccountHook, UseAccountHook} from "@hooks/web3/useAccount";
import { hookFactory as createNetworkHook, UseNetworkHook} from "@hooks/web3/useNetwork";

export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook;
}

export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps)
    }
}