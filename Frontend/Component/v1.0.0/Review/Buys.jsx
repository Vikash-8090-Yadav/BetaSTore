import { ethers } from "ethers";

import usdcAbi from "./usdcAbi.json"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBiconomy } from "../../Hooks/BiconomyContext";
import CreateSession from "../../Hooks/CreateSessionContext";
import { marketplaceAddress } from "../../../config";
// const marketplaceAddress="0xb035D1D308642DED3889fe99c362e14cb828244c"

const Buy = ({ state }) => {
  const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();

  const buyChai = async (event) => {
    
    event.preventDefault();
    
    const { contract } = state;
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;

    console.log(name, message, contract);
    alert(name);
    alert("moving to meesage");
    alert(message);
    const amount = { value: ethers.utils.parseEther("0.001") };
    // const transaction = await contract
    // console
    try{
    
      const approvalTrx = await contract.populateTransaction.buyChai(name, message,amount);
  
      console.log(approvalTrx);
  
  
      const tx1 = {
        to: marketplaceAddress,
        data: approvalTrx.data,
        value: ethers.utils.parseEther('0.001'),
  
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
    // await transaction.wait();
    // alert(name);
    // alert("moving to meesage");
    // alert(message);
    // console.log("Transaction is done");
    
  };
  

  return (
    <>
      <div name = "contact" className = "w-full  ml-28 p-6">
        <div className = "flex flex-col p-4 justify-center max-w-screen-lg mx-auto ">
            <div className = " mn pb-8">
                <p className = "text-4xl font-bold text-center  flex items-center justify-center">Review  an ITEM
                  {/* <Image src = {Coffee} height="50" width="50" className = "mx-3 transform flip-horizontal" /> */}
                </p>
                <p className = "py-6 text-center text-xl font-semibold">Submit the Review by filling  the form below .</p>
            </div>

            <div className = "flex justify-center items-center">
                <form  onSubmit={buyChai} className = "flex flex-col w-full md:w-1/2">
                    <input type = "text" id = "name" placeholder = "Enter Course name" className = "p-2 bg-transparent border-2 border-white rounded-md focus:outline-none text-white" />
                    <textarea placeholder = "Enter your Review Message" id = "message" rows = "8" className = "p-2 bg-transparent border-2 border-white rounded-md focus:outline-none text-white" />
                    <button  type="submit"
                  disabled={!state.contract} className = " btn btn-primary px-6 py-6 bg-gradient-to-b from-cyan-500 to-blue-500 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-150 text-white  font-semibold" >Complete Review </button>
                </form>
            </div>
        </div>
        
        
      </div>
     
    </>
  );
};
export default Buy;
