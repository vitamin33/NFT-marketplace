import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";
import {Nft} from "@_types/nft";
import {ethers} from "ethersv5";
import {useCallback} from "react";

type UseListedNftsResponse = {
    buyNft: (tokenId: number, value: number) => Promise<void>
}

type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: ListedNftsHookFactory = ({ contract}) => () => {

    const { data, ...swr} = useSwr(
        contract ? "web3/useListedNfts" : null,
        async () => {
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getAllNftsOnSale();

            for(let i=0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                })
            }
            return nfts;
        }
    )

    const _contract = contract;
    const buyNft = useCallback(async (tokenId: number, value: number) => {
        try {
            const buyResult = await _contract!.buyNft(tokenId, {
                value: ethers.utils.parseEther(value.toString())
            })

            await buyResult?.wait();

            alert("You have bought NFT. See profile page.")
        } catch (e: any) {
            console.error(e.message)
        }
    }, [_contract])

    return {
        ...swr,
        buyNft,
        data: data || [],
    };
}

