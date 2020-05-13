import React from 'react';
import * as Service from './core/service';
import Contest from './contest';
import User from './userName';
import Result from './contest/result';
import FrameGrid from './contest/frameGrid';

export default class Root extends React.Component {
	constructor() {
		super();
		this.intervalIdForContest = 0;
		this.intervalIdForCountDown = 0;
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
		this.intervalIdForContest = setInterval(() => {
			Service.getContest(contest => {
				this.setState({ contest: contest });
			});
		}, 3000);
	}

	componentDidUpdate(prevProps, prevState) {

		// yarışma tamamlandıysa veya başlamasına 5 sn'den az kaldıysa sorgulamayı durdur.
		if (!this.isClearIntervalServer &&
			(this.state.contest.isCompleted
				|| (this.state.contest.countDown && this.state.contest.timeRemainingMinutes === 0 && this.state.contest.timeRemainingSeconds <= 5)
			)) {
			clearInterval(this.intervalIdForContest);
			this.intervalIdForContest = 0;
			this.isClearIntervalServer = true;
		}

		if (!this.state.contest.isCompleted && !this.state.contest.hasStarted && this.state.contest.countDown && !this.isStartIntervalCountDown) {
			this.isStartIntervalCountDown = true;
			this.intervalIdForCountDown = setInterval(() => {
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
			clearInterval(this.intervalIdForCountDown);
			this.intervalIdForCountDown = 0;
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
					<FrameGrid>
						<div className="contestTitle">
							<div><img src="/images/yesilYarisma.png" alt="Kale Yazılım A.Ş." /></div>
							<div>{this.state.contest.name}</div>
						</div>
						<div className="contestInfo">{this.state.contest.description}</div>
						<User />
						<div className="contestTime">
							<div className="contestTimeTitle">Başlangıç Tarihi</div>
							<div className="contestTimeStartDate">{this.state.contest.startingDateString}</div>
						</div>
					</FrameGrid>
				);
			} else if (!this.state.contest.isTimeUp && this.state.contest.countDown) {
				let minutes = this.state.contest.timeRemainingMinutes < 10 ? '0' : '';
				minutes += this.state.contest.timeRemainingMinutes;
				let seconds = this.state.contest.timeRemainingSeconds < 10 ? '0' : '';
				seconds += this.state.contest.timeRemainingSeconds;
				return (
					<FrameGrid>
						<div className="contestTitle">
							<div><img src="/images/yesilYarisma.png" alt="Kale Yazılım A.Ş." /></div>
							<div>{this.state.contest.name}</div>
						</div>
						<div className="contestInfo">{this.state.contest.description}</div>
						<User />
						<div className="contestTime">
							<div className="contestTimeTitle">Yarışma Başlıyor!</div>
							<div className="remainingTime">
								{minutes}:{seconds}
							</div>
						</div>
					</FrameGrid>
				);
			} else {
				return (
					<FrameGrid>
						<Contest contest={this.state.contest} finishingContest={this.finishingContest}></Contest>
					</FrameGrid>
				);
			}
		} else if (!this.state.contest.isCompleted && this.state.contest.hasStarted && this.state.contest.status) {
			return (
				<FrameGrid>
					<div className="contestTitle">
						<div><img src="/images/yesilYarisma.png" alt="Kale Yazılım A.Ş." /></div>
						<div>{this.state.contest.name}</div>
					</div>
					<div className="contestInfo">{this.state.contest.description}</div>
					<div className="contestTime">
						<div className="contestTimeTitle">Yarışma Başladı!</div>
						<div className="contestTimeStartDate">Lütfen sonuçları bekleyiniz...</div>
					</div>
				</FrameGrid>
			);
		} else if (this.state.contest.isCompleted && this.state.contest.status) {
			return <Result contestId={this.state.contest.id} />;
		} else {
			return null;
		}
	}
}
