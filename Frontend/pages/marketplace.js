import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Navbar from "../Component/Course/Nav";
import { TailSpin } from "react-loader-spinner";
import Navbar from "../Component/Course/Nav";
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { useBiconomy } from '../Component/Hooks/BiconomyContext';

import { IHybridPaymaster, PaymasterFeeQuote, PaymasterMode, SponsorUserOperationDto } from "@biconomy/paymaster";
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../../SmartContract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
export default function Home() {
  const router = useRouter();
  const {smartAccount, smartAccountAddress,connect} = useBiconomy();

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    // const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether') 
    
    alert(price)
    // const transaction = await contract.createMarketSale(nft.tokenId, {
    //   value: price
    // })

    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );


try{
  toast.info('Payement initiated to the recipient...', {
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });
  
  const approvalTrx = await contract.populateTransaction.createMarketSale(nft.tokenId);

  console.log(approvalTrx);


  const tx1 = {
    to: marketplaceAddress,
    data: approvalTrx.data,
    value: price,

  }
console.log(tx1);

  // const txResponse = await smartAccount.sendTransaction({ transaction: tx1 })
  const userOp = await smartAccount.buildUserOp([tx1]);
  console.log({ userOp })
  // const biconomyPaymaster =
  //     smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  //   let paymasterServiceData: SponsorUserOperationDto = {
  //     mode: PaymasterMode.SPONSORED,
  //     smartAccountInfo: {
  //       name: 'BICONOMY',
  //       version: '2.0.0'
  //     },
  //   };
  //   const paymasterAndDataResponse =
  //     await biconomyPaymaster.getPaymasterAndData(
  //       userOp,
  //       paymasterServiceData
  //     );
      
  //   userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

    const userOpResponse = await smartAccount.sendUserOp(userOp);
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
}catch(error){
  console.log(error)
}



    // await transaction.wait()
    loadNFTs()
  
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="mmn px-20 py-10 text-white text-3xl">No Courses in marketplace</h1>)
  return (
    <div>
      <Navbar/>
    
    <div className="flex  justify-center">
      <div className="px-10" style={{ maxWidth: '1600px' }}>
        <div className="grid flex  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 unmrk">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border rounded-t-md  umrkt shadow rounded-xl overflow-hidden">
                <img   height="250px"  className = " w-full rounded-t-md duration-200 hover:scale-110 hover:overflow-hidden" src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '100%' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4  umrk bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} MATIC</p>
                  <button className=" hover:rotate-2 delay-100 transition ease-in-out   text-center border hover:bg-gray-100 hover:shadow-md border-gray-500 rounded-md mt-4 w-full bg-green-500 text-cyan font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  )
}