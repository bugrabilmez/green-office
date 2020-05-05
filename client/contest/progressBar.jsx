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
			return (
				<React.Fragment>
					{incorrectAnswerDiv}
					<div className="flexContainer marginTop20">
						<div className="progressBarText">Sonuçlar. Sonraki soru hazırlanıyor. Kalan Süre: {this.props.state.nextQuestionSecond}</div>
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
					<div className="progressBarText">Cevap gönderiliyor...</div>
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
							<div className="progressBarTimeDiv" style={{ width: (10 - this.props.state.second) * 30 }}></div>
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
