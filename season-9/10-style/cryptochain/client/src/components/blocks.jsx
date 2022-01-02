import React, { Component } from 'react';
import axios from 'axios';

class Blocks extends React.Component {
  state = {blocks: []};

  async componentDidMount(){
    const response = await axios.get("http://localhost:3000/api/blocks");
    this.setState({blocks: response.data});
  }
  render() { 
    return (
      <div className="blocks">
        <div className="header">
          <img src="/images/blockchain.png" alt=""/>
          <h1>CRYPTOCHAIN</h1>
        </div>
        {
          this.state.blocks.map((block)=>{
          return <div key={block.hash} className="block">{block.hash}</div>
          })
        }
      </div>
    )
  }
}
 
export default Blocks;