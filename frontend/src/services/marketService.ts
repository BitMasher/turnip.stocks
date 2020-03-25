import {db, ETurnipAction, IPosition} from "../db/TurnipRepository";

export interface IStalk {
	name: string
	exchange: string
	isBuy: boolean
	price: number
	history: number[]
}

class MarketService {
	async getWatchedExchanges() {
		const accountType = await db.configs.get('account.type');
		if (accountType === undefined) {
			throw new Error('not configured');
		}
		if (accountType.value === 'single') {
			return ['_'];
		} else {
			// TODO: load in online exchanges
		}
		return [];
	}

	async getExchangeTickers(exchange: string): Promise<IStalk[]> {
		const accountType = await db.configs.get('account.type');
		if (accountType === undefined) {
			throw new Error('not configured');
		}
		const lastUpdate = new Date().getTime();
		if (accountType.value === 'single' && exchange !== '_') {
			return [];
		}
		if (accountType.value !== 'single') {
			// TODO: if we're in online mode then check last update timestamp of stalk
		}
		if ((lastUpdate + (60000 * 30)) >= new Date().getTime()) {
			const stocks = await db.stocks.where('exchange').equals(exchange.toLocaleUpperCase()).toArray();
			return stocks.map(s => {
				return {
					name: s.name,
					exchange: s.exchange,
					isBuy: s.history[s.history.length - 1]?.ts?.getDay() === 0 || false,
					price: s.history[s.history.length - 1]?.price || -1,
					history: s.history.map(h => h.price)
				}
			});
		} else {
			// only true in online mode
			// TODO: update stalk rates from api
		}
		return [];
	}

	async getPositions() {
		const ledger = await db.getLedger();
		if (ledger === undefined) {
			return [];
		}
		let cutOff = new Date();
		cutOff.setDate(cutOff.getDate() - cutOff.getDay());
		cutOff.setHours(0);
		cutOff.setMinutes(0);
		cutOff.setSeconds(0);
		cutOff.setMilliseconds(0);
		const p: any = {};

		function doSell(quantity: number, elements: any, points: number[]) {
			if (points.length === 0) {
				return;
			}
			if (quantity > elements[points[0]]) {
				quantity -= elements[points[0]];
				delete elements[points[0]];
				points.shift();
				doSell(quantity, elements, points);
			} else {
				elements[points[0]] -= quantity;
			}
		}

		const points = [];
		for (let entry of ledger) {
			let ts = new Date(entry.ts);
			ts.setHours(0);
			ts.setMinutes(0);
			ts.setSeconds(0);
			ts.setMilliseconds(0);
			if (ts >= cutOff && entry.action === ETurnipAction.Buy) {
				p[entry.price] = (p[entry.price] || 0) + entry.quantity;
				if (points.indexOf(entry.price) === -1) {
					points.push(entry.price);
				}
			} else if (ts >= cutOff && entry.action === ETurnipAction.Sell) {
				points.sort((a, b) => a - b);
				doSell(entry.quantity, p, points);
			}
		}
		let pos: IPosition[] = [];
		for (let pKey in p) {
			if (p.hasOwnProperty(pKey)) {
				pos.push({price: parseInt(pKey, 10), quantity: p[pKey]});
			}
		}
		pos = pos.sort((a, b) => a.price - b.price);
		return pos;
	}

	async getTotalTurnips() {
		const ledger = await db.ledger.toArray();
		return ledger.reduce((accum, entry) => {
			if (entry.action === ETurnipAction.Buy) {
				accum += entry.quantity;
			} else if (entry.action === ETurnipAction.Sell) {
				accum -= entry.quantity;
			}
			return accum;
		}, 0);
	}

	async updateLocalStockPrice(ts: Date, price: number) {
		ts.setMinutes(0);
		ts.setSeconds(0);
		ts.setMilliseconds(0);
		if (ts.getHours() < 12) {
			ts.setHours(0);
		} else {
			ts.setHours(12);
		}
		// no stalks on sunday, those are buys and only in the am
		if (ts.getDay() === 6) {
			ts.setHours(0)
		}
		const stock = await db.stocks.get("_:_");
		if (stock !== undefined) {
			let idx = stock.history.findIndex(h => h.ts.toString() === ts.toString());
			if (idx === -1) {
				stock.history.push({
					ts: ts,
					price: price
				});
			} else {
				stock.history[idx] = {
					ts: ts,
					price: price
				};
			}
			await db.stocks.put(stock);
			return stock;
		} else {
			// this shouldn't happen
			throw new Error('missing local stock');
		}
	}

	async configureSinglePlayer() {
		// new offline account, clear databases
		await db.clearAll();

		await db.configs.add({key: 'account.type', value: 'single'});

		// local only exchanges are named _
		await db.exchanges.put({
			key: '_',
			name: '_',
			lastRefresh: new Date()
		});

		// local only stocks are named _
		await db.stocks.put({
			key: '_:_',
			name: '_',
			exchange: '_',
			history: [],
		});
	}
}

export default new MarketService();
