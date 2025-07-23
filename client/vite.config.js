export default async ({ mode }) => {
  console.log(`🚀 Loaded vite.config.js in ${mode} mode`);

  if (mode === 'production') {
    const prod = await import('./vite.config.prod.js');
    console.log('Loaded prod config:', typeof prod.default);
    return typeof prod.default === 'function' ? prod.default({ mode }) : prod.default;
  } else {
    const dev = await import('./vite.config.dev.js');
    console.log('Loaded dev config:', typeof dev.default);
    return typeof dev.default === 'function' ? dev.default({ mode }) : dev.default;
  }
};
