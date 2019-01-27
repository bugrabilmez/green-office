import React, { Component } from "react";
import * as Service from "./core/service";

const _ = require("lodash");

export default class Contest extends Component {
  constructor() {
    super();
    this._setQuestion = this._setQuestion.bind(this);
    this._setAnswers = this._setAnswers.bind(this);
    this._startCountDown = this._startCountDown.bind(this);
    this._clearCountDown = this._clearCountDown.bind(this);
    this.questions = {};
    this.intervalId = 0;
    this.state = {
      order: 0,
      selectedAnswerId: 0,
      question: "",
      second: 10,
      questionId: 0,
      isCompleted: false,
      answers: {}
    };
  }

  _setQuestion() {
    const question = this.questions.find(x => x.order === this.state.order + 1);
    const state = {
      order: this.state.order + 1,
      question: question.question,
      second: question.second,
      questionId: question.id
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

  componentWillMount() {
    Service.getQuestions(this.props.contest.id, questions => {
      this.questions = questions.data;
      this._setQuestion();
    });
    //console.log(this.state);
  }

  componentDidMount() {
    //console.log(this.state);
  }

  componentDidUpdate(prevState) {
    if (this.state.second === 0) {
      this._clearCountDown();
    }
    //console.log(this.state);
  }

  render() {
    console.log(this.state);
    return <div>Sorular</div>;
  }
}
