/**
 * Utilitários para detecção e geração do link público do Cadastro de Novo Aluno.
 * Permite que o formulário funcione como uma página pública independente via URL própria.
 */

export function getPublicCadastroUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Remove index.html do final do pathname para manter a URL limpa
    let pathname = window.location.pathname.replace(/\/index\.html$/, '');
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }
    return `${origin}${pathname}?form=cadastro`;
  }
  return 'https://evolutionfitness-tr.github.io/central-de-atendimento/?form=cadastro';
}

export function isPublicCadastroRoute(): boolean {
  if (typeof window === 'undefined') return false;

  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  // Detecta se a URL foi acessada diretamente como formulário público
  return (
    search.includes('form=cadastro') ||
    search.includes('cadastro') ||
    hash.includes('cadastro') ||
    path.endsWith('/cadastro') ||
    path.endsWith('/cadastro.html')
  );
}
