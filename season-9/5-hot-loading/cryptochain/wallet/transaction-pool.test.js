const TrasactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");
const Blockchain = require('./../blockchain');

describe("TransactionPool", () => {
  let transactionPool, trasaction, senderWallet;

  beforeEach(() => {
    senderWallet = new Wallet();
    transactionPool = new TrasactionPool();
    transaction = new Transaction({
      senderWallet: senderWallet,
      recipient: "test-recipient",
      amount: 50,
    });
  });

  describe("setTransaction()", () => {
    it("adds a transaction", () => {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe("existingTransaction()", () => {
    it("returns an existing transaction given an input address", () => {
      transactionPool.setTransaction(transaction);
      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey,
        })
      ).toBe(transaction);
    });
  });

  describe("validTransactions()", () => {
    let validTrnsactions, errorMock;

    beforeEach(()=>{
      validTrnsactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;
      for(let i=0; i<10; i++){
        transaction = new Transaction({
          senderWallet, recipient: 'any-recipient', amount: 30
        });

        if(i%3 === 0){
          transaction.input.amount = 99999;
        }else if(i%3 === 1){
          transaction.input.signature = new Wallet().sign('foo');
        }else{
          validTrnsactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });

    it('returns valid transactions', ()=>{
      expect(transactionPool.validTransactions()).toEqual(validTrnsactions);
    });

    it('logs errors for the invalid transactions', ()=>{
      transactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });


  });

  describe('clear()', ()=>{
    it('clears the transactions', ()=>{
      transactionPool.clear();
      expect(transactionPool.transactionMap).toEqual({});
    })
  })

  describe('clearBlockchainTransactions()', ()=>{
    it('clears the pool of any existing blockchian transactions', ()=>{
      const blockchain = new Blockchain();
      const expectedTransactionMap = {};

      for(let i=0; i<6; i++){
        const transaction = new Wallet().createTransaction({
          recipient: 'foo',
          amount: 20
        });

        transactionPool.setTransaction(transaction);

        if(i%2==0){
          blockchain.addBlock({data: [transaction]});
        }else{
          expectedTransactionMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockchainTransactions({chain: blockchain.chain});
      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
    })
  })

});
