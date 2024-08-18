/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { connect } from "@tidbcloud/serverless";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { PrismaClient } from "./generated/client";

interface Env {
  DATABASE_URL: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const connection = connect({ url: env.DATABASE_URL })
		const adapter = new PrismaTiDBCloud(connection)
		const prisma = new PrismaClient({ adapter })
		const first = await prisma.present.findFirst()
		return new Response('Hello World! (Presents v2) ' + first?.name + '!',
		{
			headers: {['Access-Control-Allow-Origin']:
				request.headers.get('Origin')?.includes('presents-web.onrender.com')
				? 'https://presents-web.onrender.com' :
				'http://localhost:5173'
			}
		})
	},
} satisfies ExportedHandler<Env>;
