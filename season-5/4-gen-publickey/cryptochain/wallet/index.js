const {STARTING_BALANCE} = require('./../config')
const {ec} = require('./../util');

const keyPair = ec.genKeyPair();

class Wallet{
  constructor(){
    this.balance = STARTING_BALANCE;
    this.publicKey = keyPair.getPublic().encode('hex');
  }
}

module.exports = Wallet;