import {Route, Switch, withRouter} from 'react-router-dom';
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Button, ButtonGroup} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ConfigureSinglePlayer from "./ConfigureSinglePlayer";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {},
		card_media: {
			height: 140,
		},
	}),
);

function ConfigureMarket(props: any) {
	const classes = useStyles();
	const handleSingleplayer = () => {
		props.history.push('/configure/singleplayer')
	};

	const handleMultiplayer = () => {
		props.history.push('/configure/multiplayer')
	};
	return (
		<Switch>
			<Route exact path={props.match.path}>
				<Card className={classes.card_root} raised={true}>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							What's your play style?
						</Typography>
						<ButtonGroup orientation="vertical" color="primary" variant="text" fullWidth={true}
						             size="large">
							<Button fullWidth={true} onClick={handleSingleplayer}>Single Player</Button>
							<Button fullWidth={true} onClick={handleMultiplayer}>Multiplayer</Button>
						</ButtonGroup>
					</CardContent>
				</Card>
			</Route>
			<Route path={props.match.path + "/singleplayer"}>
				<ConfigureSinglePlayer/>
			</Route>
			<Route path={props.match.path + "/multiplayer"}>
				<Card className={classes.card_root} raised={true}>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							Coming Soon
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							Thanks for your interest, our villagers are working tirelessly to bring this feature to you
							ASAP.
						</Typography>
					</CardContent>
				</Card>
			</Route>
		</Switch>
	)
}


export default withRouter(ConfigureMarket);
