import {List, ListItem, ListItemText} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import useSiteContext from "./hooks/useSiteContext";
import {withRouter} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		drawer: {
			width: "200px"
		}
	}),
);

function AppMenu(props: any) {
	const classes = useStyles();
	const siteContext = useSiteContext();
	const [menuItems, setMenuItems] = useState<{ link: string, text: string }[]>([]);
	useEffect(() => {
		if (!siteContext.configured) {
			setMenuItems([
				{
					link: '/',
					text: 'Home'
				},
				{
					link: '/credits',
					text: 'Credits'
				}
			]);
			return;
		}
		const menu = [
			{
				link: '/',
				text: 'Home'
			},
			{
				link: '/updatelocal',
				text: 'Update Rate'
			},
			{
				link: '/turnips',
				text: 'Turnips'
			}
		];
		if (siteContext.accountType !== 'single') {
			menu.push({
				link: '/findexchange',
				text: 'Join Exchange'
			});
		}
		menu.push({
			link: '/settings',
			text: 'Settings'
		});
		menu.push({
			link: '/credits',
			text: 'Credits'
		});
		setMenuItems(menu);
	}, [siteContext.configured, siteContext.accountType, siteContext.reloadLatch]);

	const menuClick = (link: string) => {
		if(props.onClick) {
			props.onClick();
		}
		props.history.push(link);
	};

	return (
		<List className={classes.drawer}>
			{menuItems.map((data: { link: string, text: string }) => (
				<ListItem button key={data.text} onClick={() => menuClick(data.link)}>
					<ListItemText primary={data.text} primaryTypographyProps={{variant: 'button'}}/>
				</ListItem>
			))}
		</List>
	);
}


export default withRouter(AppMenu);
