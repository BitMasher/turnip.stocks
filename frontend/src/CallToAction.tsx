import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {withRouter} from 'react-router-dom';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {},
		card_media: {
			height: 140,
		},
	}),
);

function CallToAction (props: any) {
	const classes = useStyles();

	const handleCallToAction = () => {
		props.history.push('/configure');
	};

	return (
		<Card className={classes.card_root} raised={true}>
			<CardActionArea>
				<CardMedia
					className={classes.card_media}
					image={process.env.PUBLIC_URL + "/philippe-collard-B4y0dFOq510-unsplash.jpg"}
					title="Photo by philippe collard on Unsplash"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						Turnip Stocks
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						Are you ready to become turnipcially independent?<br/>
						Ready to play the market and take a risk?<br/>
						Join Americas fast growing turnip economy!
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="primary" onClick={handleCallToAction}>
					Get Started Today!
				</Button>
			</CardActions>
		</Card>
	)
}

export default withRouter(CallToAction);
