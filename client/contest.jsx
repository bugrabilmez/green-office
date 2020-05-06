import React, { Component } from 'react';
import * as Service from './core/service';
import ProgressBar from './contest/progressBar';
import Answers from './contest/answers';
import Result from './contest/result';
import * as localStorage from './core/localStorage';

const _ = require('lodash');

export default class Contest extends Component {
  constructor() {
    super();
    this._setQuestion = this._setQuestion.bind(this);
    this._setAnswers = this._setAnswers.bind(this);
    this._startCountDown = this._startCountDown.bind(this);
    this._clearCountDown = this._clearCountDown.bind(this);
    this._onAnswerClick = this._onAnswerClick.bind(this);
    this._setQuestionCompleted = this._setQuestionCompleted.bind(this);
    this._getResult = this._getResult.bind(this);
    this._nextQuestion = this._nextQuestion.bind(this);
    this.questions = [];
    this.intervalId = 0;
    this.state = {
      order: 0,
      selectedAnswerId: 0,
      question: '',
      second: 10,
      startingSecond: 10,
      nextQuestionSecond: 20,
      questionId: 0,
      isCompleted: false,
      showResult: false,
      answers: [],
      result: [],
      incorrectAnswer: false,
      isFinished: false
    };
  }

  _setQuestion() {
    const question = this.questions.find(x => x.order === this.state.order + 1);
    const state = {
      order: this.state.order + 1,
      question: question.question,
      selectedAnswerId: 0,
      second: question.second,
      startingSecond: question.second,
      questionId: question.id,
      isCompleted: false,
      showResult: false,
      nextQuestionSecond: 20,
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

  _setQuestionCompleted() {
    if (!this.state.isCompleted && !this.state.showResult) {
      this._clearCountDown();
      const state = Object.assign({}, this.state);
      state.isCompleted = true;
      this.setState(state);
    }
  }

  _getResult() {
    if (this.state.result.length === 0 && this.state.isCompleted && !this.state.showResult) {
      setTimeout(() => {
        Service.getResult(this.state.questionId, data => {
          const state = Object.assign({}, this.state);
          state.result = data.data;
          state.showResult = true;
          const selected = state.result.find(x => x.id === this.state.selectedAnswerId);
          if (!selected || !selected.isTrue) {
            state.incorrectAnswer = true;
          }
          if (this.state.order === this.questions.length) {
            state.isFinished = true;
          }
          this.setState(state);
        });
      }, 7000);
    }
  }

  _nextQuestion() {
    if (this.state.showResult) {
      if (this.state.nextQuestionSecond === 20) {
        this.intervalId = setInterval(() => {
          const state = Object.assign({}, this.state);
          state.nextQuestionSecond = state.nextQuestionSecond - 1;
          this.setState(state);
        }, 1000);
      }
      if (this.state.nextQuestionSecond === 0) {
        this._clearCountDown();
        if (this.state.order === this.questions.length) {
          this.props.finishingContest();
        } else {
          this._setQuestion();
        }
      }
    }
  }

  _onAnswerClick(answerId) {
    if (this.state.second >= 0 && !this.state.incorrectAnswer && !this.state.isCompleted && !this.state.showResult && !this.state.selectedAnswerId) {
      const state = Object.assign({}, this.state);
      state.selectedAnswerId = answerId;
      Service.sendAnswer(answerId, this.state.questionId, data => { });
      this.setState(state);
    }
  }

  componentWillMount() {
    Service.getQuestions(this.props.contest.id, questions => {
      this.questions = questions.data;
      this._setQuestion();
    });
  }

  componentDidUpdate(prevState) {
    if (this.state.second === 0 && prevState !== this.state) {
      this._setQuestionCompleted();
      this._getResult();
      this._nextQuestion();
    }
  }

  render() {
    return (
      <div className='questionDiv'>
        <ProgressBar state={this.state} questionsLength={this.questions.length} />
        <div className='question'>{this.state.question}</div>
        <Answers state={this.state} onAnswerClick={this._onAnswerClick} />
      </div>
    );

    // else if (!this.state.isFinished && this.state.incorrectAnswer) {
    //   return (
    //     <div className='incorrectAnswer'>
    //       ÜZGÜNÜM,<br />
    //       KAYBETTİNİZ!
    //     </div>
    //   );
    // }
    //else return null;
  }
}
