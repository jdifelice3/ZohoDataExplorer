import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

export default ({ mode }) => {
  console.log("✅ In vite.config.dev.js, mode:", mode);
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const env = loadEnv(mode, path.resolve(__dirname));

  // Expose only VITE_ variables
  const viteEnvVars = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('VITE_')).map(([key, val]) => [
      `import.meta.env.${key}`,
      JSON.stringify(val)
    ])
  );

  return defineConfig({
    plugins: [react()],
    define: viteEnvVars, // 👈 Inject the env variables here
    optimizeDeps: {
      include: [
        'ag-grid-community/styles/ag-grid.css',
        'ag-grid-community/styles/ag-theme-alpine.css',
        'react-querybuilder/dist/query-builder.css'
      ]
    },
    build: {
      outDir: 'dist/node',
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    }
  });
};
