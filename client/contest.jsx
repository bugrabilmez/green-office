import React from 'react';
import * as Service from './core/service';
import ProgressBar from './contest/progressBar';
import Answers from './contest/answers';
import InsideGrid from './contest/insideGrid';
import Grid from '@material-ui/core/Grid';

export default class Contest extends React.Component {
  constructor() {
    super();
    this._setQuestion = this._setQuestion.bind(this);
    this._startCountDown = this._startCountDown.bind(this);
    this._clearCountDown = this._clearCountDown.bind(this);
    this._onAnswerClick = this._onAnswerClick.bind(this);
    this._setQuestionCompleted = this._setQuestionCompleted.bind(this);
    this._getResult = this._getResult.bind(this);
    this._nextQuestion = this._nextQuestion.bind(this);
    this.questions = [];
    this.intervalId = 0;
    this.intervalIdForNextQuestion = 0;
    this.startNextQuestionInterval = false;
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
    const question = this.props.contest.questions.find(x => x.order === this.state.order + 1);
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
      result: [],
      answers: question.answerList
    };
    this.setState(prevState => ({
      ...prevState,
      ...state
    }));
    this._startCountDown();
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
        Service.getResult(this.state.questionId, this.props.contest.contest.startingDate, this.state.order, data => {
          const state = Object.assign({}, this.state);
          state.result = data.data;
          state.showResult = true;
          const selected = state.result.find(x => x.id === this.state.selectedAnswerId);
          if (!selected || !selected.isTrue) {
            state.incorrectAnswer = true;
          }
          state.nextQuestionSecond = selected && selected.timeRemainingSeconds ? selected.timeRemainingSeconds : 30;
          this.startNextQuestionInterval = false;
          if (this.state.order === this.props.contest.questions.length) {
            state.isFinished = true;
          }
          this.setState(state);
        });
      }, 15000);
    }
  }

  _nextQuestion() {
    if (this.state.showResult) {
      if (!this.startNextQuestionInterval) {
        this.startNextQuestionInterval = true;
        this.intervalId = setInterval(() => {
          const state = Object.assign({}, this.state);
          state.nextQuestionSecond = state.nextQuestionSecond - 1;
          this.setState(state);
        }, 1000);

        if (this.state.nextQuestionSecond > 5) {
          this.intervalIdForNextQuestion = setInterval(() => {
            Service.getNextQuestionTime(this.props.contest.contest.startingDate, this.state.order, (result) => {
              this.setState({ nextQuestionSecond: result.data.timeRemainingSeconds });
            });
          }, 3000);
        }
      }

      if (this.state.nextQuestionSecond <= 5 && this.intervalIdForNextQuestion !== 0) {
        clearInterval(this.intervalIdForNextQuestion);
        this.intervalIdForNextQuestion = 0;
      }

      if (this.state.nextQuestionSecond === 0) {
        this._clearCountDown();
        if (this.state.order === this.props.contest.questions.length) {
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
    if (this.props.contest.questions && this.props.contest.questions.length > 0) {
      this._setQuestion();
    }
  }

  componentDidUpdate(prevState, prevProps) {
    if (this.state.second === 0 && prevState !== this.state) {
      this._setQuestionCompleted();
      this._getResult();
      this._nextQuestion();
    }
  }

  render() {
    return (
      <InsideGrid spacing={24}>
        <Grid item xs={12}>
          <ProgressBar state={this.state} questionsLength={this.props.contest.questions.length} />
        </Grid>
        <Grid item xs={12}>
          <div className='question'>{this.state.question}</div>
        </Grid>
        <Grid item xs={12}>
          <Answers state={this.state} onAnswerClick={this._onAnswerClick} />
        </Grid>
      </InsideGrid>
    );
  }
}
