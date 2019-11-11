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
    let mainText = this.state.winners.map((winner, i) => {
      return <p key={i}>{winner}</p>;
    });

    if (!this.state.isCalculated) {
      mainText = 'Kazanan listesi oluşturuluyor...';
    } else if (this.state.isCalculated && (!this.state.winners || (this.state.winners && this.state.winners.length === 0))) {
      mainText = 'Maalesef kazanan çıkmadı!'
    }

    return (
      <div className="resultMain">
        <div className="flexContainer" style={{ height: '100%' }}>
          <div className="resultHalfDiv resultItems">
            <div className="contestCompleted"></div>
            <div className="resultMainText">{mainText}</div>
          </div>
          <div className="resultHalfDiv resultMadal"></div>
        </div>
      </div>
    );
  }
}
