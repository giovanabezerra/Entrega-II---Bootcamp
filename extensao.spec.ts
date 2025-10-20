import { test, expect } from '@playwright/test';

// O Playwright (por meio do playwright.config.ts) já injeta o objeto 'page'
// configurado para rodar com sua extensão carregada (pasta 'dist').

test('extensao: valida que a página web é afetada pela extensão', async ({ page }) => {
  
  // 1. Navega até um site de exemplo para que o Content Script da extensão possa ser injetado.
  // URL: https://example.com/
  await page.goto('https://example.com');
  
  // 2. Tenta injetar uma função JavaScript na página para verificar um estilo.
  // Este teste assume que a sua extensão (Content Script) altera o estilo 'outline' de links.
  const outline = await page.evaluate(() => {
    // Tenta obter o estilo computado do primeiro link <a> na página.
    const link = document.querySelector('a');
    if (link) {
      return getComputedStyle(link).outlineStyle;
    }
    return 'none'; // Retorna 'none' se não encontrar o link
  });
  
  // 3. A asserção (o que o teste está esperando):
  // Espera que o outline NÃO seja 'none', indicando que sua extensão modificou o CSS.
  expect(outline).not.toBe('none');
  expect(outline).toBeDefined();
});

// Outros testes (exemplo):
// Se você tivesse uma pasta 'tests' separada, você criaria outros arquivos de teste nela.

