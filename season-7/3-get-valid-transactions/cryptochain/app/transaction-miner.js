class TransactionMiner{

  constructor({blockchian, transactionPool, wallet, pubsub}){
    this.blockchian = blockchian;
    this. transactionPool = transactionPool;
    this. wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions(){
    // get the transactino pool's valid transactions

    // generate the miner's reward

    // add a block consisting of these transactions to blockchain

    // broadcast the updated blockchain

    // clear the pool
  }
}

module.exports = TransactionMiner;