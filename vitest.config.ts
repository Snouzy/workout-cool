import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',

      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    }
  },

  resolve: {
    alias: [
      { find: '@public', replacement: path.resolve(__dirname, './public') },
      // Captura exactamente cualquier importación que empiece con "@/locales/" y la redirige a la carpeta raíz locales
      { find: /^@\/locales\/(.*)/, replacement: path.resolve(__dirname, './locales/$1') },
      
      // Captura todo lo demás que empiece con "@/ " (como components, ui, etc.) hacia la carpeta src
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, './src/$1') },
      
      // Respaldo por si acaso queda alguna importación antigua sin arroba
      { find: 'locales', replacement: path.resolve(__dirname, './locales') }
    ]
  }
});