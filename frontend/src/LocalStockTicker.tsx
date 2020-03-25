import React, {useEffect, useState} from 'react';
import useSiteContext from "./hooks/useSiteContext";
import {db, IStock} from "./db/TurnipRepository";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Dialog, DialogActions, DialogContent, DialogContentText,
	DialogTitle,
	Divider,
	Fab, TextField
} from "@material-ui/core";
import {Sparklines, SparklinesLine} from 'react-sparklines';
import EditIcon from '@material-ui/icons/Edit'
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import marketService from "./services/marketService";


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		stockEdit: {
			marginLeft: 'auto'
		}
	}),
);

function LocalStockTicker() {
	const classes = useStyles();

	const siteContext = useSiteContext();
	const [stockLoaded, setStockLoaded] = useState(false);
	const [stock, setStock] = useState(({key: "_:_", exchange: "_", name: "_", history: []} as IStock));
	const [localRate, setLocalRate] = useState(0);

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

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
		setOpen(false);
		marketService.updateLocalStockPrice(new Date(), localRate).then((stock) => {
			setStock(stock);
			siteContext.triggerReload();
		}).catch((e) => console.error(e));
	};

	if (siteContext.accountType === 'single' && stockLoaded) {

		return (
			<div>
				<Card>
					<CardHeader title="Local Stalk Market"/>
					<CardContent>
						Currently: {stock.history[stock.history.length - 1]?.price || 'N/A'}
						<Divider/>
						<Sparklines data={stock.history.map(p => p.price)} limit={25}>
							<SparklinesLine color="green"/>
						</Sparklines>
					</CardContent>
					<CardActions>
						<Fab color="primary" aria-label="add" className={classes.stockEdit} onClick={handleClickOpen}>
							<EditIcon/>
						</Fab>
					</CardActions>
				</Card>
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
					<DialogContent>
						<DialogContentText>
							New local turnip rate:
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="localTurnipRate"
							label="Local Turnip Rate"
							type="number"
							onChange={(e) => {
								setLocalRate(parseInt(e.target.value, 10))
							}}
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={handleLocalAdd} color="primary">
							Update
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		)
	} else {
		return (
			<div></div>
		)
	}
}

export default LocalStockTicker;
