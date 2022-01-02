import React, { Component } from 'react';
import axios from 'axios';
import Blocks from './blocks';

class App extends React.Component {

  state = {walletInfo: {address:"", balance: ""}}

  async componentDidMount(){
    const response = await axios.get('http://localhost:3000/api/wallet-info');
    this.setState({walletInfo: response.data});
  }

  render(){
    return <>
    <div className="wallet">
      <div>
        <img src="/images/wallet.png" />
      </div>
      <div>
        <h1>YOUR WALLET</h1>
        <div className="address">
          <i className="fas fa-key" ></i>
          Address: {this.state.walletInfo.address}
        </div>
        <div className="balance">
          <i className="fas fa-coins" ></i>
          Balance: {this.state.walletInfo.balance}
        </div>
      </div>
    </div>
    <Blocks />
    </>
  }

}
 
export default App;