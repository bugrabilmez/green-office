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
		this.isClearIntervalServer = false;
		this.isStartIntervalCountDown = false;
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
				hasStarted: false,
				status: null
			}
		};

		this.finishingContest = this.finishingContest.bind(this);
	}

	componentWillMount() {
		Service.getContest(contest => {
			this.setState({ contest: contest });
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.contest.id !== this.state.contest.id) {
			if (!this.state.contest.isCompleted && !this.state.contest.hasStarted && !this.state.contest.countDown) {
				this.intervalId = setInterval(() => {
					Service.getContest(contest => {
						this.setState({ contest: contest });
					});
				}, 5000);
			}
		}

		if ((this.state.contest.isCompleted || this.state.contest.hasStarted || this.state.contest.countDown) && !this.isClearIntervalServer) {
			this.intervalId = 0;
			this.isClearIntervalServer = true;
		}

		if (!this.state.contest.isCompleted && !this.state.contest.hasStarted && this.state.contest.countDown && !this.isStartIntervalCountDown) {
			this.isStartIntervalCountDown = true;
			this.intervalId = setInterval(() => {
				let totalSecond = this.state.contest.timeRemainingMinutes * 60 + this.state.contest.timeRemainingSeconds;
				totalSecond--;
				const state = {
					timeRemainingMinutes: Math.floor(totalSecond / 60),
					timeRemainingSeconds: totalSecond % 60,
					isTimeUp: totalSecond === 0
				};
				this.setState(prevState => ({
					contest: {
						...prevState.contest,
						...state
					}
				}));
			}, 1000);
		}

		if (!this.state.contest.isCompleted && this.state.contest.isTimeUp && this.isStartIntervalCountDown) {
			clearInterval(this.intervalId);
			this.intervalId = 0;
		}

	}

	finishingContest() {
		const state = {
			isCompleted: true
		};
		this.setState(prevState => ({
			contest: {
				...prevState.contest,
				...state
			}
		}));
	}

	render() {
		if (!this.state.contest.isCompleted && !this.state.contest.hasStarted && this.state.contest.status) {
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
						<Contest contest={this.state.contest} finishingContest={this.finishingContest}></Contest>
					</Card>
				);
			}
		} else if (!this.state.contest.isCompleted && this.state.contest.hasStarted && this.state.contest.status) {
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
		} else if (this.state.contest.isCompleted && this.state.contest.status) {
			return <Result contestId={this.state.contest.id} />;
		} else {
			return null;
		}
	}
}
