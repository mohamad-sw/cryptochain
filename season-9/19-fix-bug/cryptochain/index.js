const express = require("express");
const Blockchain = require("./blockchain");
const Pubsub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const TransactionMiner = require("./app/transaction-miner");
const tcpPortUsed = require("tcp-port-used");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.static("./client/dist"));
app.use(express.json());

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new Pubsub({ blockchain, transactionPool });

const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

// setTimeout(() => {
//   pubsub.broadcastChain();
// }, 1000);



app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/api/wallet-info", (req, res) => {
  res.json({
    address: wallet.publicKey,
    balance: Wallet.calculateBalance({
      chain: blockchain.chain,
      address: wallet.publicKey,
    }),
  });
});

app.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransactions();
  res.redirect("/api/blocks");
});

app.get("/api/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.post("/api/transact", (req, res) => {
  let { amount, recipient } = req.body;
  amount = parseInt(amount);
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });
  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res.json({ type: "error", message: error.message });
  }
  transactionPool.setTransaction(transaction);
  pubsub.broadcastTransaction(transaction);
  // console.log("transactionPool", transactionPool);
  res.json({ transaction });
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
  const transaction = wallet.createTransaction({
    recipient,
    amount,
    chain: blockchain.chain,
  });

  transactionPool.setTransaction(transaction);
};

const walletAction = () =>
  generateWalletTransaction({
    wallet,
    recipient: walletFoo.publicKey,
    amount: 5,
  });

const walletFooAction = () =>
  generateWalletTransaction({
    wallet: walletFoo,
    recipient: walletBar.publicKey,
    amount: 10,
  });

const walletBarAction = () =>
  generateWalletTransaction({
    wallet: walletBar,
    recipient: wallet.publicKey,
    amount: 15,
  });

// for(let i=0;i<10;i++){
//   if(i%3 === 0){
//     walletAction();
//     walletFooAction();
//   }else if(i%3 === 1){
//     walletAction();
//     walletBarAction();
//   }else{
//     walletFooAction();
//     walletBarAction();
//   }

//   transactionMiner.mineTransactions();

// }
const rootPort = 3000;
let PORT = 3000;

const syncOnConnect = async () => {
  let response = await axios.get(`http://localhost:${rootPort}/api/blocks`);
  blockchain.replaceChain(response.data);

  response = await axios.get(
    `http://localhost:${rootPort}/api/transaction-pool-map`
  );
  transactionPool.setMap(response.data);
};

tcpPortUsed.check(3000, "127.0.0.1").then(function(inUse) {
  if (inUse) {
    PORT += Math.ceil(Math.random() * 1000);
  }
  app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
    if (PORT !== rootPort) syncOnConnect();
  });
});
