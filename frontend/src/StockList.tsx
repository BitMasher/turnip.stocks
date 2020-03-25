import React, {useEffect, useState} from 'react';
import marketService, {IStalk} from './services/marketService';
import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Grid,
	List, ListItem, ListItemAvatar,
	ListItemText, Typography
} from "@material-ui/core";
import {Sparklines, SparklinesLine} from "react-sparklines";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import useSiteContext from "./hooks/useSiteContext";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Ifx from "./Ifx";
import {IPosition} from "./db/TurnipRepository";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {
			marginTop: "15px"
		}
	}),
);

function StockList() {
	const classes = useStyles();
	const siteContext = useSiteContext();
	const [stalkList, setStalkList] = useState<IStalk[]>([]);
	const [positions, setPositions] = useState<IPosition[]>([]);

	useEffect(() => {
		marketService.getWatchedExchanges().then((exchangeList) => {
			let stalkPromises = exchangeList.map(e => marketService.getExchangeTickers(e));
			Promise.all(stalkPromises).then((results) => {
				setStalkList(results.flat<IStalk>(1));
			})
		});
		marketService.getPositions().then((pos) => {
			if (pos !== undefined) {
				setPositions(pos);
			}
		})
	}, [siteContext.reloadLatch]);

	const stalkEntries = stalkList.sort((a, b) => b.price - a.price).map(s => {
		return (
			<ListItem key={s.exchange === '_' ? 'LOCAL' : s.exchange + ":" + s.name === '_' ? 'LOCAL' : s.name}>
				<ListItemAvatar>
					<Avatar>
						<Ifx condition={!s.isBuy}><MonetizationOnIcon color="primary"/></Ifx>
						<Ifx condition={s.isBuy}><ShoppingBasketIcon color="primary"/></Ifx>
					</Avatar>
				</ListItemAvatar>

				<ListItemText
					primary={
						<React.Fragment>
							<Grid container justify="space-between">
								<Grid item>
									{s.exchange === '_' ? 'LOCAL' : s.exchange}:{s.name === '_' ? 'LOCAL' : s.name}
								</Grid>
								<Grid item>
									<Typography color={
										(positions.length > 0 && positions[0].price < s.price
												? 'primary'
												: (positions.length === 0 || (positions.length > 0 && positions[0].price) === s.price
													? 'inherit'
													: 'error')
										)}>
										{(s.price === -1 ? 'N/A' : s.price)} bells
									</Typography>
								</Grid>
							</Grid>
						</React.Fragment>
					}
					secondary={
						<React.Fragment>
							<Sparklines data={s.history} limit={25} height={15}>
								<SparklinesLine color="green"/>
							</Sparklines>
						</React.Fragment>
					}
				/>
			</ListItem>
		)
	});

	return (
		<Card className={classes.card_root}>
			<CardHeader title="Stalk Market"/>
			<CardContent>
				<List>
					{stalkEntries}
				</List>
			</CardContent>
		</Card>
	)
}

export default StockList;
