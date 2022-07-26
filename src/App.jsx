import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/loadContract";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const loadProvider = async () => {
        const provider = await detectEthereumProvider();
        const contract = await loadContract("MyWallet", provider);

        if (provider) {
            setWeb3Api({
                web3: new Web3(provider),
                provider,
                contract,
            });
        } else {
            console.error("Please install Metamask");
        }
    };

    const getAccount = async () => {
        const accounts = await web3Api.web3.eth.getAccounts();
        // set defaultAccount for from feature
        web3Api.web3.eth.defaultAccount = accounts[0];
        setAccount(accounts[0]);
    };

    const loadBalance = async () => {
        const { contract, web3 } = web3Api;
        let balance = await contract.balanceOf(account);
        balance = parseFloat(web3.utils.fromWei(balance, "ether"));
        setBalance(balance.toFixed(2));
    };

    const addFunds = async () => {
        const { contract, web3 } = web3Api;
        const amount = web3.utils.toWei("1", "ether");
        // need to set the from option, or it will throw an internal error
        await contract.mint(account, amount, { from: web3.eth.defaultAccount });
    };

    useEffect(() => {
        loadProvider();
    }, []);

    useEffect(() => {
        web3Api.web3 && getAccount(); // only when web3 exists call this function
    }, [web3Api.web3]); // reload when web3 changes

    useEffect(() => {
        account && loadBalance(); // load only when account is connected
    }, [account]);

    return (
        <>
            <div className="faucet-wrapper">
                <div className="faucet">
                    <div className="account-wrapper">
                        <span className="account-span">
                            <strong>Account:</strong>
                        </span>
                        <div>
                            {account ? (
                                <div>{account}</div>
                            ) : (
                                <div
                                    className="button"
                                    onClick={() =>
                                        web3Api.provider.request({
                                            method: "eth_requestAccounts",
                                        })
                                    }
                                >
                                    Connect to Wallet
                                </div>
                            )}
                        </div>
                    </div>
                    {account && (
                        <div>
                            <div className="balance">
                                Current Balance <strong>{balance}</strong> ETH
                            </div>
                            <div
                                onClick={addFunds}
                                className="button btn-primary"
                            >
                                Donate 1 ETH
                            </div>
                        </div>
                    )}
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
