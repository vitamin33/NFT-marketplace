import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";

type UseListedNftsResponse = {

}

type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: ListedNftsHookFactory = ({ contract}) => () => {

    const { data, ...swr} = useSwr(
        contract ? "web3/useListedNfts" : null,
        async () => {
            const nfts = [] as any
            return nfts;
        }
    )

    return {
        ...swr,
        data: data || [],
    };
}

