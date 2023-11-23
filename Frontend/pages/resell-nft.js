import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Navbar from "../Component/Course/Nav";
import { useBiconomy } from "../Component/Hooks/BiconomyContext";
import {
  marketplaceAddress
} from '../config'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const marketplaceAddress ="0xF2B8a621d0F517e9F756fDC2E69d2d70eB968174"
import NFTMarketplace from '../../SmartContract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function ResellNFT() {
  const {smartAccount, smartAccountAddress,connect,provider} = useBiconomy();
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    if (!price) return
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    let listingPrice = await contract.getListingPrice()



    listingPrice = listingPrice.toString()
    // let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })



try{
  toast.info('Re sell intiated to the recipient', {
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });
  const approvalTrx = await contract.populateTransaction.resellToken(id, priceFormatted);

  console.log(approvalTrx);


  const tx1 = {
    to: marketplaceAddress,
    data: approvalTrx.data,
    value: listingPrice

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
   
    router.push('/marketplace')
  }

  return (
    <div>
      <Navbar/>
  
    <div className="flex  justify-center">
      <div className="w-1/2 mn flex flex-col py-22">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 text-black border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          List NFT
        </button>
      </div>
    </div>
      </div>
  )
}