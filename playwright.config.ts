import { defineConfig, devices } from '@playwright/test';

// Define o diretório onde a extensão é construída (que o 'npm run build' cria).
const pathToExtension = require('path').join(__dirname, 'dist');

/**
 * Consulte https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // CORREÇÃO: Aumenta o tempo limite de 30s para 60s para evitar erros de setup.
  timeout: 60 * 1000, 
  
  // Diretório onde os testes estão localizados.
  testDir: './', 
  
  // Não precisa de servidor web para rodar, pois a extensão não é um site.
  webServer: undefined, 
  
  // Configurações para o HTML Reporter (relatórios visuais).
  reporter: 'html',
  
  use: {
    // Modo headless (sem interface gráfica) deve ser desativado para extensões.
    headless: false,
  },

  projects: [
    {
      name: 'chromium-with-extension',
      // Usa o Chrome como navegador base para extensões.
      use: {
        ...devices['Desktop Chrome'],
        // CRÍTICO: Configura para carregar a extensão durante o teste.
        launchOptions: {
          args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
          ],
        },
      },
    },
  ],
});
