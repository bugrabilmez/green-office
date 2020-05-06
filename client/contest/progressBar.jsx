import React, { Component, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class ProgressBar extends Component {
	constructor() {
		super();
	}

	render() {

		let incorrectAnswerDiv = null;

		if (this.props.state.incorrectAnswer) {
			incorrectAnswerDiv = (
				<div className="flexContainer marginTop20">
					<div className="incorrectBarText">Yarışmadan elendiniz!</div>
				</div>
			);
		}

		if (this.props.state.isCompleted && this.props.state.showResult) {
			const answerInfo = this.props.state.result.find(x => x.isTrue === true).answerInfo;
			const message = this.props.state.isFinished ? 'Yarışma sonuçları hazırlanıyor!' : 'Sonraki soru hazırlanıyor.';
			return (
				<React.Fragment>
					{incorrectAnswerDiv}
					<div className="flexContainer marginTop20">
						<div className="progressBarText">Sonuçlar. {message} Kalan Süre: {this.props.state.nextQuestionSecond}</div>
					</div>
					<div className="flexContainer marginTop20 textAlignCenter">
						<div dangerouslySetInnerHTML={{ __html: answerInfo }}></div>
					</div>
				</React.Fragment>
			);
		}
		else if (this.props.state.isCompleted && !this.props.state.showResult) {
			return (
				<div className="flexContainer marginTop20">
					<div className="progressBarText">Sonuçlar hazırlanıyor...</div>
				</div>
			);
		}
		else {
			return (
				<React.Fragment>
					{incorrectAnswerDiv}
					<div className="flexContainer" >
						<div className="progressBarText">{'Kalan Süre: ' + this.props.state.second}</div>
						<div className="progressBarDiv">
							<div className="progressBarTimeDiv" style={{ width: (this.props.state.startingSecond - this.props.state.second) * (300 / this.props.state.startingSecond) }}></div>
						</div>
						<div className="progressBarText">
							Soru: {this.props.state.order}/{this.props.questionsLength}
						</div>
					</div>
				</React.Fragment>
			);
		}
	}
}
