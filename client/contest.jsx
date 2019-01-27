import React, { Component } from "react";
import * as Service from "./core/service";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";

const _ = require("lodash");

export default class Contest extends Component {
  constructor() {
    super();
    this._setQuestion = this._setQuestion.bind(this);
    this._setAnswers = this._setAnswers.bind(this);
    this._startCountDown = this._startCountDown.bind(this);
    this._clearCountDown = this._clearCountDown.bind(this);
    this._answerButtons = this._answerButtons.bind(this);
    this._onAnswerClick = this._onAnswerClick.bind(this);
    this._sendAnswer = this._sendAnswer.bind(this);
    this._getResult = this._getResult.bind(this);
    this.questions = {};
    this.intervalId = 0;
    this.state = {
      order: 0,
      selectedAnswerId: 0,
      question: "",
      second: 10,
      questionId: 0,
      isCompleted: false,
      showResult: false,
      answers: []
    };
  }

  _setQuestion() {
    const question = this.questions.find(x => x.order === this.state.order + 1);
    const state = {
      order: this.state.order + 1,
      question: question.question,
      second: question.second,
      questionId: question.id,
      isCompleted: false,
      showResult: false
    };
    this.setState(prevState => ({
      ...prevState,
      ...state
    }));
    this._setAnswers();
  }

  _setAnswers() {
    Service.getAnswers(this.state.questionId, data => {
      const state = {
        answers: data.data
      };
      this.setState(prevState => ({
        ...prevState,
        ...state
      }));
      this._startCountDown();
    });
  }

  _startCountDown() {
    this.intervalId = setInterval(() => {
      const state = Object.assign({}, this.state);
      state.second = state.second - 1;
      this.setState(state);
    }, 1000);
  }

  _clearCountDown() {
    clearInterval(this.intervalId);
  }

  _sendAnswer() {
    if (!this.state.isCompleted) {
      Service.sendAnswer(
        this.state.selectedAnswerId,
        this.state.questionId,
        data => {}
      );
      const state = Object.assign({}, this.state);
      state.isCompleted = true;
      this.setState(state);
    }
  }

  _getResult() {
    setTimeout(
      Service.getResult(this.state.questionId, data => {
        console.log(data);
      }),
      10000
    );
  }

  _onAnswerClick(answerId) {
    if (this.state.second > 0) {
      const state = Object.assign({}, this.state);
      state.selectedAnswerId = answerId;
      this.setState(state);
    }
  }

  componentWillMount() {
    Service.getQuestions(this.props.contest.id, questions => {
      this.questions = questions.data;
      this._setQuestion();
    });
  }

  componentDidMount() {}

  componentDidUpdate(prevState) {
    if (this.state.second === 0) {
      this._clearCountDown();
      this._sendAnswer();
      this._getResult();
    }
  }

  _answerButtons() {
    if (this.state.answers && this.state.answers.length > 0) {
      return this.state.answers.map(answer => {
        return (
          <div className="answers" key={answer.id}>
            <Button
              key={answer.id}
              variant="contained"
              fullWidth
              classes={{ label: "answerText" }}
              color={
                answer.id === this.state.selectedAnswerId
                  ? "primary"
                  : "default"
              }
              onClick={this._onAnswerClick.bind(null, answer.id)}
            >
              {answer.answer}
            </Button>
          </div>
        );
      });
    } else return null;
  }

  render() {
    const answers = this._answerButtons();
    const progressText = this.state.isCompleted
      ? "Cevap gönderiliyor."
      : "Kalan Süre: " + this.state.second;

    return (
      <div className="questionDiv">
        <div className="secondRemaining">{progressText}</div>
        <div>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={(10 - this.state.second) * 10}
          />
        </div>
        <div className="question">{this.state.question}</div>
        <div>{answers}</div>
      </div>
    );
  }
}
