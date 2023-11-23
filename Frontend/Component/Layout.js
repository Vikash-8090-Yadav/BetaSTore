

import Hero from "./v1.0.0/hero/Hero";
import About from "./v1.0.0/about/About";
import Problem from "./v1.0.0/problemsolved/Problem";
import Footer from "./v1.0.0/footer/footer";
import Navbar from "../Component/v1.0.0/Navbar/Navbar"
import HappyClient from "./v1.0.0/happyClient/HappyClient";
import Explore from "./v1.0.0/Explore/Explore";
import Card from "../Component/v1.0.0/Cards/Cards"
import { ToastContainer } from 'react-toastify';
import { useEffect, useRef } from 'react'

import { useBiconomy } from "./Hooks/BiconomyContext";
export default function Layout({ children }) {
  const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();
  
  useEffect(() => {
    // This code will run when the component mounts
    connect();

    // If you need to perform cleanup when the component unmounts, return a function from useEffect
    return () => {
      // Cleanup code (if needed)
    };
  }, []); 

  return (
    <>

        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

        {/* Below commented component only works if Navbar is imported in _app.js || To be done so once ever component listed below is complete */}
        {/* <Navbar handleLogout={handleLogout}/> */} 
        <div>
        <Navbar/>
        </div>
        <ToastContainer/>
        {children}


        <Footer/>
    
    </>
  )
}
