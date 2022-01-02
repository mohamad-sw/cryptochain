import React, { Component } from 'react';
import axios from 'axios';
import Block from './block';

class Blocks extends React.Component {
  state = {blocks: []};

  async componentDidMount(){
    const response = await axios.get(`${document.location.origin}/api/blocks`);
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
          return <Block key={block.hash} block={block}  />
          })
        }
      </div>
    )
  }
}
 
export default Blocks;