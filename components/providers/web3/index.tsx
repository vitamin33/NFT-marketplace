import {createContext, FunctionComponent, ReactElement, useContext, useEffect, useState} from "react";
import {createDefaultState, loadContract, Web3State} from "@providers/web3/utils";
import {ethers} from "ethers";

const Web3Context = createContext<Web3State>(createDefaultState());

type Web3Props = {
    children: ReactElement
}

const Web3Provider: FunctionComponent<Web3Props> = ({children, ...props}) => {

    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

    useEffect(() => {
        async function initWeb3() {
            const provider = new ethers.providers.Web3Provider(window.ethereum as any);
            const contract = await loadContract("NftMarket", provider);

            setWeb3Api({
                ethereum: window.ethereum,
                provider: provider,
                contract: contract,
                isLoading: false
            });
        }
        initWeb3();
    }, []);

    return (
        <Web3Context.Provider value={web3Api}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}

export default Web3Provider;