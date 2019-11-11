import React, { Component, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class ProgressBar extends Component {
	constructor() {
		super();
	}

	render() {
		if (this.props.state.isCompleted && this.props.state.showResult) {
			return (
				<div className="flexContainer">
					<div className="progressBarText">Sonuçlar. Sonraki soru hazırlanıyor. Kalan Süre: {this.props.state.nextQuestionSecond}</div>
				</div>
			);
		}
		else if (this.props.state.isCompleted && !this.props.state.showResult) {
			return (
				<div className="flexContainer">
					<div className="progressBarText">Cevap gönderiliyor...</div>
				</div>
			);
		}
		else {
			return (
				<div className="flexContainer">
					<div className="progressBarText">{'Kalan Süre: ' + this.props.state.second}</div>
					<div className="progressBarDiv">
						<div className="progressBarTimeDiv" style={{ width: (10 - this.props.state.second) * 30 }}></div>
					</div>
					<div className="progressBarText">
						Soru: {this.props.state.order}/{this.props.questionsLength}
					</div>
				</div>
			);
		}
	}
}
