import React, { Component } from 'react';

class Block extends React.Component {
  render() { 
    const {timestamp, hash, data} = this.props.block;
    const hashDisplay = `${hash.substring(0,15)}...`;
    const strigigiedData = JSON.stringify(data);
    const dataDisplay = strigigiedData.length > 35 ? `${strigigiedData.substring(0,15)}...` : strigigiedData;

    return <div className='block'>
      <div>Hash: {hashDisplay}</div>
      <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
      <div>Data: {dataDisplay}</div>
    </div>;
  }
}
 
export default Block;