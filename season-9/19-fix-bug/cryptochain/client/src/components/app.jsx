import React, { Component } from 'react';
import axios from 'axios';
import Blocks from './blocks';
import {Link} from 'react-router-dom';

class App extends React.Component {

  state = {walletInfo: {address:"", balance: ""}}

  async componentDidMount(){
    const response = await axios.get(`${document.location.origin}/api/wallet-info`);
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
        <Link to='/transact' ><button>send mony</button></Link>
        <Link to='/transaction-pool' style={{marginLeft: '10px'}} ><button>see pool</button></Link>
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