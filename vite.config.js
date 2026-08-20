import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleMySQLRequest } from './api/db.js';

// Custom Vite plugin to handle /api/db requests during dev mode
function mysqlDevPlugin() {
  return {
    name: 'mysql-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/db', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        let bodyRaw = '';
        req.on('data', chunk => { bodyRaw += chunk; });
        req.on('end', async () => {
          try {
            let body = {};
            if (bodyRaw) {
              try { body = JSON.parse(bodyRaw); } catch(e) {}
            }
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const action = body.action || urlObj.searchParams.get('action') || 'init';
            const data = body.data || body;

            const result = await handleMySQLRequest(action, data);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = result.success ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message || String(err) }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), mysqlDevPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
});
