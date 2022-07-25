import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
    });

    useEffect(() => {
        const loadProvider = async () => {
            let provider = null;

            // check available provider
            if (window.ethereum) {
                // newer version of metamask
                provider = window.ethereum;

                // try to connect to metamask automatically
                // try {
                //     await provider.enable();
                // } catch {
                //     console.error("User denied accounts access!");
                // }
            } else if (window.web3) {
                provider = window.web3.currentProvider; // this condition is for legacy version of metamask
            } else if (!process.env.production) {
                provider = new Web3.providers.HttpProvider(
                    "http://localhost:7545"
                ); // Ganache
            }

            setWeb3Api({
                web3: new Web3(provider),
                provider,
            });
        };

        loadProvider();
    }, []);

    console.log(web3Api.web3);

    return (
        <>
            <div className="faucet-wrapper">
                <div className="faucet">
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
