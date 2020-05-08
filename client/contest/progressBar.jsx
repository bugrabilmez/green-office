import React from 'react';
import Grid from '@material-ui/core/Grid';
import InsideGrid from './insideGrid';

export default class ProgressBar extends React.Component {
	constructor() {
		super();
	}

	render() {



		if (this.props.state.isCompleted && this.props.state.showResult) {
			const answerResultDiv =
				this.props.state.incorrectAnswer
					? <div className="incorrectBarText">Yarışmadan elendiniz!</div>
					: <div className="progressBarText">Tebrikler, doğru cevap!</div>;
			const answerInfo = this.props.state.result.find(x => x.isTrue === true).answerInfo;
			const message = this.props.state.isFinished ? 'Kazanan listesi oluşturuluyor...' : 'Sonraki soru hazırlanıyor...';
			return (
				<InsideGrid>
					<Grid item xs={12}>
						{answerResultDiv}
					</Grid>
					<Grid item xs={12}>
						<div className="progressBarText">{message}</div>
					</Grid>
					<Grid item xs={12}>
						<div className="progressBarText"> Kalan Süre: {this.props.state.nextQuestionSecond}</div>
					</Grid>
					<Grid item xs={12}>
						<div className="answerInfo">
							<div dangerouslySetInnerHTML={{ __html: answerInfo }}></div>
						</div>
					</Grid>
				</InsideGrid>
			);
		}
		else if (this.props.state.isCompleted && !this.props.state.showResult) {
			return (
				<InsideGrid>
					<Grid item xs={12}>
						<div className="progressBarText">Sonuçlar hazırlanıyor...</div>
					</Grid>
				</InsideGrid>
			);
		}
		else {
			return (
				<InsideGrid>
					<Grid item xs={12} sm={12}>
						{this.props.state.incorrectAnswer ? <div className="incorrectBarText">Yarışmadan elendiniz!</div> : null}
					</Grid>
					<Grid item xs={12} sm={1}>
						<div className="progressBarAnswerCountText"> Soru: {this.props.state.order}/{this.props.questionsLength}</div>
					</Grid>
					<Grid item xs={12} sm={10}>
						<div className="progressBarDiv">
							<div className="progressBarTimeDiv" style={{ width: `${(this.props.state.startingSecond - this.props.state.second) * (100 / this.props.state.startingSecond)}%` }}></div>
						</div>
					</Grid>
					<Grid item xs={12} sm={1}>
						<div className="progressBarTimeText">{this.props.state.second}</div>
					</Grid>
				</InsideGrid>
			);
		}
	}
}
