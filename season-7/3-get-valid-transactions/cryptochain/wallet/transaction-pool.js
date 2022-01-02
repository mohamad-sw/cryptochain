const Transaction = require('./transaction');

class TransactionPool{
  constructor(){
    this.transactionMap = {};
  }

  setTransaction(transaction){
    this.transactionMap[transaction.id] = transaction;
  }

  existingTransaction({inputAddress}){
    const transactions = Object.values(this.transactionMap);
    return transactions.find(transaction => transaction.input.address === inputAddress);
  }

  setMap(transactionMap){
    this.transactionMap =  transactionMap;
  }

  validTransactions(){
    return Object.values(this.transactionMap).filter(
      transaction => Transaction.validTransaction(transaction)
    );
  }
}

module.exports = TransactionPool;