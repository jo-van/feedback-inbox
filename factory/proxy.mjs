// Egress allowlist proxy for the sandbox. Only HTTPS CONNECT to listed hosts.
import http from 'node:http';
import net from 'node:net';

const ALLOW = (process.env.ALLOW || 'api.anthropic.com,statsig.anthropic.com,mcp-proxy.anthropic.com').split(',');
const ok = (host) => ALLOW.some((a) => host === a);
const server = http.createServer((req, res) => { res.writeHead(403); res.end('only CONNECT allowed'); });
server.on('connect', (req, client, head) => {
  const [host, port] = String(req.url).split(':');
  if (!ok(host) || port !== '443') {
    console.log(new Date().toISOString(), 'DENY', req.url);
    client.end('HTTP/1.1 403 Forbidden\r\n\r\n');
    return;
  }
  const up = net.connect(443, host, () => {
    client.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head?.length) up.write(head);
    up.pipe(client); client.pipe(up);
  });
  up.on('error', () => client.destroy());
  client.on('error', () => up.destroy());
});
server.listen(3128, '0.0.0.0', () => console.log('egress proxy on :3128 allowing', ALLOW.join(', ')));
