import React, { useState, useMemo, useEffect, useContext } from "react";

import CreateSession from "../../Hooks/CreateSessionContext";
import usdcAbi from "./usdcAbi.json"
import { toast, ToastContainer } from 'react-toastify';
import { useBiconomy } from "../../Hooks/BiconomyContext";
import { ethers  } from 'ethers'
import { SessionKeyManagerModule, DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy/modules";


const Memos = ({ state }) => {



  const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [memos, setMemos] = useState([]);

  const { contract } = state;

  useEffect(() => {
    const memosMessage = async () => {
      if (contract) {
        const memos = await contract.getMemos();
        setMemos(memos);
      }
    };
    memosMessage();
  }, [contract]);


  const DonateUs = async () => {

    
  
    if (!smartAccountAddress || !smartAccount) {
      alert("Please connect wallet first");
      return;
    }
    try {
      toast.info('Transferring 1 USDC to recipient...', {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA";
      // get session key from local storage
      const sessionKeyPrivKey = window.localStorage.getItem("sessionPKey");
      console.log("sessionKeyPrivKey", sessionKeyPrivKey);
      if (!sessionKeyPrivKey) {
        alert("Session key not found please create session");
        return;
      }
      const sessionSigner = new ethers.Wallet(sessionKeyPrivKey);
      console.log("sessionSigner", sessionSigner);
  
      // generate sessionModule
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: smartAccountAddress,
      });
  
      // set active module to sessionModule
      smartAccount = smartAccount.setActiveValidationModule(sessionModule);
  
      const tokenContract = new ethers.Contract(
        // polygon mumbai usdc address
        "0xdA5289fCAAF71d52a80A254da614a192b693e977",
        usdcAbi,
        provider
      );
      let decimals = 18;
      
      try {
        decimals = await tokenContract.decimals();
      } catch (error) {
        throw new Error("invalid token address supplied");
      }
  
      const { data } = await tokenContract.populateTransaction.transfer(
        "0x05f8d732692f087aDB447CaA20d27021FaEEe820", // receiver address
        ethers.utils.parseUnits("1".toString(), decimals)
      );
  alert("Done")
      // generate tx data to erc20 transfer
      const tx1 = {
        to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", //erc20 token address
        data: data,
        value: ethers.utils.parseUnits("1".toString(), decimals),
      };
      alert("Done1")

      console.log(tx1)
  
      // build user op
      let userOp = await smartAccount.buildUserOp([tx1], {
        overrides: {
          // signature: "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000456b395c4e107e0302553b90d1ef4a32e9000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db3d753a1da5a6074a9f74f39a0a779d3300000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000bfe121a6dcf92c49f6c2ebd4f306ba0ba0ab6f1c000000000000000000000000da5289fcaaf71d52a80a254da614a192b693e97700000000000000000000000042138576848e839827585a3539305774d36b96020000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041feefc797ef9e9d8a6a41266a85ddf5f85c8f2a3d2654b10b415d348b150dabe82d34002240162ed7f6b7ffbc40162b10e62c3e35175975e43659654697caebfe1c00000000000000000000000000000000000000000000000000000000000000"
          // callGasLimit: 2000000, // only if undeployed account
          // verificationGasLimit: 700000
        },
        skipBundlerGasEstimation: false,
        params: {
          sessionSigner: sessionSigner,
          sessionValidationModule: erc20ModuleAddr,
        },
      });
     console.log({userOp})
      alert("Donation Sucess!")
      
      // send user op
      const userOpResponse = await smartAccount.sendUserOp(userOp, {
        sessionSigner: sessionSigner,
        sessionValidationModule: erc20ModuleAddr,
      });
  
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      const polygonScanlink = `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`
      toast.success(<a target="_blank" href={polygonScanlink}>Success Click to view transaction</a>, {
        position: "top-right",
        autoClose: 18000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } catch(err) {
      console.error(err);
    }
  }
  return (
    <>
    <p style={{ textAlign: "center", marginTop: "20px" }}>Messages</p>
    {memos.map((memo) => {
      return (
        <div
          className="container-fluid"
          style={{ width: "100%" }}
          key={Math.random()}
        >
          <table
            style={{
              marginBottom: "10px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    backgroundColor: "#96D4D4",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "100px",
                  }}
                >
                  {memo.name}
                </td>
                <td
                  style={{
                    backgroundColor: "#96D4D4",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "800px",
                  }}
                >
                  {new Date(memo.timestamp * 1000).toLocaleString()}
                </td>
                <td
                  style={{
                    backgroundColor: "#96D4D4",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "300px",
                  }}
                >
                  {memo.message}
                </td>
                <td
                  style={{
                    backgroundColor: "#96D4D4",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "400px",
                  }}
                >
                  {memo.from}
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      );
    })}

<div  className = "w-full  ml-28 p-6">
        <div className = "flex flex-col p-4 justify-center max-w-screen-lg mx-auto ">
            <div className = " mn pb-8">
                <p className = "text-4xl font-bold text-center  flex items-center justify-center">DONATE US
                  {/* <Image src = {Coffee} height="50" width="50" className = "mx-3 transform flip-horizontal" /> */}
                </p>
                <p className = "py-6 text-center text-xl font-semibold">FEEL  THE REAL SESSION KEY MODULE   .</p>
            </div>

            
        </div>
        <button  type="button"
                  className = " btn btn-primary px-6 py-6 bg-gradient-to-b from-cyan-500 to-blue-500 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-150 text-white  font-semibold"><CreateSession/> </button>
    
        <button  type="button"
                  className = " btn btn-primary px-6 py-6 bg-gradient-to-b from-cyan-500 to-blue-500 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-150 text-white  font-semibold" onClick={DonateUs} >Transfer US 1 USDC</button>
    
        
     
    </div>
      
   
  </>
   
               
  );
};

export default Memos;
