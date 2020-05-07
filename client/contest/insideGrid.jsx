import React from 'react';
import { Grid } from '@material-ui/core';


export default class InsideGrid extends React.PureComponent {
    constructor(props) {
        super();
    }
    render() {
        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={this.props.spacing || 8}>
                {this.props.children}
            </Grid>
        );
    }
};