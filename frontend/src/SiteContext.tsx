import React, {useEffect, useState} from "react";
import {db} from "./db/TurnipRepository";
import marketService from "./services/marketService";

interface ISiteContext {
	accountType: string
	configured: boolean
	reloadLatch: boolean
	triggerReload: () => void
	configureSinglePlayer: () => Promise<boolean>
}

const initialContext: ISiteContext = {
	accountType: '',
	configured: false,
	reloadLatch: false,
	triggerReload: () => {},
	configureSinglePlayer: () => new Promise<boolean>((resolve, reject) => reject(new Error("not implemented"))),
};

export const SiteContext = React.createContext(initialContext);

export function SiteProvider({children}: any) {

	const [accountType, setAccountType] = useState('');
	const [configured, setConfigured] = useState(false);
	const [reloadLatch, setReloadLatch] = useState(false);

	useEffect(() => {
		db.configs.get('account.type').then((value) => {
			if (value !== undefined) {
				setAccountType(value.value);
				setConfigured(true);
			} else {
				setAccountType('');
				setConfigured(false);
			}
		})
	});

	const value: ISiteContext = React.useMemo(() => {
		return {
			accountType: accountType,
			configured: configured,
			reloadLatch: reloadLatch,
			triggerReload: () => {
				setReloadLatch(!reloadLatch);
			},
			configureSinglePlayer: () => {
				return new Promise<boolean>((resolve, reject) => {
					marketService.configureSinglePlayer().then(() => {
						setAccountType('single');
						setConfigured(true);
						resolve(true);
					}).catch(() => reject());
				});
			},
		};
	}, [accountType, configured, reloadLatch]);
	return (
		<SiteContext.Provider value={value}>{children}</SiteContext.Provider>
	)
}
