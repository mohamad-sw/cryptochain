const Block = require("./block");
const {GENESIS_DATA} = require('./config');

describe("Block", ()=>{
  const timestamp = '123456';
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data
  });
  
  it("has a timestamp, lastHash, hash and data property", ()=>{
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('genesis()', ()=>{
    const genesisblock = Block.genesis();
    it('returns a block instance', ()=>{
      expect(genesisblock instanceof Block).toEqual(true);
    })

    it('returns the genesis data', ()=>{
      expect(genesisblock).toEqual(GENESIS_DATA);
    })
  });

});