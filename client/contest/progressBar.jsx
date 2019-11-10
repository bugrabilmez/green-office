import React, { Component, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class ProgressBar extends Component {
	constructor() {
		super();
	}

	render() {
		let progressText;
    // if (this.props.state.second === 4){
    //   debugger;
    // }

		if (!this.props.state.isCompleted && !this.props.state.showResult) {
			progressText = 'Kalan Süre: ' + this.props.state.second;
		} else if (this.props.state.isCompleted && !this.props.state.showResult) {
			progressText = 'Cevap Gönderiliyor...';
		}

		if (this.props.state.isCompleted && this.props.state.showResult) {
			return (
				<div className="flexContainer">
					<div className="progressBarText">Sonuçlar. Sonraki soru hazırlanıyor. Kalan Süre: {this.props.state.nextQuestionSecond}</div>
				</div>
			);
		} else {
			return (
				<div className="flexContainer">
					<div className="progressBarText">{progressText}</div>
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
