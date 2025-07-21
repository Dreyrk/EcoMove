import httpProxy from "http-proxy";
import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.API_URL;

// Mise en place d'un proxy pour les requête Next js
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  proxyTimeout: 30000,
  headers: {
    "Access-Control-Allow-Credentials": "true",
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target: API_URL }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
