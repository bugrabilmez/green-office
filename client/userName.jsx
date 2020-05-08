import React, { Component } from 'react';
import * as localStorage from './core/localStorage';
import * as Service from './core/service';
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
			buttonName: 'save',
			isEditable: false,
			notify: {
				message: '',
				error: false,
				show: false
			}
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
	}

	componentWillMount() {
		const username = localStorage.getItem('username');
		const wasSaved = localStorage.getItem('wasSaved');
		if (username) {
			this.setState({
				username: username,
				isDisabled: true,
				isEditable: !wasSaved,
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
				isEditable: true,
				buttonName: 'edit'
			});
		}
	}

	login() {
		if (this.state.buttonName == 'save') {
			Service.saveUsername(this.state.username, (result) => {
				if (result.data.saveSuccessfull) {
					localStorage.setItem('username', this.state.username);
					localStorage.setItem('wasSaved', true);
					this.setState({
						isDisabled: true, isEditable: false, buttonName: 'edit',
						notify: {
							show: true,
							error: false,
							message: 'Kullanıcı adınız başarıyla kaydedildi!'
						}
					});
				} else {
					this.setState({
						notify: {
							show: true,
							error: true,
							message: 'Bu kullanıcı adı kayıtlı, lütfen yeni bir kullanıcı adı giriniz!'
						}
					});
				}
			})
		} else {
			this.setState({ isDisabled: false, buttonName: 'save' });
		}
	}

	render() {
		const button = this.state.buttonName === 'edit' ? <CreateIcon /> : <SaveIcon />;

		return (
			<div style={{ marginTop: 20 }}>
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
							this.state.isEditable ?
								<InputAdornment position="end">
									<IconButton
										onClick={this.login}
									>
										{button}
									</IconButton>
								</InputAdornment>
								: null
						}
						labelWidth={90}
					/>
					{!this.state.username ? <FormHelperText id="filled-weight-helper-text">Yarışmaya katılmak için lütfen kullanıcı adı giriniz! </FormHelperText> : null}
					{this.state.notify.show ? <FormHelperText error={this.state.notify.error} id="filled-weight-helper-text">{this.state.notify.message}  </FormHelperText> : null}
				</FormControl>
			</div>
		);
	}
}
