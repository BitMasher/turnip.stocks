import React, {useEffect, useState} from 'react';
import marketService, {IStalk} from './services/marketService';
import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	TextField,
	Typography
} from "@material-ui/core";
import {Sparklines, SparklinesLine} from "react-sparklines";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import useSiteContext from "./hooks/useSiteContext";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Ifx from "./Ifx";
import {db, ETurnipAction, IPosition} from "./db/TurnipRepository";

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
	const [open, setOpen] = useState(false);
	const [ledgerQuantity, setLedgerQuantity] = useState(0);
	const [ledgerPrice, setLedgerPrice] = useState(0);
	const [ledgerAction, setLedgerAction] = useState(ETurnipAction.Sell);
	const [turnipTotal, setTurnipTotal] = useState(0);
	const [processing, setProcessing] = useState(false);

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
		});
		marketService.getTotalTurnips().then((turnips) => {
			if (turnips !== undefined) {
				setTurnipTotal(turnips);
			}
		});
	}, [siteContext.reloadLatch]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleLedgerPrompt = () => {
		setProcessing(true);
		db.addLedgerEntry(ledgerAction, ledgerQuantity, ledgerPrice).then(() => {
			setOpen(false);
			setProcessing(false);
		});
	};

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
					onClick={() => {
						if (s.price !== -1) {
							setLedgerAction(s.isBuy ? ETurnipAction.Buy : ETurnipAction.Sell);
							setLedgerPrice(s.price);
							setOpen(true);
						}
					}}
				/>
			</ListItem>
		)
	});

	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">{ledgerAction === ETurnipAction.Buy ? "Buy" : "Sell"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						How many turnips are
						you {ledgerAction === ETurnipAction.Buy ? "buying" : "selling"} at {ledgerPrice} bells:
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="ledgerQuantity"
						label="How many?"
						type="number"
						error={ledgerAction === ETurnipAction.Sell && ledgerQuantity > turnipTotal}
						helperText={
							ledgerAction === ETurnipAction.Sell && ledgerQuantity > turnipTotal
								? "You don't have that many turnips"
								: false}
						onChange={(e) => {
							setLedgerQuantity(parseInt(e.target.value, 10))
						}}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" disabled={processing}>
						Cancel
					</Button>
					<Button onClick={handleLedgerPrompt} color="primary" disabled={processing || ledgerQuantity <= 0 || isNaN(ledgerQuantity)}>
						Log
					</Button>
				</DialogActions>
			</Dialog>
			<Card className={classes.card_root}>
				<CardHeader title="Stalk Market"/>
				<CardContent>
					<List>
						{stalkEntries}
					</List>
				</CardContent>
			</Card>
		</div>
	)
}

export default StockList;
