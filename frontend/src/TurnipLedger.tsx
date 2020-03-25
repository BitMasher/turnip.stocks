import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, List, ListItemText} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import useSiteContext from "./hooks/useSiteContext";
import {db, ETurnipAction, ITurnipLedgerEntry} from "./db/TurnipRepository";
import Ifx from "./Ifx";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card_root: {
			marginTop: "15px"
		}
	}),
);

function TurnipLedger() {
	const classes = useStyles();

	const siteContext = useSiteContext();
	const [funds, setFunds] = useState(0);
	const [ledger, setLedger] = useState<ITurnipLedgerEntry[]>([]);

	useEffect(() => {
		db.getLedger().then((ledger) => {
			if (ledger === undefined) {
				return;
			}
			let fund = 0;
			for (let entry of ledger) {
				if (entry.action === ETurnipAction.Buy) {
					fund -= entry.quantity * entry.price;
				} else if (entry.action === ETurnipAction.Sell) {
					fund += entry.quantity * entry.price;
				}
			}
			setFunds(fund);
			setLedger(ledger.reverse());
		});
	}, [siteContext.reloadLatch]);

	const ledgerEntries = ledger.map((l) => {
		return (
			<div>
				<Ifx condition={l.action === ETurnipAction.Buy || l.action === ETurnipAction.Sell}>
					<ListItemText
						key={l.key}
						primary={
							<React.Fragment>
								{l.action === ETurnipAction.Buy ? 'Bought' : 'Sold'} {l.quantity} for {l.price} bells
								each
							</React.Fragment>
						}
						secondary={
							<React.Fragment>
								{l.ts.toDateString()}
							</React.Fragment>
						}
					/>
				</Ifx>
				<Ifx condition={l.action === ETurnipAction.Spoil}>

				</Ifx>
			</div>
		);
	});

	return (
		<Card className={classes.card_root}>
			<CardHeader title="Ledger" subheader={"Available funds: " + funds + " bells"}/>
			<CardContent>
				<List>
					{ledgerEntries}
				</List>
			</CardContent>
		</Card>
	)

}

export default TurnipLedger;
