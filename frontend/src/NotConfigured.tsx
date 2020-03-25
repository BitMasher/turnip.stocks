import React from "react";
import useSiteContext from "./hooks/useSiteContext";

function NotConfigured(props: any) {
	const siteContext = useSiteContext();

	if (!siteContext.configured) {
		return (
			<div>
				{props.children}
			</div>
		)
	} else {
		return (
			<div></div>
		)
	}
}

export default NotConfigured;
