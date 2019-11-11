import React, { Component } from 'react';

export default class Answers extends Component {
	constructor() {
		super();
	}

	render() {
		if (this.props.state.answers && this.props.state.answers.length > 0) {
			return this.props.state.answers.map(answer => {
				let selectedClass = '';
				let textCount;
				let colorStyle = '';

				if (answer.id === this.props.state.selectedAnswerId) {
					selectedClass = 'selectedAnswer';
				}

				if (this.props.state.result.length > 0) {
					const resultItem = this.props.state.result.find(p => p.id === answer.id);

					textCount = '(' + resultItem.count + ')';

					if (resultItem && resultItem.isTrue) {
						colorStyle = 'trueButton';
					} else if (resultItem && !resultItem.isTrue && answer.id === this.props.state.selectedAnswerId) {
						colorStyle = 'falseButton';
					}
				}

				return (
					<div className="answers" key={answer.id}>
						<button
							key={answer.id}
							className={`answerButton ${selectedClass} ${colorStyle}`}
							onClick={this.props.onAnswerClick.bind(null, answer.id)}
						>
							{answer.answer} {textCount}
						</button>
					</div>
				);
			});
		} else return null;
	}
}
