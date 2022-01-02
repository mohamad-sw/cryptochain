import React, { Component } from 'react';
import axios from 'axios';
import Transaction from './transaction';
import {Link} from 'react-router-dom';


class TransactionPool extends React.Component {
  state ={transactionMap: {}};

  async componentDidMount(){
    const response = await axios.get('http://localhost:3000/api/transaction-pool-map');
    this.setState({transactionMap: response.data});
  }
  render() { 
    return <div className='transaction-pool'>
      <img src="/images/pool.png" alt=""/>
      <Link to='/'><button>back to home</button></Link>
      {
        Object.values(this.state.transactionMap).map(transaction =>{
          return(
            <div key={transaction.id}>
              <hr/>
              <Transaction transaction={transaction} />
            </div>
          )
        })
      }
    </div>;
  }
}
 
export default TransactionPool;