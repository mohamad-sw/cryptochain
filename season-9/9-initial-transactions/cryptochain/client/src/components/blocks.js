import React, { Component } from 'react';
import axios from 'axios';

class Blocks extends React.Component {
  state = {blocks: []};

  async componentDidMount(){
    const response = await axios.get("http://localhost:3000/api/blocks");
    this.setState({blocks: response.data});
  }
  render() { 
    return <div>
      <h3>Blocks</h3>
      {this.state.blocks.map((block)=>{
        return <div key={block.hash}>{block.hash}</div>
      })}
    </div>;
  }
}
 
export default Blocks;