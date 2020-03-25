import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom';
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import useSiteContext from "./hooks/useSiteContext";


function ConfigureSinglePlayer(props: any) {

	const [status, setStatus] = useState('Configuring...');

	const siteContext = useSiteContext();

	useEffect(() => {
		siteContext.configureSinglePlayer().then((result: boolean) => {
			if(result) {
				setStatus('Configuration complete! Happy turniping!');
				setTimeout(() => props.history.push('/'), 3000);
			} else {
				setStatus("Failed to initialize!");
			}
		}).catch((err) => {
			console.error(err);
		});
	});

	return (
		<Card elevation={4}>
			<CardHeader title="Setup"/>
			<CardContent>
				{status}
			</CardContent>
		</Card>
	)
}

export default withRouter(ConfigureSinglePlayer);
