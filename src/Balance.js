import { useState, useEffect } from 'react';
import { web3 } from './web3.js';

function Balance(props) {
  const { onUpdateBalance } = props;
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getBalance() {
      const contractAddress = '0x75fAaEFC3F00D28F1AE70E50a0D8bBfD73dC7B10';
      const balance = await web3.eth.getBalance(contractAddress);
      setBalance(web3.utils.fromWei(balance, 'ether'));
      // el balance en ether se establece como el nuevo estado del componente usando el método setBalance.
      onUpdateBalance(balance); // llamamos a onUpdateBalance con el balance actualizado
    }
    // la función getBalance se ejecuta una unica vez para obtener el balance inicial del contrato.
    getBalance();
  }, [onUpdateBalance]);

  //El [onUpdateBalance] es una dependencia del hook useEffect. Significa que si la función onUpdateBalance cambia (por ejemplo, si se pasa una función diferente como propiedad), entonces se volverá a ejecutar el hook useEffect

  return (
    <h2> 🎰💰 Jackpot Prize: {balance} MATIC 💰🎰 </h2>
  );
}

export default Balance;


{/*Sí, en efecto, la función onUpdateBalance se suscribe al evento emitido por el contrato cuando se produce un cambio en el saldo. Esto significa que la función se ejecutará automáticamente cada vez que se produzca un cambio en el saldo, lo que permite mantener actualizado el saldo de la cuenta del usuario en tiempo real.

En términos técnicos, lo que ocurre es que la función onUpdateBalance se registra como un "escucha" o "suscriptor" del evento de cambio de saldo que se define en el contrato. Cuando se produce un cambio en el saldo, el contrato emite este evento, lo que desencadena la ejecución de la función onUpdateBalance en la aplicación web. De esta manera, el saldo de la cuenta del usuario se actualiza automáticamente sin necesidad de que el usuario tenga que hacerlo manualmente.\


La razón por la que la función updateBalance se ejecuta sin necesidad de un botón es porque 
se utiliza la función useEffect en el componente Balance. El hook useEffect se ejecuta 
automáticamente cuando se monta el componente por primera vez, y también se ejecuta cada 
vez que alguna de sus dependencias cambia.

En este caso, useEffect se ejecuta una vez cuando se monta el componente Balance, lo que
significa que se llama a updateBalance para obtener el saldo inicial del contrato. Después, 
se registra la función onUpdateBalance como un suscriptor del evento emitido por el contrato 
cada vez que hay un cambio en el saldo. Cuando se produce un cambio en el saldo, el contrato 
emite el evento correspondiente, lo que hace que se ejecute la función onUpdateBalance en la 
aplicación web, lo que a su vez llama a updateBalance para actualizar el saldo en el estado de 
Balance.

En resumen, la función updateBalance se ejecuta automáticamente cuando se monta el componente Balance por primera vez y cada vez que se produce un cambio en el saldo del contrato, gracias al uso de useEffect y onUpdateBalance.

*/

}