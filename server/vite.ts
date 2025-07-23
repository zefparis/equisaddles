import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger, type ViteDevServer } from "vite";
import { type Server } from "node:http";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import viteConfig from "../vite.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server): Promise<ViteDevServer> {
  try {
    console.log('Initializing Vite dev server...');
    
    const serverOptions = {
      middlewareMode: true,
      hmr: { 
        server,
        protocol: 'ws',
        host: 'localhost',
        port: 24678
      },
      host: true,
      allowedHosts: true as const,
    };

    console.log('Creating Vite server with options:', {
      ...viteConfig,
      server: serverOptions,
      configFile: false,
      appType: 'custom'
    });

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        info: (msg: string, options?: any) => console.log(`[Vite] ${msg}`, options || ''),
        warn: (msg: string, options?: any) => console.warn(`[Vite] ${msg}`, options || ''),
        error: (msg: string, options?: any) => {
          console.error(`[Vite Error] ${msg}`, options || '');
          viteLogger.error(msg, options);
        },
      },
      server: serverOptions,
      appType: 'custom',
    });

    console.log('Vite server created, applying middleware...');
    app.use(vite.middlewares);
    console.log('Vite middleware applied successfully');
    
    // Handle SPA fallback for Vite dev server
    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      console.log('Handling request for URL:', url);
      
      try {
        const indexPath = path.join(process.cwd(), 'index.html');
        const template = await vite.transformIndexHtml(
          url,
          fs.readFileSync(indexPath, 'utf-8')
        );
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        console.error('Error in Vite request handler:', e);
        next(e);
      }
    });
    
    return vite;
  } catch (error) {
    console.error('Failed to setup Vite:', error);
    throw error;
  }
}

export function serveStatic(app: Express): void {
  console.log('Setting up static file serving...');
  
  // Serve static files from dist/client
  app.use(express.static(path.join(process.cwd(), 'dist/client'), {
    index: false,
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));

  // Serve index.html for all other routes in production
  app.get('*', (_req: Request, res: Response) => {
    try {
      const indexPath = path.join(process.cwd(), 'dist/client/index.html');
      console.log('Serving index.html from:', indexPath);
      
      if (!fs.existsSync(indexPath)) {
        throw new Error(`Index file not found at ${indexPath}`);
      }
      
      res.sendFile(indexPath);
    } catch (error) {
      console.error('Error serving index.html:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  console.log('Static file serving configured');
}
