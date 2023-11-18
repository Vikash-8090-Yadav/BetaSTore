import React, { useState, useMemo, useEffect, useContext } from "react";
import { IBundler, Bundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from "@biconomy/core-types";
import Navbar from "../v1.0.0/Navbar/Navbar";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers  } from 'ethers'

interface BiconomyInterface {
    smartAccount?: BiconomySmartAccountV2;
    smartAccountAddress?: string;
    provider: ethers.providers.Provider;
    connect: () => Promise<void>;
};
interface ChildComponentProps {
    connectFunction: () => Promise<void>; // Adjust the type as per your actual function signature
  }
const BiconomyContext = React.createContext<BiconomyInterface>({
    smartAccount: undefined,
    smartAccountAddress: undefined,
    provider: undefined,
    connect:undefined

});

export const useBiconomy = () => {
    return useContext(BiconomyContext);
};

export const BiconomyProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>();
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>();
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
  
    const bundler: IBundler = useMemo(() => new Bundler({
        bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44" as string,
        chainId: ChainId.POLYGON_MUMBAI,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      }), []);

    const paymaster: IPaymaster = useMemo(() => new BiconomyPaymaster({
        paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/3jXNlaLzq.67a4909a-3d7a-4ea4-8cfc-f990d08808e9" as string,
      }), []);

 
      const connect = async () => {
        // @ts-ignore
        const { ethereum } = window;
        try {
          setLoading(true)
          const provider = new ethers.providers.Web3Provider(ethereum)
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const ownerShipModule = await ECDSAOwnershipValidationModule.create({
            signer: signer
          })
          setProvider(provider)
    
          let biconomySmartAccount = await BiconomySmartAccountV2.create({
            chainId: ChainId.POLYGON_MUMBAI,
            bundler: bundler,
            paymaster: paymaster,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            defaultValidationModule: ownerShipModule,
            activeValidationModule: ownerShipModule,
          })
          const address = await biconomySmartAccount.getAccountAddress()
          setSmartAccount(biconomySmartAccount)
          console.log({ address })
          setSmartAccountAddress(address)
          console.log({ biconomySmartAccount })
          setLoading(false)
        } catch (error) {
          console.error(error);
        }
      };


    return (
       <BiconomyContext.Provider value={{smartAccount: smartAccount, smartAccountAddress: smartAccountAddress, provider:provider,connect}}>{children}</BiconomyContext.Provider>
    );
};

