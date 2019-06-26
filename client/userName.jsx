import React, { Component } from "react";
import * as localStorage from "./core/localStorage";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import Button from '@material-ui/core/Button';

export default class Root extends Component {
  constructor() {
    super();
    this.state = {
        isDisabled: false,
        username: "",
        buttonName:"Giriş"
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ username: e.target.value, isDisabled: false, buttonName:"Giriş" });
  }

  componentWillMount() {
    const username = localStorage.getItem("username");
    if (username) {
        this.setState({ username: username, isDisabled: true,  buttonName:"Düzenle"  });
    }
  }

  login(){
    if(this.state.buttonName == "Giriş"){
    localStorage.setItem("username",this.state.username);
    this.setState({  isDisabled: true , buttonName:"Düzenle"  });
    }
    else{
      this.setState({  isDisabled: false , buttonName:"Giriş"  });
    }
  }

  render() {
    return (
      <Paper className="usernamePaper">
        <InputBase
          className="usernameInput"
          placeholder="Kullanıcı Adınız"
          value={this.state.username}
          onChange={this.handleChange}
          inputProps={{ "aria-label": "Search Google Maps" }}
          disabled={this.state.isDisabled} 
        />
        <Button variant="contained" color="primary" className="usernameButton"  onClick={() => { this.login(); }}>
        {this.state.buttonName}
        <DirectionsIcon/>
      </Button>
         <Divider className="divider" />
         </Paper>
    );
  }
}
