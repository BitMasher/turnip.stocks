import React from "react";
import Button from "@material-ui/core/Button";
import useSiteContext from "./hooks/useSiteContext";

function LoginLogout() {

	const siteContext = useSiteContext();

	if(siteContext.accountType === 'single') {
		return (
			<Button color="inherit">Logout</Button>
		)
	}
	return (
		<Button color="inherit">Login</Button>
	)
}

export default LoginLogout;
