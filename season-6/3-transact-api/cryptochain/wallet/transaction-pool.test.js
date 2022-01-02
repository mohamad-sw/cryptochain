const TrasactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', ()=>{
  let transactionPool, trasaction;

  beforeEach(()=>{
    transactionPool = new TrasactionPool();
    trasaction = new Transaction({
      senderWallet: new Wallet(),
      recipient: 'test-recipient',
      amount: 50
    })
  });

  describe('setTransaction()', ()=>{
    it('adds a trasaction', ()=>{
      transactionPool.setTransaction(trasaction);
      expect(transactionPool.transactionMap[trasaction.id]).toBe(trasaction);
    })
  })
})