const {STARTING_BALANCE} = require('./../config')
const {ec, cryptoHash} = require('./../util');
const Transaction = require('./transaction');


class Wallet{
  constructor(){
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data){
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({recipient, amount}){
    if(amount > this.balance){
      throw new Error('amount exceeds balance');
    }
    return new Transaction({senderWallet: this, recipient, amount})
  }

  static calculateBalance({chain, address}){
    let outputTotal = 0;

    for(let i =1; i<chain.length; i++){
      const block = chain[i];

      for(let transaction of block.data){
        const addressOutput = transaction.outputMap[address];
        if(addressOutput){
          outputTotal = outputTotal + addressOutput;
        }
      }
    }

    return STARTING_BALANCE + outputTotal;
  }
}

module.exports = Wallet;