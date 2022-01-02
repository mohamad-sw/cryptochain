const Block = require("./block");
const Blockchain = require("./index");
const {cryptoHash} = require('./../util');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

describe("Blockchain", () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;

    errorMock = jest.fn();
    global.console.error = errorMock;

  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain does start with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });

      describe("and a lastHash refrenece has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "changed-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });

      describe('and the chain contains a block with a jumped difficulty', ()=>{
        it('returns false', ()=>{
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock = new Block({
            timestamp, lastHash, hash, nonce, difficulty, data
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        })
      })
    });
  });

  describe("replaceChain()", () => {

    let  logMock;

    beforeEach(()=>{
      
      logMock = jest.fn();

      global.console.log = logMock;
    });


    describe("when the new chain is not longer", () => {

      beforeEach(()=>{
        newChain[0] = {new: 'chain'};
        blockchain.replaceChain(newChain.chain);
      })
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {

      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
      });

      describe("and the chain is invalid", () => {

        beforeEach(()=>{
          newChain.chain[2].hash = 'fake-hash';
          blockchain.replaceChain(newChain.chain);
        })
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        beforeEach(()=>{
          blockchain.replaceChain(newChain.chain);
        })

        it('does replace the chain', ()=>{
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs an error", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });

    describe('and the `validateTransactions` flag is true', ()=>{
      it('calss validTransactionData', ()=>{
        const validTransactionDataMock = jest.fn();
        blockchain.validTransactionData = validTransactionDataMock;
        newChain.addBlock({data: 'foo'});
        blockchain.replaceChain(newChain.chain, true);
        expect(validTransactionDataMock).toHaveBeenCalled();
      })
    })
  });

  describe('validTransactionData()', ()=>{
    let transaction, rewardTransaction, wallet;

    beforeEach(()=>{
      wallet = new Wallet();
      transaction = wallet.createTransaction({recipient: 'foo-recipient', amount: 65});
      rewardTransaction = Transaction.rewardTransaction({minerWallet: wallet});
    });

    describe('and the transaction data is valid', ()=>{
      it('returns true', ()=>{
        newChain.addBlock({data: [transaction, rewardTransaction]});
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(true);
      })
    });

    describe('and the tranaction data has multiple rewards', ()=>{
      it('returns false and logs an error', ()=>{
        newChain.addBlock({data: [transaction, rewardTransaction, rewardTransaction]});
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('and the transaction data has at least one malformed `outputMap`', ()=>{
      describe('and the transaction is not a reward transaction', ()=>{
        it('returns false and logs an error', ()=>{
          transaction.outputMap[wallet.publicKey] = 99999;
          newChain.addBlock({data: [transaction, rewardTransaction]});
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the transaction is  a reward transaction', ()=>{
        it('returns false and logs an error', ()=>{
          rewardTransaction.outputMap[wallet.publicKey] = 99999;
          newChain.addBlock({data: [transaction, rewardTransaction]});
          console.log('------>', rewardTransaction);
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe('and the transaction data has at least one malformed `input`', ()=>{
      it('returns false and logs an error', ()=>{
        wallet.balance = 9000;

        const evilOutputMap ={
          fooRecipient: 100,
          [wallet.publicKey] : 8900
        }

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap)
          },
          outputMap: evilOutputMap
        }

        newChain.addBlock({data: [evilTransaction, rewardTransaction]});
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
        
      });
    });

    describe('and a block contains multiple identical transactions', ()=>{
      it('returns false and logs an error', ()=>{
        newChain.addBlock({data: [transaction,transaction, rewardTransaction]});
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  })
});
