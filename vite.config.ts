import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const isLocal = fs.existsSync('/opt/tssgui/tssgui/cert/key.pem');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, './src'),
        '@store': path.resolve(__dirname, './src/store'),
        '@components': path.resolve(__dirname, './src/components'),
        '@modules': path.resolve(__dirname, './src/modules'),
        '@pages': path.resolve(__dirname, './src/pages'),
      },
    },
    server: {
      port: 3030,
      host: '0.0.0.0',
      ...(isLocal && {
        https: {
          key: fs.readFileSync('/opt/tssgui/tssgui/cert/key.pem'),
          cert: fs.readFileSync('/opt/tssgui/tssgui/cert/cert.pem'),
        },
      }),
    },
  };
});
