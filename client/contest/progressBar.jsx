import React, { Component, Fragment } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

export default class ProgressBar extends Component {
  constructor() {
    super();
  }

  render() {
    let progressText;

    if (!this.props.state.isCompleted && !this.props.state.showResult) {
      progressText = "Kalan Süre: " + this.props.state.second;
    } else if (this.props.state.isCompleted && !this.props.state.showResult) {
      progressText = "Cevap Gönderiliyor...";
    } else if (this.props.state.isCompleted && this.props.state.showResult) {
      progressText = "Sonuçlar. Sonraki soru hazırlanıyor. Kalan Süre: " + this.props.state.nextQuestionSecond;
    }

    return (
      <Fragment>
        {this.props.state.incorrectAnswer ? <div className="secondRemaining">Yarışmadan elendiniz!</div> : null}
        <div className="secondRemaining">{progressText}</div>
        <div>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={(10 - this.props.state.second) * 10}
          />
        </div>
      </Fragment>
    );
  }
}
