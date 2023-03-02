import React from 'react';
import Web3 from 'web3';
import { contract, web3 } from './web3.js';


function EnterButton(props) {
  async function handleEnter() {

    // Envía una transacción para llamar a la función "enter" del contrato
    const accounts = await web3.eth.getAccounts();
    await contract.methods.enter().send({from: accounts[0]});
  }

  return (
    <button onClick={handleEnter}>Enter</button>
  );
}

export default EnterButton;
