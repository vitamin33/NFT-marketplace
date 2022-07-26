import {Web3Dependencies} from "@_types/hooks";
import { hookFactory as createAccountHook, UseAccountHook} from "@hooks/web3/useAccount";
import { hookFactory as createNetworkHook, UseNetworkHook} from "@hooks/web3/useNetwork";
import { hookFactory as createListedNftsHook, UseListedNftsHook} from "@hooks/web3/useListedNfts";
import { hookFactory as createOwnedNftsHook, UseOwnedNftsHook} from "@hooks/web3/useOwnedNfts";

export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook;
    useListedNfts: UseListedNftsHook;
    useOwnedNfts: UseOwnedNftsHook;
}

export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
        useListedNfts: createListedNftsHook(deps),
        useOwnedNfts: createOwnedNftsHook(deps)
    }
}