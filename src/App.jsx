import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
    });

    const [account, setAccount] = useState(null);

    const loadProvider = async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
            provider.request({ method: "eth_requestAccounts" });
            setWeb3Api({
                web3: new Web3(provider),
                provider,
            });
        } else {
            console.error("Please install Metamask");
        }
    };

    const getAccount = async () => {
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccount(accounts[0]);
    };

    useEffect(() => {
        loadProvider();
    }, []);

    useEffect(() => {
        web3Api.web3 && getAccount(); // only when web3 exists call this function
    }, [web3Api.web3]); // reload when web3 changes

    return (
        <>
            <div className="faucet-wrapper">
                <div className="faucet">
                    <div className="account">
                        <span>
                            <strong>Account:</strong>
                        </span>
                        <div>{account ? account : "Not Connected"}</div>
                    </div>
                    <div className="balance">
                        Current Balance <strong>10</strong> ETH
                    </div>

                    <div className="button">Create</div>
                    <div className="button">Withdraw</div>
                </div>
            </div>
        </>
    );
}

export default App;

// code without detect-provider

// // check available provider
// if (window.ethereum) {
//     // for newer version of metamask
//     provider = window.ethereum;

//     // try to connect to metamask automatically
//     try {
//         await provider.request({ method: "eth_requestAccounts" });
//     } catch {
//         console.error("User denied accounts access!");
//     }
// } else if (window.web3) {
//     provider = window.web3.currentProvider; // this condition is for legacy version of metamask
// } else if (!process.env.production) {
//     provider = new Web3.providers.HttpProvider("http://localhost:7545"); // Ganache
// }
