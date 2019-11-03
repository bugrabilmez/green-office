import React, { Component } from 'react';
import * as Service from '../core/service';

export default class Result extends Component {
  constructor() {
    super();
    this.state = {
      winners: [],
      isCalculated: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      Service.getContestResult(this.props.contestId, result => {
        this.setState({ winners: result.data.winners, isCalculated: true });
      });
    }, 5000);
  }

  render() {
    const winners = this.state.winners.map((winner, i) => {
      return <p key={i}>{winner}</p>;
    });
    if (!this.state.isCalculated) {
      return (
        <div>
          <div className='contestTime'>
            <h2>YARIŞMA TAMAMLANDI!</h2>
            <div className='remainingTime'>Kazanan listesi oluşturuluyor...</div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className='contestTime'>
            <h2>YARIŞMA TAMAMLANDI! KAZANANLAR:</h2>
            <div className='remainingTime'>{winners}</div>
          </div>
        </div>
      );
    }
  }
}
