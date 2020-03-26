import React, {useEffect, useState} from "react";
import useSiteContext from "./hooks/useSiteContext";
import TurnipLedger from "./TurnipLedger";
import {db, ETurnipAction} from "./db/TurnipRepository";
import {
	Button,
	ButtonGroup,
	Card,
	CardContent,
	CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Divider,
	List,
	ListItemText,
	TextField
} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import TurnipPositions from "./TurnipPositions";
import marketService from "./services/marketService";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {
			marginTop: "15px"
		}
	}),
);

function Turnips() {
	const classes = useStyles();
	const siteContext = useSiteContext();
	const [localRate, setLocalRate] = useState(0);
	const [remoteRate, setRemoteRate] = useState(0);
	const [buyQuantity, setBuyQuantity] = useState(0);
	const [sellQuantity, setSellQuantity] = useState(0);
	const [buyOpen, setBuyOpen] = useState(false);
	const [sellOpen, setSellOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [turnipTotal, setTurnipTotal] = useState(0);

	useEffect(() => {
		db.getLocalStock().then((stock) => {
			if (stock === undefined) {
				return;
			}
			setLocalRate(stock.history[stock.history.length - 1]?.price || 0)
			setLoading(false);
		});
		marketService.getTotalTurnips().then((turnips) => {
			if (turnips === undefined) {
				return;
			}
			setTurnipTotal(turnips);
		});
	}, [siteContext.reloadLatch]);

	const handleBuyLocal = () => {
		db.addLedgerEntry(ETurnipAction.Buy, buyQuantity, localRate).then(() => siteContext.triggerReload());
		siteContext.triggerReload();
	};
	const handleBuyRemote = () => {
		db.addLedgerEntry(ETurnipAction.Buy, buyQuantity, remoteRate).then(() => siteContext.triggerReload());
		siteContext.triggerReload();
	};
	const handleSellLocal = () => {
		db.addLedgerEntry(ETurnipAction.Sell, sellQuantity, localRate).then(() => siteContext.triggerReload());
		siteContext.triggerReload();
	};
	const handleSellRemote = () => {
		db.addLedgerEntry(ETurnipAction.Sell, sellQuantity, remoteRate).then(() => siteContext.triggerReload());
		siteContext.triggerReload();
	};

	const handleSellRemoteDialog = () => {
		setBuyOpen(false);
		setSellOpen(true);
	};
	const handleBuyRemoteDialog = () => {
		setSellOpen(false);
		setBuyOpen(true);
	};
	const handleBuyClose = () => {
		setBuyOpen(false);
	};
	const handleSellClose = () => {
		setSellOpen(false);
	};

	return (
		<div>
			<Dialog open={buyOpen} onClose={handleBuyClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Remote Rate</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Remote Turnip Rate
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="remoteTurnipRate"
						label="Remote Turnip Rate"
						type="number"
						onChange={(e) => {
							setRemoteRate(parseInt(e.target.value, 10))
						}}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleBuyClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleBuyRemote} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={sellOpen} onClose={handleSellClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Remote Rate</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Remote Turnip Rate
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="remoteTurnipRate"
						label="Remote Turnip Rate"
						type="number"
						onChange={(e) => {
							setRemoteRate(parseInt(e.target.value, 10))
						}}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSellClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSellRemote} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<Card className={classes.card_root}>
				<CardHeader title="New Transaction" subheader={"Local rate at " + localRate + " bells"}/>
				<CardContent>
					<List>
						<ListItemText>
							<TextField type="number" label="Buy Quantity" margin="normal"
							           onChange={(e) => setBuyQuantity(parseInt(e.target.value, 10))}/>
							<ButtonGroup variant="contained" disabled={loading || buyQuantity <= 0}>
								<Button color="primary" onClick={handleBuyLocal}>Local</Button>
								<Button color="secondary" onClick={handleBuyRemoteDialog}>Remote</Button>
							</ButtonGroup>
						</ListItemText>
						<Divider/>
						<ListItemText>
							<TextField type="number" label="Sell Quantity" margin="normal"
							           error={sellQuantity > turnipTotal}
							           helperText={sellQuantity > turnipTotal ? 'Too many turnips' : false}
							           onChange={(e) => setSellQuantity(parseInt(e.target.value, 10))}/>
							<ButtonGroup variant="contained" disabled={loading || sellQuantity <= 0}>
								<Button color="primary" onClick={handleSellLocal}>Local</Button>
								<Button color="secondary" onClick={handleSellRemoteDialog}>Remote</Button>
							</ButtonGroup>
						</ListItemText>
					</List>
				</CardContent>
			</Card>
			<TurnipPositions/>
			<TurnipLedger/>
		</div>
	)
}

export default Turnips
