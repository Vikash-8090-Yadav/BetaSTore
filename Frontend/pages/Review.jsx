import {
    marketplaceAddress
  } from '../config'

  import NFTMarketplace from '../../SmartContract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
  import Navbar from "../Component/Course/Nav";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from  "../Component/v1.0.0/Review/Buys"
import Memos from "../Component/v1.0.0/Review/Memos";


import { useBiconomy } from '../Component/Hooks/BiconomyContext';
import CreateSession from '../Component/Hooks/CreateSessionContext';




function Review() {
  
  const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = marketplaceAddress;
      const contractABI =  NFTMarketplace.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  // console.log(state);
  return (
    <div>
      <Navbar/>
 
    <div className ="cnt" style={{ backgroundColor: "", height: "100%" }}>
      {/* <img src={chai} className="img-fluid" alt=".." height={556} width={742} /> */}
      <div className="container">
        <Buy state={state} />
        <Memos state={state} />
      </div>
    </div>
    </div>
  );

}

export default Review;