import React, { Component } from 'react';
import axios from 'axios';

class ConductTransaction extends React.Component {

  recipient = React.createRef();
  amount = React.createRef();

  handleSend = async ()=>{
    const recipient = this.recipient.current.value;
    const amount = this.amount.current.value;

    if(recipient && amount){
      const response = await axios.post('http://localhost:3000/api/transact', {recipient, amount});
      if(response.data.type && response.data.type === 'error'){
        alert(response.data.message)
      }else{
        alert('success')
      }
    }
  }

  render() { 
    return <div className="form">
      <input ref={this.recipient} placeholder='recipient' type="text"/>
      <input ref={this.amount} placeholder='amount' type="number"/>
      <button onClick={this.handleSend}>send</button>
    </div>;
  }
}
 
export default ConductTransaction;