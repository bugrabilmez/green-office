import React, { Component } from 'react';
import * as Service from './core/service';
import styles from './style/style.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Contest from './contest';
import User from './userName';
import Result from './contest/result';

export default class Root extends Component {
	constructor() {
		super();
		this.intervalId = 0;
		this.state = {
			contest: {
				id: 0,
				name: '',
				description: '',
				startingDateString: '',
				timeRemainingDays: 0,
				timeRemainingHours: 0,
				timeRemainingMinutes: 0,
				timeRemainingSeconds: 0,
				timeRemaining: new Date(),
				startingDate: new Date(),
				countDown: false,
				isTimeUp: false,
				isCompleted: false,
				hasStarted: false
			}
		};
	}

	componentWillMount() {
		Service.getContest(contest => {
			this.setState({ contest: contest });
		});
	}

	componentDidMount() {
		if (!this.state.contest.isCompleted) {
			this.intervalId = setInterval(() => {
				const contestTime = Service.calculateRemaining(this.state.contest.startingDate);
				this.setState(prevState => ({
					contest: {
						...prevState.contest,
						...contestTime
					}
				}));
			}, 1000);
		}
	}

	componentDidUpdate() {
		if (this.state.contest.isTimeUp) {
			clearInterval(this.intervalId);
		}
	}

	render() {
		if (!this.state.contest.isCompleted && !this.state.contest.hasStarted) {
			if (!this.state.contest.isTimeUp && !this.state.contest.countDown) {
				return (
					<Card className="contestCard">
						<CardContent>
							<div className="cardItems">
								<div className="contestTitle">{this.state.contest.name}</div>
								<div className="contestInfo">{this.state.contest.description}</div>
								<User />
								<div className="contestTime">
									<div className="contestTimeTitle">Başlangıç Tarihi</div>
									<div className="contestTimeStartDate">{this.state.contest.startingDateString}</div>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			} else if (!this.state.contest.isTimeUp && this.state.contest.countDown) {
				let minutes = this.state.contest.timeRemainingMinutes < 10 ? '0' : '';
				minutes += this.state.contest.timeRemainingMinutes;
				let seconds = this.state.contest.timeRemainingSeconds < 10 ? '0' : '';
				seconds += this.state.contest.timeRemainingSeconds;
				return (
					<Card className="contestCard">
						<div className="cardItems">
							<div className="contestTitle">{this.state.contest.name}</div>
							<div className="contestInfo">{this.state.contest.description}</div>
							<User />
							<div className="contestTime">
								<div className="contestTimeTitle">Yarışma Başlıyor!</div>
								<div className="remainingTime">
									{minutes}:{seconds}
								</div>
							</div>
						</div>
					</Card>
				);
			} else {
				return (
					<Card className="contestCard">
						<Contest contest={this.state.contest}></Contest>
					</Card>
				);
			}
		} else if (!this.state.contest.isCompleted && this.state.contest.hasStarted) {
			return (
				<Card className="contestCard">
					<div className="cardItems">
						<div className="contestTitle">{this.state.contest.name}</div>
						<div className="contestInfo">{this.state.contest.description}</div>
						<div className="contestTime">
							<div className="contestTimeTitle">Yarışma Başladı!</div>
							<div className="contestTimeStartDate">Lütfen sonuçları bekleyiniz...</div>
						</div>
					</div>
				</Card>
			);
		} else if (this.state.contest.isCompleted) {
			return (
				<Card className="contestCard">
					<Result contestId={this.state.contest.id} />
				</Card>
			);
		} else {
			return null;
		}
	}
}
