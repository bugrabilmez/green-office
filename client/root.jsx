import React, { Component } from "react";
import * as Service from "./core/service";
import styles from "./style/style.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Contest from './contest';

export default class Root extends Component {
  constructor() {
    super();
    this.intervalId = 0;
    this.state = {
      contest: {
        id: 0,
        name: "",
        description: "",
        startingDateString: "",
        timeRemainingDays: 0,
        timeRemainingHours: 0,
        timeRemainingMinutes: 0,
        timeRemainingSeconds: 0,
        timeRemaining: new Date(),
        startingDate: new Date(),
        countDown: false,
        isTimeUp: false,
        isCompleted: false
      }
    };
  }

  componentWillMount() {
    Service.getContest(contest => {
      this.setState({ contest: contest });
    });
  }

  componentDidMount() {
    if (!this.state.contest.isCompleted) {
      this.intervalId = setInterval(() => {
        const contestTime = Service.calculateRemaining(
          this.state.contest.startingDate
        );
        this.setState(prevState => ({
          contest: {
            ...prevState.contest,
            ...contestTime
          }
        }));
      }, 1000);
    }
  }

  componentDidUpdate() {
    if (this.state.contest.isTimeUp) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    if (!this.state.contest.isCompleted) {
      if (!this.state.contest.isTimeUp && !this.state.contest.countDown) {
        return (
          <Card className="contestCard">
            <CardContent>
              <div>
                <div className="contestTitle">
                  <h3>{this.state.contest.name}</h3>
                  <p>{this.state.contest.description}</p>
                </div>
                <div className="contestTime">
                  <h2>Başlangıç:</h2>
                  <h1>{this.state.contest.startingDateString}</h1>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      } else if (!this.state.contest.isTimeUp && this.state.contest.countDown) {
       let seconds=this.state.contest.timeRemainingSeconds < 10 ? "0":"";
        seconds += this.state.contest.timeRemainingSeconds;
        return (
          <Card className="contestCard">
            <div>
              <div className="contestTime">
                <h2>Yarışma Başlıyor!</h2>
                <div className="remainingTime">
                  {this.state.contest.timeRemainingMinutes}:
                  {seconds}
                </div>
              </div>
            </div>
          </Card>
        );
      } else {
        return (
          <Card className="contestCard">
            <Contest contest={this.state.contest}>
            </Contest>
          </Card>
        );
      }
    } else {
      return null;
    }
  }
}
