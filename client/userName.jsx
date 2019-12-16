import React, { Component } from 'react';
import * as localStorage from './core/localStorage';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';

import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

export default class Root extends Component {
	constructor() {
		super();
		this.state = {
			isDisabled: false,
			username: '',
			buttonName: 'save'
		};
		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
	}

	handleChange(e) {
		this.setState({
			username: e.target.value,
			isDisabled: false,
			buttonName: 'save'
		});
		localStorage.setItem('username', e.target.value);
	}

	componentWillMount() {
		const username = localStorage.getItem('username');
		if (username) {
			this.setState({
				username: username,
				isDisabled: true,
				buttonName: 'edit'
			});
		}
		else {
			const randInteger = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
			const randUserName = `Misafir${randInteger.toString()}`
			localStorage.setItem('username', randUserName);
			this.setState({
				username: randUserName,
				isDisabled: true,
				buttonName: 'edit'
			});
		}
	}

	login() {
		if (this.state.buttonName == 'save') {
			localStorage.setItem('username', this.state.username);
			this.setState({ isDisabled: true, buttonName: 'edit' });
		} else {
			this.setState({ isDisabled: false, buttonName: 'save' });
		}
	}

	render() {
		const button = this.state.buttonName === 'edit' ? <CreateIcon /> : <SaveIcon />;

		return (
			<div className="flexContainer" style={{ marginTop: 20 }}>
				<FormControl fullWidth variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">Kullanıcı Adı</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={'text'}
						value={this.state.username}
						onChange={this.handleChange}
						disabled={this.state.isDisabled}
						aria-describedby="filled-weight-helper-text"
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={this.login}
								>
									{button}
								</IconButton>
							</InputAdornment>
						}
						labelWidth={90}
					/>
					{!this.state.username ? <FormHelperText id="filled-weight-helper-text">Yarışmaya katılmak için lütfen kullanıcı adı giriniz! </FormHelperText> : null}
				</FormControl>
			</div>
		);
	}
}
