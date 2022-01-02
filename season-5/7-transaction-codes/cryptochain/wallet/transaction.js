const {v1} = require('uuid');

class Transaction{
  constructor({senderWallet, recipient, amount}){
    this.id = v1();
    this.outputMap = this.createOutputMap({senderWallet, recipient,amount});
  }

  createOutputMap({senderWallet, recipient, amount}){
    const outputMap = {};
    
    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance -  amount;

    return outputMap;
  }
}

module.exports = Transaction;