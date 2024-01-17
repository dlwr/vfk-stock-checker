/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { parse } from 'node-html-parser';
export interface Env {
	DISCORD_WEBHOOK_URL: string;
}

export default {
	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		const url = 'https://ventforet-shop.net/SHOP/11002.html';
		const dom = await fetch(url)
			.then((response) => response.text())
			.then((text) => parse(text));
		const lStatus = dom.querySelector('#itemStocklist > table > tbody > tr:nth-child(5) > td.stk > p')?.textContent || '×';
		const xlStatus = dom.querySelector('#itemStocklist > table > tbody > tr:nth-child(6) > td.stk > p')?.textContent || '×';
		if (lStatus !== '×' || xlStatus !== '×') {
			await fetch(env.DISCORD_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: `${url}
在庫が復活！
L:${lStatus}
XL:${xlStatus}`,
				}),
			});
		}
	},
};
