import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, List, ListItemText} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import useSiteContext from "./hooks/useSiteContext";
import {IPosition} from "./db/TurnipRepository";
import marketService from "./services/marketService";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {
			marginTop: "15px"
		}
	}),
);

function TurnipPositions() {
	const classes = useStyles();

	const siteContext = useSiteContext();
	const [positions, setPositions] = useState<IPosition[]>([]);

	useEffect(() => {
		marketService.getPositions().then((p) => {
			setPositions(p)
		});
	}, [siteContext.reloadLatch]);

	const positionEntries = positions.map((p) => {
		return (
			<ListItemText
				key={p.price}
				primary={
					<React.Fragment>
						{p.quantity} turnips at {p.price} bells each
					</React.Fragment>
				}
			/>
		);
	});

	return (
		<Card className={classes.card_root}>
			<CardHeader title="Positions"/>
			<CardContent>
				<List>
					{positionEntries}
				</List>
			</CardContent>
		</Card>
	)

}

export default TurnipPositions;
