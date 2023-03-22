import { useState, useEffect } from 'react';
import { web3 } from './web3.js';

function Balance() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getBalance() {
      const contractAddress = '0x85e2d4b9c0a42f745ed2dd766fa9362e3902fa6b';
      const balance = await web3.eth.getBalance(contractAddress);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }
    getBalance();
  }, []);

  return (
    <h2>Balance: {balance} MATIC</h2>
  );
}

export default Balance;
