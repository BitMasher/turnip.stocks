import React, {useState} from 'react';
import {createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import {teal, lightBlue} from "@material-ui/core/colors";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LoginLogout from "./LoginLogout";
import Container from "@material-ui/core/Container";
import CallToAction from "./CallToAction";
import NotConfigured from "./NotConfigured";
import ConfigureMarket from './ConfigureMarket'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import {SiteProvider} from "./SiteContext";
import Configured from "./Configured";
import StockList from "./StockList";
import {SwipeableDrawer} from "@material-ui/core";
import AppMenu from "./AppMenu";
import UpdateRate from "./UpdateRate";
import Turnips from "./Turnips";
import Credits from "./Credits";

const theme = createMuiTheme({
	palette: {
		primary: teal,
		secondary: lightBlue,
	},
});

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		container: {
			marginTop: "15px",
		},
	}),
);

function App() {
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const handleDrawerClose = () => {
		setDrawerOpen(false);
	};
	const handleDrawerOpen = () => {
		setDrawerOpen(true);
	};
	return (
		<ThemeProvider theme={theme}>
			<SiteProvider>
				<BrowserRouter>
					<AppBar position="static">
						<Toolbar>
							<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
							            onClick={handleDrawerOpen}>
								<MenuIcon/>
							</IconButton>
							<Typography variant="h6" className={classes.title}>
								Turnip Stocks
							</Typography>
							<LoginLogout/>
						</Toolbar>
					</AppBar>
					<SwipeableDrawer
						anchor={'left'}
						open={drawerOpen}
						onClose={handleDrawerClose}
						onOpen={handleDrawerOpen}
					>
						<AppMenu onClick={handleDrawerClose}/>
					</SwipeableDrawer>
					<Container className={classes.container}>
						<Switch>
							<Route exact path="/">
								<NotConfigured>
									<CallToAction/>
								</NotConfigured>
								<Configured>
									<StockList/>
								</Configured>
							</Route>
							<Route path="/configure">
								<ConfigureMarket/>
							</Route>
							<Route path="/updatelocal">
								<UpdateRate/>
							</Route>
							<Route path="/turnips">
								<Turnips/>
							</Route>
							<Route path="/credits">
								<Credits/>
							</Route>
							<Route>
								<Redirect to="/"/>
							</Route>
						</Switch>
					</Container>
				</BrowserRouter>
			</SiteProvider>
		</ThemeProvider>
	);
}

export default App;
