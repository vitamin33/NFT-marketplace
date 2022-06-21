import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";

const NETWORKS: {[k: string]: string} = {
    1: "Ethereum Main Network",
    3: "Ropsten",
    4: "Rinkeby",
    56: "Binance Smart Chain",
    1337: "Ganache"
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({
                                                    provider,
                                                    isLoading
                                                }) => () => {

    const { data, isValidating, ...swr} = useSwr(
        provider ? "web3/useNetwork" : null,
        async () => {
            const chainId = (await provider!.getNetwork()).chainId;

            if (!chainId) {
                throw "Can not retrieve network. Please refresh browser."
            }
            return NETWORKS[chainId];
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )

    return {
        ...swr,
        data,
        targetNetwork,
        isSupported: data === targetNetwork,
        isValidating: isValidating,
        isLoading: isLoading as boolean,
    };
}

