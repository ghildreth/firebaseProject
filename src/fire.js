import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCcSdxU5NoemLM7trub36IV0-98KFrDfxI",
    authDomain: "sagecoinstakehome.firebaseapp.com",
    databaseURL: "https://sagecoinstakehome.firebaseio.com",
    projectId: "sagecoinstakehome",
    storageBucket: "sagecoinstakehome.appspot.com",
    messagingSenderId: "909622265083"
  };
  var fire = firebase.initializeApp(config);
  export default fire;