import {createContext, FunctionComponent, ReactElement, useContext, useState} from "react";

const Web3Context = createContext<any>(null);

type Web3Props = {
    children: ReactElement
}

const Web3Provider: FunctionComponent<Web3Props> = ({children, ...props}) => {

    const [web3Api, setWeb3Api] = useState({ test: "Hello Provider!"});

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