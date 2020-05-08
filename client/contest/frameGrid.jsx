import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';

class FrameGrid extends React.PureComponent {

    render() {
        return (
            <Grid
                container
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <Grid item xs={12} lg={5}>
                    <Card className="contestCard">
                        <CardContent>
                            {this.props.children}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

}

export default FrameGrid;