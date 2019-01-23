import React, { Component } from "react";
import * as Service from "./core/service";
import styles from "./style/style.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default class Root extends Component {
  constructor() {
    super();
    this.state = {
      contest: {
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
        isTimeUp: false
      }
    };
  }

  componentWillMount() {
    Service.getContest(contest => {
      this.setState({ contest: contest });
    });
  }

  componentDidMount() {
    setInterval(() => {
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

  render() {
    if (!this.state.contest.isTimeUp && !this.state.contest.countDown) {
      return (
        <Card className="contestCard">
          <CardContent>
            {/* <Typography variant="h5" component="h2">
              {this.state.contest.name}
            </Typography>
            <Typography color="textSecondary">
              {this.state.contest.description}
            </Typography> */}
            <Typography variant="h5" component="h2" align="center">
              Başlangıç:
            </Typography>
            <Typography variant="h3" component="h2" align="center">
              {this.state.contest.startingDateString}
            </Typography>
          </CardContent>
        </Card>
      );
    } else if (!this.state.contest.isTimeUp && this.state.contest.countDown) {
      return (
        <Card className="contestCard">
          <Typography variant="h5" component="h2" align="center">
            Yarışma Başlıyor!
          </Typography>
          <Typography variant="h3" component="h2" align="center">
            {this.state.contest.timeRemainingMinutes}:
            {this.state.contest.timeRemainingSeconds}
          </Typography>
        </Card>
      );
    } else {
      return (
        <Card className="contestCard">
          <Typography variant="h5" component="h2" align="center">
            Yarışma Başladı.
          </Typography>
        </Card>
      );
    }
  }
}
