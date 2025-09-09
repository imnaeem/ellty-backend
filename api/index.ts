import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServer } from '../src/app.factory';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getServer();
  return server(req, res);
}
