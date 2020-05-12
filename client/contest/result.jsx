import React from 'react';
import * as Service from '../core/service';
import Grid from '@material-ui/core/Grid';

export default class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      winners: [],
      isCalculated: false
    };
  }

  componentDidMount() {
    Service.getContestResult(this.props.contestId, result => {
      this.setState({ winners: result.data.winners, isCalculated: true });
    });
  }

  render() {
    let mainText = this.state.winners.join(', ');

    if (!this.state.isCalculated) {
      mainText = 'Kazanan listesi oluşturuluyor...';
    } else if (this.state.isCalculated && (!this.state.winners || (this.state.winners && this.state.winners.length === 0))) {
      mainText = 'Maalesef kazanan çıkmadı!'
    }

    return (
      <div className="resultMain">
        <Grid
          container
          alignItems="center"
          justify="center"
          className="resultMainGrid">
          <Grid item xs={12} sm={6} className="resultListSide">
            <div><img src="/images/completedContestMin640.png" className="img-responsive marginAuto" alt="Yarışma tamamlandı!" /></div>
            <div className="resultMainText">
              <p>{mainText}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={"resultMadal"}>
          </Grid>
        </Grid>
      </div>
    );
  }
}
