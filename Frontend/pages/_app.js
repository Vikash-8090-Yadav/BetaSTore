
import Layout from "../Component/Layout";

import "../styles/globals.css";

import { useRouter } from 'next/router' 

import { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';

import {BiconomyProvider} from "../Component/Hooks/BiconomyContext"


function MyApp({ Component, pageProps = {} }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      // Load any necessary data or perform initial setup here
      setLoading(false);
    };
    loadDetails();
  }, []);

  const { pathname } = useRouter();
  
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, []);

  return (
    <>
    <div>
      <div>
        {loading ? (
          <div className = "w-screen h-screen flex flex-col justify-center items-center">
            <ColorRing height = {90}/>
            <div className = "font-semibold text-4xl tracking-widest px-5 text-center">WELCOME TO Edu.Dev DAPP</div>
          </div>

          ) : (
            <div>
              {
                ready ? (
                  <div>
                    <div className='big bg-indigo-800'></div>
                    
                    <BiconomyProvider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>      
                    </BiconomyProvider>
                   
                  </div>
                ) : null
              }
            </div>
          )
        }
      </div>
    </div>
    </>
  );
}

export default MyApp;
