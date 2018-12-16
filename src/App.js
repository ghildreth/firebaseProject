import React, { Component } from "react";
import "./App.css";
import fire, { auth, provider } from "./fire";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      user: null,
      bitcoin: [],
      ethereum: [],
      dollarValue: "",
      coinValue: "",
      totals: [],
      total: '',
      selected: "bitcoin",
      coins: [],
      dollars: [],
    };

    this.handleChangeCAD = this.handleChangeCAD.bind(this);
    this.handleChangeCoin = this.handleChangeCoin.bind(this);
    this.handleSubmitCAD = this.handleSubmitCAD.bind(this);
    this.handleSubmitCoin = this.handleSubmitCoin.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentWillMount() {
    let dollarRef = fire
      .database()
      .ref("CAD")
      .orderByKey()
    dollarRef.on("child_added", snapshot => {
      let dollar = { integer: snapshot.val(), id: snapshot.key, currentCoin: this.state.selected};
      this.setState({ dollars: [dollar].concat(this.state.dollars) });
    });
    let coinRef = fire
      .database()
      .ref("coins")
      .orderByKey()
    coinRef.on("child_added", snapshot => {
      let coin = { integer: snapshot.val(), id: snapshot.key, currentCoin: this.state.selected};
      this.setState({ coins: [coin].concat(this.state.coins) });
    });
  }
  addTotalCAD(event) {
    event.preventDefault();
    fire
      .database()
      .ref("CAD")
      .push(this.state.total);
  }
  addTotalCoin(event) {
    event.preventDefault();
    fire
      .database()
      .ref("coins")
      .push(this.state.total);
  }

  handleChangeCoin(event) {
    this.setState({ coinValue: event.target.value });
    this.setState({
      total:
        event.target.value *
        (this.state.selected === "bitcoin"
          ? this.state.bitcoin.ask
          : this.state.ethereum.ask)
    });
  }

  handleChangeCAD(event) {
    this.setState({ dollarValue: event.target.value });
    this.setState({
      total:
        event.target.value /
        (this.state.selected === "bitcoin"
          ? this.state.bitcoin.ask
          : this.state.ethereum.ask)
    });
  }

  handleSubmitCAD(event) {
    alert(
      "You want to invest: $" +
        this.state.dollarValue +
        " ? You will receive " +
        this.state.total +
        " " +
        this.state.selected +
        "."
    );
    this.setState({ dollarValue: "" });
    event.preventDefault();
  }
  handleSubmitCoin(event) {
    alert(
      "You want acquire " +
        this.state.coinValue +
        " coins ? Your total will be $" +
        this.state.total
    );
    this.setState({ coinValue: "" });
    event.preventDefault();
  }

  handleClick(event) {
    this.setState({
      selected: this.state.selected === "bitcoin" ? "ethereum" : "bitcoin"
    });
    event.preventDefault();
  }

  changeColor() {
    this.setState({});
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        })
      })
  }

  logout(){

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
    console.log("You have selected: " + this.state.selected);

    let btcButton = this.state.selected === "bitcoin" ? "on" : "off";

    let ethButton = this.state.selected === "ethereum" ? "on" : "off";

    const { error, isLoaded, bitcoin, ethereum } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="wrapper">
        <div style={{float: `right`}} className="loginlogout">
          {!this.state.user ?
            <button onClick={this.login}>Log in</button> 
          :
            <button onClick={this.logout}>Log out</button> 
          }
          </div>
          <h1>Sage Coins Demo</h1>
          <h2>Buy Bitcoin or Ethereum</h2>
          <div>
            <button className={btcButton} onClick={this.handleClick}>
              Bitcoin: ${bitcoin.ask}
            </button>
            <button className={ethButton} onClick={this.handleClick}>
              Ethereum: ${ethereum.ask}
            </button>
          </div>
          {this.state.user ?
          <div>
          <form onSubmit={this.handleSubmitCAD && this.addTotalCAD.bind(this)}>
            <label>
              Enter CAD Amount here: $<br />
              <input
                name="orderForm"
                value={this.state.dollarValue}
                onChange={this.handleChangeCAD}
                ref={el => (this.inputEl = el)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <form onSubmit={this.handleSubmitCoin && this.addTotalCoin.bind(this)}>
            <label>
              Enter the number of coins you wish to purchase
              <br />
              <input
                name="orderForm"
                value={this.state.coinValue}
                onChange={this.handleChangeCoin}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
          </div>
          :
          <h1 style={{textShadow: `2px 2px black`}}>Please login to start investing!</h1>
          }
            <h4>Transaction History</h4>
          <ul>
            {this.state.coins.map(indiv => <li key={indiv.key}>CAD spent on {indiv.currentCoin}: ${indiv.integer}</li>)}
            {this.state.dollars.map(indiv => <li key={indiv.key}>{indiv.currentCoin} acquired by CAD: {indiv.integer}</li>)}
           </ul> 
        </div>
      );
    }
  }
}

export default App;
