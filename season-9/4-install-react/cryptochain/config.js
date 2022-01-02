const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;

const REWARD_INPUT = {address: '*authorized-reward*'};
const MINING_REWARD = 50;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '------',
  hash: 'hash-one',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
}

module.exports = {GENESIS_DATA,MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD};