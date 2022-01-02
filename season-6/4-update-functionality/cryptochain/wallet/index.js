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
}

module.exports = Wallet;