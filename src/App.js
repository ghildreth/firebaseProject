import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      bitcoin: [],
      ethereum: [],
      value: {value: ''},
      total: {total: ''},
      selected: {selected: 'bitcoin'}
    };

    this.handleChangeCAD = this.handleChangeCAD.bind(this);
    this.handleChangeCoin = this.handleChangeCoin.bind(this);
    this.handleSubmitCAD = this.handleSubmitCAD.bind(this)
    this.handleSubmitCoin = this.handleSubmitCoin.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChangeCoin(event) {
    this.setState({value: event.target.value})
    this.setState({total: event.target.value * (this.state.selected === 'bitcoin' ? this.state.bitcoin.ask : this.state.ethereum.ask)})
  }

  handleChangeCAD(event) {
    this.setState({value: event.target.value})
    this.setState({total: event.target.value / (this.state.selected.selected === 'bitcoin' ? this.state.bitcoin.ask : this.state.ethereum.ask)})
  }

  handleSubmitCAD(event) {
    alert('You want to invest: $' + this.state.value  + ' ? You will receive ' + this.state.total + " coins.")
    event.preventDefault();
  }
  handleSubmitCoin(event) {
    alert('You want acquire ' + this.state.value  + ' coins ? Your total will be $' + this.state.total)
    event.preventDefault();
  }
  handleChange(event) {
    this.setState({selected: event.target.value});
  }

  handleSubmit(event) {
    alert('You have selected: ' + this.state.selected.selected);
    event.preventDefault();
  }

  handleClick(event) {
    this.setState({selected: this.state.selected === 'bitcoin' ? "ethereum" : "bitcoin"})
  }

  componentDidMount() {
    fetch(`https://api.quadrigacx.com/v2/ticker?book=btc_cad`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            bitcoin: result 
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
    fetch(`https://api.quadrigacx.com/v2/ticker?book=eth_cad`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            ethereum: result 
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    console.log('You have selected: ' + this.state.selected)
    const { error, isLoaded, bitcoin, ethereum } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>This works!</h1>
          <h2>Buy Bitcoin or Ethereum</h2>
          <div>
            <button onClick={this.handleClick}>Bitcoin: ${bitcoin.ask}</button> 
            <button onClick={this.handleClick}>Ethereum: ${ethereum.ask}</button>          
          </div>
          <form onSubmit={this.handleSubmitCAD}>
            <label>
              Enter CAD Amount here: $
              <br></br>
            <input name="orderForm" value={this.state.value.value} onChange={this.handleChangeCAD}></input>
            </label>
            <input type="submit" value="Submit"/>
            
          </form>
          <form onSubmit={this.handleSubmitCoin}>
            <label>
              Enter the number of coins you wish to purchase
              <br></br>
            <input name="orderForm" value={this.state.value.value} onChange={this.handleChangeCoin}></input>
            </label>
            <input type="submit" value="Submit"/>
            
          </form>

        </div>
      );

    }
  }
}

export default App;
