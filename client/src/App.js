import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setNumberOfRecords = this.setNumberOfRecords.bind(this);
    this.createRecords = this.createRecords.bind(this)
    this.getAllRecords = this.getAllRecords.bind(this)
    this.deleteRecords = this.deleteRecords.bind(this)
    this.setSql = this.setSql.bind(this)
    this.setShowRecords = this.setShowRecords.bind(this)

    this.state = {
      numberOfRecords: 0,
      timeToCreateRecords: '',
      timeToDeleteAllRecords: '',
      timeToGetAllRecords: '',
      records: '',
      useSql: true,
      loading: false,
      showRecords: false
    };
  }

  setNumberOfRecords(n) {
    this.setState({
      numberOfRecords: n
    })
  }

  setSql() {
    this.setState({
      useSql: !this.state.useSql
    })
  }

  setShowRecords() {
    this.setState({
      showRecords: !this.state.showRecords
    })
  }

  createRecords() {
    this.setState({loading: true})
    let numberOfRecords = this.state.numberOfRecords
    let useSql = this.state.useSql
    let url = 'http://ec2-18-222-209-0.us-east-2.compute.amazonaws.com:5000/user'
    //let url = 'http://localhost:5000/user'
    callApi(url,  {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        username: 'vaibhavkhl',
        email: 'vaibhav.khl@gmail.com',
        n: numberOfRecords,
        useSql: useSql
      }), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(resp => this.setState({timeToCreateRecords: resp.time, loading: false}))
  }

  deleteRecords(){
    this.setState({loading: true})
    let url = 'http://ec2-18-222-209-0.us-east-2.compute.amazonaws.com:5000/user'
    //let url = 'http://localhost:5000/user'
    callApi(url,  {
      method: 'DELETE', // or 'PUT'
       // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(resp => this.setState({timeToDeleteAllRecords: resp.time, loading: false}))
  }

  getAllRecords() {
    this.setState({loading: true})
    let url = 'http://ec2-18-222-209-0.us-east-2.compute.amazonaws.com:5000/user'
    //let url = 'http://localhost:5000/user'
    callApi(url,  {
      method: 'GET', // or 'PUT'
       // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(resp => {
        console.log(resp);
        this.setState({timeToGetAllRecords: resp.time, records: resp.result, loading: false})
    })
  }
  render() {

    let recordsItems
    if (this.state.showRecords && this.state.records && this.state.records.length) {
      recordsItems = this.state.records.map((rec, idx) => {
        return (<li key={idx}>{rec.username}</li>)
      })
    }
    return (
      <div className="container" style={{padding: '20px'}}>
        <h4>Action</h4>
        Total records in database: {this.state.records.length}
        <div className="row">
          <label>Number of Records to create:</label>
          <input type="text" value={this.state.numberOfRecords} onChange={(e) => this.setNumberOfRecords(e.target.value)}/>
          Use core sql <input type="checkbox" defaultChecked={this.state.useSql} onChange={this.setSql} />
          <button className="button" onClick={this.createRecords}>Create Records</button>
        </div>

        <div className="row">
          <label>Delete all records</label>
          <button onClick={this.deleteRecords}>delete</button>
        </div>

        <div className="row">
          <label>Get all records</label>
          <button onClick={this.getAllRecords}>get</button>
        </div>


        <div className="row">
          <h4>Benchmarks time in sec:</h4>
          { this.state.loading &&
            <div>Loading...</div>
          }
          <div> Time to create {this.state.numberOfRecords} records: {this.state.timeToCreateRecords}</div>
          <div> Time to get all records records: {this.state.timeToGetAllRecords}</div>
          <div> Time to delete all records: {this.state.timeToDeleteAllRecords}</div>
        </div>

        <div className="row">
          <h4> All Records </h4>
          Show records <input type="checkbox" defaultChecked={this.state.showRecords} onChange={this.setShowRecords} />
          {this.state.showRecords &&
            <ul>{recordsItems}</ul>
          }
        </div>
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
