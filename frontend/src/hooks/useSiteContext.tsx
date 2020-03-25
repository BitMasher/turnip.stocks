import {SiteContext} from "../SiteContext";
import React from "react";

function useSiteContext() {
	const context = React.useContext(SiteContext);
	if(!context) {
		throw new Error('wrap component in SiteProvider');
	}
	return context;
}

export default useSiteContext;
