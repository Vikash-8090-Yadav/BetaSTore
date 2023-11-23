import { useBiconomy } from '../Hooks/BiconomyContext';
import { ethers  } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import Link from "next/link";

export default function Navbar() {

  const {smartAccount, smartAccountAddress,connect} = useBiconomy();


  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // This effect will run once when the component mounts
    setAddress(smartAccountAddress);
  }, [smartAccountAddress]); 



  


  const logOut = () => {
    setAddress('');
  }


  const [open, setOpen] = useState(false);
  return (
    <div>
      <nav className="flex  px-4 py-4 h-20 items-center ">
       

       

          <div className="flex relative w-8 ml-5 h-6 flex-col justify-between items-center md:hidden">
            
          </div>
        
      </nav>

      <div className="hidden justify-between items-center sticky bg-green-500 md:flex p-12 text-9010FF  text-2xl nav-item font-bold font-serif justify-center items-center text-black h-8">

        <Link legacyBehavior href={"/marketplace"}>HOME</Link>
        <Link legacyBehavior href={"/sellnft"}>SELL ITEM</Link>
        <Link legacyBehavior href={"/mynft"}>MY ITEM</Link>
        <Link legacyBehavior href={"/dashboard"}>DASHBOARD</Link>
        <Link legacyBehavior href={"/Review"}>ITEM REVIEW</Link>
      </div>
    </div>
  );
}