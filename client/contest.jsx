import React, { Component } from "react";
import * as Service from "./core/service";
import ProgressBar from './contest/progressBar';
import Answers from './contest/answers';

const _ = require("lodash");

export default class Contest extends Component {
  constructor() {
    super();
    this._setQuestion = this._setQuestion.bind(this);
    this._setAnswers = this._setAnswers.bind(this);
    this._startCountDown = this._startCountDown.bind(this);
    this._clearCountDown = this._clearCountDown.bind(this);
    this._onAnswerClick = this._onAnswerClick.bind(this);
    this._sendAnswer = this._sendAnswer.bind(this);
    this._getResult = this._getResult.bind(this);
    this._nextQuestion = this._nextQuestion.bind(this);
    this.questions = {};
    this.intervalId = 0;
    this.state = {
      order: 0,
      selectedAnswerId: 0,
      question: "",
      second: 10,
      nextQuestionSecond: 10,
      questionId: 0,
      isCompleted: false,
      showResult: false,
      answers: [],
      result: [],
      incorrectAnswer: false
    };
  }

  _setQuestion() {
    const question = this.questions.find(x => x.order === this.state.order + 1);
    const state = {
      order: this.state.order + 1,
      question: question.question,
      selectedAnswerId: 0,
      second: question.second,
      questionId: question.id,
      isCompleted: false,
      showResult: false,
      nextQuestionSecond: 5,
      result: []
    };
    this.setState(prevState => ({
      ...prevState,
      ...state
    }));
    this._setAnswers(question.id);
  }

  _setAnswers(questionId) {
    Service.getAnswers(questionId, data => {
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
    if (!this.state.isCompleted && !this.state.showResult) {
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
    if (
      this.state.result.length === 0 &&
      this.state.isCompleted &&
      !this.state.showResult
    ) {
      setTimeout(() => {
        Service.getResult(this.state.questionId, data => {
          const state = Object.assign({}, this.state);
          state.result = data.data;
          state.showResult = true;
          const selected = state.result.find(x => x.id === this.state.selectedAnswerId);
          if (!selected || !selected.isTrue) {
            state.incorrectAnswer = true;
          }
          this.setState(state);
        });
      }, 10000);
    }
  }

  _nextQuestion() {
    if (this.state.showResult) {
      this.intervalId = setInterval(() => {
        const state = Object.assign({}, this.state);
        state.nextQuestionSecond = state.nextQuestionSecond - 1;
        this.setState(state);
      }, 1000);

      if (this.state.nextQuestionSecond === 0) {
        this._clearCountDown();
        this._setQuestion();
      }
    }   
  }

  _onAnswerClick(answerId) {
    if (this.state.second > 0 && !this.state.incorrectAnswer) {
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
    if (this.state.second === 0 && prevState !== this.state) {
      this._clearCountDown();
      this._sendAnswer();
      this._getResult();
      this._nextQuestion();
    }
  }

  render() {
    
    return (
      <div className="questionDiv">
        <ProgressBar state={this.state}></ProgressBar>
        <div className="question">{this.state.question}</div>
        <Answers state={this.state} onAnswerClick={this._onAnswerClick}></Answers>
      </div>
    );
  }
}
