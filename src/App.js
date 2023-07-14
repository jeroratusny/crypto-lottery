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
  const [messageType, setMessageType] = useState("");
  const [lastWinner, setLastWinner] = useState('');
  let accounts = '';

  const [balance, setBalance] = useState(0);

  async function updateBalance() {
    const contractAddress = '0x85e2d4b9c0a42f745ed2dd766fa9362e3902fa6b';
    const balance = await web3.eth.getBalance(contractAddress);
    setBalance(web3.utils.fromWei(balance, 'ether'));
  }
  

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
    setwalletAddress(provider.selectedAddress);
    
  
    const selectedAddress = provider.selectedAddress;
    if (!selectedAddress) {
      throw new Error('No address selected');
    }
  
    const value = '500000000000000000'; // minimum bet
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
    checkTransactionStatus(signedTx);
  }  

  useEffect(() => {
    async function fetchData() {
      const winner = await contract.methods.getLastWinner().call();
      setLastWinner(winner);
    }
    fetchData();
  }, []);

  const checkTransactionStatus = async (signedTx) => {
    try {
      const response = await fetch(
        `https://api-testnet.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${signedTx}&apikey=435I5UVKHDD1QKPD9TH91ZR8UBY1D8AZJZ`
      );
      const data = await response.json();

      if (data.result.status === "1") {
        setMessage("Ticket purchased successfully!"); 
        setMessageType("success");
      } else if (data.result.status === "0") {
        setMessage("Transaction failed!");
        setMessageType("error");
      } else {
        setMessage("Transaction pending...");
        setMessageType("pending");
        setTimeout(() => {
          checkTransactionStatus(signedTx);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
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

      checkTransactionStatus(signedTx2);

    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1> Crypto Lottery </h1>
       
        <div> 
          <Balance onUpdateBalance={updateBalance} />
        </div>

        <h3> 🎫 Ticket Price: 0.5 MATIC <img class="coin-logo" src="https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" loading="lazy" alt="MATIC logo"></img></h3>

        {/* <h3> Wallet Address: {walletAddress}</h3> */}

        <button class="button-32" role="button"
        onClick={handleEnter}
        > Buy a Ticket! 🎫 </button>

        {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
        )}

       <h3>Last Winner: {lastWinner}</h3>
        
        
        <button class="button-32" role="button" onClick={selectWinner}>
           Select Winner <br /> (can only be called by the owner) 
        </button>

        
</header>
    </div>
  );
}
export default App;