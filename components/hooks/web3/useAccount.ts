import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";
import {useEffect} from "react";

type UseAccountResponse = {
    connect: () => void
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: AccountHookFactory = ({
                                                    ethereum,
                                                    provider
}) => (params) => {

    const { data, mutate, ...swr} = useSwr(
        provider ? "web3/useAccount" : null,
        async () => {
            const accounts = await provider!.listAccounts();
            const account = accounts[0];
            if (!account) {
                throw "Can't retrieve and account! Please login into web3 wallet.";
            }
            return accounts[0];
        },
        {
            revalidateOnFocus: false
        }
    )

    useEffect(() => {
        ethereum?.on("accountsChanged", handleAccountsChanged);
        return () => {
            ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        }
    });
    const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
            console.error("Please connect to Web3 wallet.");
        } else if ( accounts[0] !== data) {
            mutate(accounts[0]);
        }
    }

    const connect = async () => {
        try {
            ethereum?.request({method: "eth_requestAccounts"});
        } catch (e) {
            console.error(e);
        }
    }

    return {
        ...swr,
        data,
        mutate,
        connect
    };
}

