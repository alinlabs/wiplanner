import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS & X-Frame-Options Proxy Endpoint for direct live social media profile views
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  const mode = (req.query.mode as string) || 'desktop';
  if (!targetUrl) {
    return res.status(400).send('Missing url query parameter');
  }

  const isMobile = mode === 'mobile';
  const userAgent = isMobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

  try {
    let finalTargetUrl = targetUrl;
    
    // For Instagram profile requests, default to public embed route to bypass forced login walls
    if (finalTargetUrl.includes('instagram.com/') && !finalTargetUrl.includes('/embed') && !finalTargetUrl.includes('/p/')) {
      const cleanUrl = finalTargetUrl.replace(/\/$/, '');
      finalTargetUrl = `${cleanUrl}/embed/`;
    }

    // For TikTok profile requests, default to public embed route to bypass client-side 404 SPA redirects
    if (finalTargetUrl.includes('tiktok.com/@') && !finalTargetUrl.includes('/embed')) {
      const match = finalTargetUrl.match(/tiktok\.com\/(@[^\/?#]+)/);
      if (match) {
        finalTargetUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    }

    const response = await fetch(finalTargetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': isMobile ? '"Chromium";v="123", "Not:A-Brand";v="8"' : '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'Sec-Ch-Ua-Mobile': isMobile ? '?1' : '?0',
        'Sec-Ch-Ua-Platform': isMobile ? '"iOS"' : '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    const contentType = response.headers.get('content-type') || 'text/html';

    // Remove restrictive frame & security headers for iframe embedding
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Frame-Options');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', contentType);

    let body = await response.text();

    // Strip client-side login or 404 redirect scripts if present
    body = body.replace(/window\.location\.(href|replace)\s*=\s*['"][^'"]*(login|404|notfound)[^'"]*['"]/gi, 'console.log("Redirect suppressed")');

    // Inject base tag so relative asset requests resolve to original host
    if (contentType.includes('text/html')) {
      const urlObj = new URL(finalTargetUrl);
      const origin = urlObj.origin;
      const baseTag = `<base href="${origin}/">`;
      if (body.includes('<head>')) {
        body = body.replace('<head>', `<head>${baseTag}`);
      } else {
        body = baseTag + body;
      }
    }

    res.send(body);
  } catch (err: any) {
    res.status(500).send(`Proxy Error: ${err.message}`);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
