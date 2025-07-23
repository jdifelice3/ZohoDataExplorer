import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default ({ mode }) => {
  console.log('✅ In vite.config.prod.js, mode:', mode);
  console.log('📁 __filename:', __filename);

  // Load environment variables
  const env = loadEnv(mode, path.resolve(__dirname));
  console.log('🔧 Loaded env vars:', env);

  // Only include VITE_ variables for frontend injection
  const viteEnvVars = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('VITE_')).map(([key, val]) => [
      `import.meta.env.${key}`,
      JSON.stringify(val)
    ])
  );

  return defineConfig({
    plugins: [react()],
    define: viteEnvVars, // 👈 Inject VITE_ vars here
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  });
};
