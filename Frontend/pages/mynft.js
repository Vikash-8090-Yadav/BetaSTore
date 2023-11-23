import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import Navbar from "../Component/Course/Nav";
import { useBiconomy } from '../Component/Hooks/BiconomyContext';
import { marketplaceAddress } from '../config';
// const marketplaceAddress ="0xF2B8a621d0F517e9F756fDC2E69d2d70eB968174"


import NFTMarketplace from '../../SmartContract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
  const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
    connect();
  }, []);

  async function loadNFTs() {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [""]);
    const signer = provider.getSigner();

    console.log(provider)

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const data = await marketplaceContract.fetchMyNFTs(smartAccountAddress);

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState('loaded');
  }

  function listNFT(nft) {
    
    console.log('nft:', nft);
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === 'loaded' && !nfts.length)
 
    return (<h1 className="mmn py-10 px-20  text-white text-3xl">No Courses owned</h1>);

  return (
    <div>  <Navbar/>
    <div className="flex justify-center">
     

  
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden bg-white">
              <img src={nft.image} className="rounded" />
              <div className="p-4">
                <p className="text-2xl font-bold">Price - {nft.price} MATIC</p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
