import { test, expect } from '@playwright/test';

// O Playwright (por meio do playwright.config.ts) já injeta o objeto 'page'
// configurado para rodar com sua extensão carregada (pasta 'dist').

test('extensao: valida que a página web é afetada pela extensão', async ({ page }) => {
	
	// 1. Navega até um site de exemplo para que o Content Script da extensão possa ser injetado.
	// URL: https://example.com/
	await page.goto('https://example.com');
	
	// 2. CORREÇÃO CRÍTICA: Esperar pelo elemento antes de checar o estilo.
	// O Playwright precisa garantir que o elemento <a> existe na página antes de prosseguir.
	const linkSelector = 'a[href="https://www.iana.org/domains/example"]';
	await page.waitForSelector(linkSelector, { state: 'attached' });
	
	// 3. Tenta injetar uma função JavaScript na página para verificar um estilo.
	// Este teste assume que a sua extensão (Content Script) altera o estilo 'outline' de links.
	const outline = await page.evaluate((selector) => {
		// Tenta obter o estilo computado do primeiro link <a> na página.
		const link = document.querySelector(selector);
		if (link) {
			// **MUDANÇA AQUI:** Tentar pegar o outlineStyle.
			return getComputedStyle(link).outlineStyle;
		}
		// O teste falhava porque o CSS da extensão não havia carregado, retornando 'none'.
		return 'none'; 
	}, linkSelector); // Passamos o selector para a função evaluate
	
	// 4. A asserção (o que o teste está esperando):
	// Espera que o outline NÃO seja 'none', indicando que sua extensão modificou o CSS.
	expect(outline).not.toBe('none');
	expect(outline).toBeDefined();
});