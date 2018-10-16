import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setNumberOfRecords = this.setNumberOfRecords.bind(this);
    this.createRecords = this.createRecords.bind(this)

    this.state = {
      numberOfRecords: 0
    };
  }

  setNumberOfRecords(n) {
    this.setState({
      numberOfRecords: n
    })
  }

  createRecords() {
    let numberOfRecords = this.state.numberOfRecords
    let url = 'http://ec2-18-222-209-0.us-east-2.compute.amazonaws.com:5000/user'
    callApi(url,  {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        username: 'vaibhavkhl',
        email: 'vaibhav.khl@gmail.com',
        n: numberOfRecords
      }), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(resp => console.log(resp))
  }
  render() {
    return (
      <div className="App">
        <input type="text" value={this.state.numberOfRecords} onChange={(e) => this.setNumberOfRecords(e.target.value)}/>
        <button onClick={this.createRecords}>Create Records</button>
      </div>
    );
  }
}

export default App;

function callApi(url, options) {
    return fetch(url, options).then((resp) => {
      return resp.json().then(data => {
        return data
      })
    })
  }
