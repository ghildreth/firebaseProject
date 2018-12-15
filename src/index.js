import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase";

  var config = {
    apiKey: "AIzaSyCcSdxU5NoemLM7trub36IV0-98KFrDfxI",
    authDomain: "sagecoinstakehome.firebaseapp.com",
    databaseURL: "https://sagecoinstakehome.firebaseio.com",
    projectId: "sagecoinstakehome",
    storageBucket: "sagecoinstakehome.appspot.com",
    messagingSenderId: "909622265083"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
