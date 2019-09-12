import React, { Component } from "react";
import * as localStorage from "./core/localStorage";
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import { InputLabel , InputBase, IconButton, Paper} from '@material-ui/core';

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

    const button = this.state.buttonName === "Düzenle" ? <CreateIcon /> : <SaveIcon />;

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
          <IconButton aria-label="delete"  className="usernameButton" onClick={() => { this.login(); }}>
              {button}
         </IconButton>
         </Paper>
    );
  }
}
