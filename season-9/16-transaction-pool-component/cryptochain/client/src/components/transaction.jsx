import React, { Component } from 'react';

class Transaction extends React.Component {
  render() { 
    const {input, outputMap} = this.props.transaction;
    const recipients = Object.keys(outputMap);
    return <div>
      <div>From: {`${input.address.substring(0,20)}...`} | Balance: {input.amount}</div>
      {
        recipients.map(recipient =>(
        <div key={recipient}>To: {`${recipient.substring(0,20)}`} | sent: {outputMap[recipient]}</div>
        ))
      }
    </div>;
  }
}
 
export default Transaction;