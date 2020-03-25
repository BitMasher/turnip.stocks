import Dexie from "dexie";

export interface IExchange {
	key: string
	name: string
	lastRefresh: Date
}

export interface IStockPrice {
	ts: Date
	price: number
}

export interface IStock {
	key: string
	exchange: string
	name: string
	history: IStockPrice[]
}

export enum ETurnipAction {
	Buy,
	Sell,
	Compact,
	Spoil
}

export interface ITurnipLedgerEntry {
	key?: number
	ts: Date
	action: ETurnipAction
	quantity: number
	price: number
}

export interface IConfigEntry {
	key: string,
	value: string
}

export interface IPosition {
	price: number
	quantity: number
}


class TurnipDatabase extends Dexie {
	// @ts-ignore
	configs: Dexie.Table<IConfigEntry, string>;
	// @ts-ignore
	exchanges: Dexie.Table<IExchange, string>;
	// @ts-ignore
	stocks: Dexie.Table<IStock, string>;
	// @ts-ignore
	ledger: Dexie.Table<ITurnipLedgerEntry, number>;

	constructor() {
		super("TurnipsDatabase");
		this.version(1).stores({
			configs: "&key",
			exchanges: "&name, lastRefresh",
			stocks: "&key,exchange",
			ledger: "++key, ts"
		});
		this.configs = this.table('configs');
		this.exchanges = this.table('exchanges');
		this.stocks = this.table('stocks');
		this.ledger = this.table('ledger');
	}

	async clearAll() {
		await this.configs.clear();
		await this.exchanges.clear();
		await this.stocks.clear();
		await this.ledger.clear();
	}

	async getLocalStock() {
		return await this.stocks.get('_:_');
	}

	async getLedger() {
		return await this.ledger.toArray();
	}

	async addLedgerEntry(action: ETurnipAction, quantity: number, price: number) {
		await this.ledger.add({
			action: action,
			quantity: quantity,
			price: price,
			ts: new Date(),
		})
	}
}

export const db = new TurnipDatabase();
