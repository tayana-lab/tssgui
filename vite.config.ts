import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Plugins
  const plugins = [react()];

  // Resolve aliases
  const aliases = {
    '@app': path.resolve(__dirname, './src'),
    '@store': path.resolve(__dirname, './src/store'),
    '@components': path.resolve(__dirname, './src/components'),
    '@modules': path.resolve(__dirname, './src/modules'),
    '@pages': path.resolve(__dirname, './src/pages'),
  };

  // Server configuration
  const serverOptions = {
    port: 3030, // Specify the port for the development server
    https: {
    key: fs.readFileSync('/opt/tssgui/tssgui/cert/key.pem'), // Path to your SSL key file
    cert: fs.readFileSync('/opt/tssgui/tssgui/cert/cert.pem'), // Path to your SSL certificate file
    },
    host: '10.0.6.102', // Specify the host for the development server
  };
  return {
    mode: mode,
    plugins: plugins,
    resolve: {
      alias: aliases,
    },
    server: serverOptions,
  };
});
