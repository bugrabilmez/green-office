import React, { Component } from "react";
import * as localStorage from "./core/localStorage";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';

export default class Root extends Component {
  constructor() {
    super();
    this.state = {
        isDisabled: false,
        username: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ username: e.target.value, isDisabled: false });
    localStorage.setItem("username", e.target.value);
  }

  componentWillMount() {
    const username = localStorage.getItem("username");
    if (username) {
        this.setState({ username: username, isDisabled: true });
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
        />
        <Divider className="divider" />
        <IconButton
          color="primary"
          style={{ padding: 10 }}
          aria-label="Directions"
        >
          <DirectionsIcon />
        </IconButton>
      </Paper>
    );
  }
}
