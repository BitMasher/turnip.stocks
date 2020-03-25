import React, {useEffect, useState} from 'react';
import useSiteContext from "./hooks/useSiteContext";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {db, IStock} from "./db/TurnipRepository";
import {Card, CardActions, CardContent, CardHeader, Divider, Fab, TextField} from "@material-ui/core";
import {Sparklines, SparklinesLine} from "react-sparklines";
import SaveIcon from "@material-ui/icons/Save";
import Ifx from "./Ifx";
import marketService from "./services/marketService";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		stockEdit: {
			marginLeft: 'auto'
		},
		textarea: {
			marginTop: "15px"
		}
	}),
);

function UpdateRate() {
	const classes = useStyles();

	const siteContext = useSiteContext();
	const [localRate, setLocalRate] = useState(0);
	const [stockLoaded, setStockLoaded] = useState(false);
	const [stock, setStock] = useState(({key: "_:_", exchange: "_", name: "_", history: []} as IStock));
	const [curTs,] = useState(new Date());

	useEffect(() => {
		db.getLocalStock().then((stock) => {
			if (stock !== undefined) {
				setStockLoaded(true);
				setStock(stock);
				setLocalRate(stock.history[stock.history.length - 1]?.price || 0);
			} else {

			}
		}).catch((err) => {
			console.error(err);
		});
	}, [siteContext.reloadLatch]);

	const handleLocalAdd = () => {
		marketService.updateLocalStockPrice(new Date(), localRate).then((stock) => {
			setStock(stock);
			siteContext.triggerReload();
		}).catch((e) => console.error(e));
	};

	if (stockLoaded) {
		return (
			<Card>
				<CardHeader title="Local Stalk Market"/>
				<CardContent>
					<Ifx condition={stock && stock.history.length > 0}>
						{
							stock.history[stock.history.length - 1]?.ts.getDay() === 0 ? 'Buy' : 'Sell'
						} Rate for {stock.history[stock.history.length - 1]?.ts.toDateString()}{
						stock.history[stock.history.length - 1]?.ts.getDay() === 0 ? '' : (
							stock.history[stock.history.length - 1]?.ts.getHours() === 0 ? ' AM' : ' PM'
						)
					}:&nbsp;&nbsp;
						{stock.history[stock.history.length - 1]?.price || 'N/A'} bells
						<Divider/>
						<Sparklines data={stock.history.map(p => p.price)} limit={25}>
							<SparklinesLine color="green"/>
						</Sparklines>
						<Divider/>
					</Ifx>
					New {curTs.getDay() === 0 ? 'Buy' : 'Sell'} Rate for {curTs.toDateString()}
					{
						curTs.getDay() === 0 ? '' : (
							curTs.getHours() === 0 ? ' AM' : ' PM'
						)
					}:<br/>
					<TextField label="Bells" fullWidth variant="outlined" className={classes.textarea}
					           onChange={(e) => setLocalRate(parseInt(e.target.value,10))}></TextField>
				</CardContent>
				< CardActions>
					< Fab color="primary" aria-label="add" className={classes.stockEdit} onClick={handleLocalAdd}>
						<SaveIcon/>
					</Fab>
				</CardActions>
			</Card>
		);
	} else {
		return (
			<Card>
				<CardHeader title="Local Stalk Market"/>
				<CardContent>
					Loading...
				</CardContent>
			</Card>
		);
	}
}

export default UpdateRate;
