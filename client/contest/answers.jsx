import React, { Component } from "react";
import Button from '@material-ui/core/Button';

export default class Answers extends Component {
  constructor() {
    super();
  }

  render() {
    if (this.props.state.answers && this.props.state.answers.length > 0) {

      return this.props.state.answers.map(answer => {
        let color;
        let textCount;
        let colorStyle = "";

        if (answer.id === this.props.state.selectedAnswerId) {
          color = "primary";
        } else {
          color = "default";
        }

        if (this.props.state.result.length > 0) {

          const resultItem = this.props.state.result.find(p => p.id === answer.id);

          textCount = "(" + resultItem.count + ")";

          if (resultItem && resultItem.isTrue) {
            color = "default";
            colorStyle = "trueButton";
          } else if (
            resultItem &&
            !resultItem.isTrue &&
            answer.id === this.props.state.selectedAnswerId
          ) {
            color = "default";
            colorStyle = "falseButton";
          }

        }

        return (
          <div className="answers" key={answer.id}>
            <Button
              key={answer.id}
              variant="contained"
              fullWidth
              classes={{ label: "answerText", root: colorStyle }}
              color={color}
              onClick={this.props.onAnswerClick.bind(null, answer.id)}
            >
              {answer.answer} {textCount}
            </Button>
          </div>
        );

      });

    } else return null;
  }
}
