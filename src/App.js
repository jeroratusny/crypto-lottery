import './App.css';
import React, { useEffect, useState } from "react";
import { contract } from './web3.js';
import { web3 } from './web3.js';
import  Balance  from './Balance';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';


function App() {

  const [walletAddress, setwalletAddress] = useState("");
  const [message, setMessage] = useState("");
  let accounts = '';
  

  async function requestAccount() {
    console.log('Requesting account...');

    if(window.ethereum){
      console.log('detected');

      try {
         accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
        
        accounts[0] = web3.utils.toChecksumAddress(accounts[0]);
        setwalletAddress(accounts[0]);

      } catch (error) {
        console.log('Error connecting...')
      }

    } else {
      console.log('MetaMask not detected');
    }
  }

  async function handleEnter(event) {
    event.preventDefault();
  
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            80001: 'https://rpc-mumbai.matic.today',
          },
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: 'mumbai',
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();
  
    const selectedAddress = provider.selectedAddress;
    if (!selectedAddress) {
      throw new Error('No address selected');
    }
  
    const minimumBet = await contract.methods.minimumBet().call();
    const value = '500000000000000000';
    const data = contract.methods.enter().encodeABI();
  
    const gas = await contract.methods.enter().estimateGas({ value });
    const gasString = gas.toString();

    console.log(gasString);

    const tx = {
      from: selectedAddress,
      to: contract.options.address,
      value: Web3.utils.toHex(value),
      data: data,
      gas:gasString
    };
    console.log(tx);

    const signedTx = await provider.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });
  
    console.log('Transaction hash:', signedTx);
    setMessage("Ticket purchased successfully!"); // set the message after the transaction is successful
  }
  
  async function selectWinner() {
    if (walletAddress == '') {
      await requestAccount(); // Llama a `requestAccount()` si la variable de estado es `false`.
    }
    try {

      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              80001: 'https://rpc-mumbai.matic.today',
            },
          },
        },
      };
      
     const web3Modal = new Web3Modal({
        network: 'mumbai',
        cacheProvider: true,
        providerOptions,
      });
    

      const provider = await web3Modal.connect();
      const web3Provider = new Web3Provider(provider);
      
      const signer = web3Provider.getSigner();    

      const data2 = contract.methods.selectWinner().encodeABI();
    
      const tx2 = {
        from: walletAddress,
        to: contract.options.address,
        data: data2,
      };
      console.log(tx2);
  
      const signedTx2 = await provider.request({
        method: 'eth_sendTransaction',
        params: [tx2],
      });

      console.log(`Winner selected!`);

 
      
    } catch (error) {
      console.error(error);
    }
  }

  
  
  

  // Create a provider to interact with a smart contract
  // async function connectWallet(){

  //   if(typeof window.ethereum !== 'undefined'){
  //     await requestAccount();

  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     }
  // }
  

  return (
    <div className="App">
      <header className="App-header">
        <h1> Crypto Lottery </h1>
        <Balance /> 

        <h3> Wallet Address: {walletAddress}</h3>

        <button
        onClick={handleEnter}
        > Enter </button>
        <br></br>
        
        <button
        onClick={selectWinner}
        > Select Winner </button>
        
        {message && <div>{message}</div>} {/* show the message if it's not empty */}
      </header>
    </div>
  );
}

export default App;