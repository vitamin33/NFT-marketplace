import useSwr from "swr";
import {CryptoHookFactory} from "@_types/hooks";
import {Nft} from "@_types/nft";
import {ethers} from "ethersv5";
import {useCallback} from "react";

type UseOwnedNftsResponse = {
    listNft: (tokenId: number, price: number) => Promise<void>
}

type OwnedNftsHookFactory = CryptoHookFactory<any, UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: OwnedNftsHookFactory = ({ contract}) => () => {

    const { data, ...swr} = useSwr(
        contract ? "web3/useOwnedNfts" : null,
        async () => {
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getOwnedNfts();

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
    const listNft = useCallback(async (tokenId: number, price: number) => {
        try {
            const listResult = await _contract?.placeNftOnSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                {
                value: ethers.utils.parseEther(0.005.toString())
            })

            await listResult?.wait();

            alert("Your NFT has been listed.")
        } catch (e: any) {
            console.error(e.message)
        }
    }, [_contract])

    return {
        ...swr,
        listNft,
        data: data || [],
    };
}

