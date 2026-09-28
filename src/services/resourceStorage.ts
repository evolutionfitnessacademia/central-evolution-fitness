import { DisplayLocation, Resource, ResourceStatus } from '../types/resource';

const STORAGE_KEY = 'evolution_fitness_resources_v1';

export function notifyStorageChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('evolution_resources_updated'));
  }
}

export function getDefaultResources(): Resource[] {
  const publicCadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '')}/?form=cadastro`
    : 'https://evolutionfitness-tr.github.io/central-de-atendimento/?form=cadastro';

  return [
    {
      id: 'cad_novo_aluno',
      name: 'CADASTRO DE NOVO ALUNO',
      category: 'Formulários',
      description: 'Link público do formulário completo em 3 etapas (Cadastro, PAR-Q e Anamnese).',
      link: publicCadUrl,
      buttonText: 'ABRIR FORMULÁRIO',
      whatsappMessage: `Olá! Tudo bem?\nPara iniciarmos sua matrícula na Evolution Fitness, pedimos que você preencha seu Cadastro de Novo Aluno pelo link abaixo:\n\n${publicCadUrl}\n\nO formulário é rápido e inclui o Cadastro, PAR-Q e Anamnese em um único fluxo. Após preencher, envie pelo WhatsApp conforme as orientações da página.`,
      emailSubject: 'Cadastro de Novo Aluno — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\nPara iniciarmos sua matrícula na Evolution Fitness, pedimos que você preencha seu Cadastro de Novo Aluno pelo link abaixo:\n\n${publicCadUrl}\n\nO formulário é rápido e inclui o Cadastro, PAR-Q e Anamnese em um único fluxo. Após preencher, envie pelo WhatsApp conforme as orientações da página.`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'par_q',
      name: 'PAR-Q',
      category: 'Formulários',
      description: 'Questionário de prontidão para atividade física',
      link: 'https://evolutionfitnessacademia.github.io/Parq/',
      buttonText: 'ABRIR FORMULÁRIO',
      whatsappMessage: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha o PAR-Q pelo link abaixo:\n\nhttps://evolutionfitnessacademia.github.io/Parq/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      emailSubject: 'PAR-Q — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha o PAR-Q pelo link abaixo:\n\nhttps://evolutionfitnessacademia.github.io/Parq/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'anamnese',
      name: 'ANAMNESE',
      category: 'Formulários',
      description: 'Histórico e informações do aluno',
      link: 'https://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/',
      buttonText: 'ABRIR FORMULÁRIO',
      whatsappMessage: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha a Anamnese pelo link abaixo:\n\nhttps://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      emailSubject: 'Anamnese — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha a Anamnese pelo link abaixo:\n\nhttps://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'avaliacao_fisica',
      name: 'AVALIAÇÃO FÍSICA',
      category: 'Avaliações',
      description: 'Avaliação física do aluno',
      link: '',
      buttonText: 'ENVIAR LEMBRETE',
      whatsappMessage: `Olá! Tudo bem?\n\nPassando para lembrar da sua avaliação física na Evolution Fitness.\n\nData: [DATA]\nHorário: [HORÁRIO]\n\nPor favor, confirme sua presença respondendo esta mensagem.`,
      emailSubject: 'Lembrete de Avaliação Física — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\n\nPassando para lembrar da sua avaliação física na Evolution Fitness.\n\nData: [DATA]\nHorário: [HORÁRIO]\n\nPor favor, confirme sua presença respondendo esta mensagem.`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'cadastro',
      name: 'CADASTRO',
      category: 'Formulários',
      description: 'Cadastro do aluno',
      link: 'https://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/',
      buttonText: 'ABRIR FORMULÁRIO',
      whatsappMessage: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha seu cadastro pelo link abaixo:\n\nhttps://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      emailSubject: 'Cadastro — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\nPara iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha seu cadastro pelo link abaixo:\n\nhttps://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/\n\nApós preencher, envie o formulário conforme as orientações da página.`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'localizacao',
      name: 'LOCALIZAÇÃO',
      category: 'Atendimento',
      description: 'Encontre a Evolution Fitness. Centro — Três Rios/RJ',
      link: 'https://tinyurl.com/4eubvvez',
      buttonText: 'COMO CHEGAR',
      whatsappMessage: `Evolution Fitness\nRua Dr. Valmir Peçanha, 50\nCentro — Três Rios/RJ\nCEP 25802-180\n\nLink para localização:\nhttps://tinyurl.com/4eubvvez`,
      emailSubject: 'Localização — Evolution Fitness',
      emailBody: `Evolution Fitness\nRua Dr. Valmir Peçanha, 50\nCentro — Três Rios/RJ\nCEP 25802-180\n\nLink para localização:\nhttps://tinyurl.com/4eubvvez`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'eventos',
      name: 'EVENTOS',
      category: 'Eventos',
      description: 'Eventos e experiências da Evolution Fitness',
      link: 'https://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/',
      buttonText: 'ABRIR EVENTOS',
      whatsappMessage: `Olá! Tudo bem?\n\nA Evolution Fitness está realizando o evento Arraiá da Evolution Fitness. Confira os detalhes e participe:\n\nhttps://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/`,
      emailSubject: 'Eventos — Evolution Fitness',
      emailBody: `Olá! Tudo bem?\n\nA Evolution Fitness está realizando o evento Arraiá da Evolution Fitness. Confira os detalhes e participe:\n\nhttps://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'redes_sociais',
      name: 'REDES SOCIAIS',
      category: 'Atendimento',
      description: 'Acompanhe a Evolution Fitness',
      link: 'https://www.instagram.com/evolutionfitness_tr/',
      buttonText: 'INSTAGRAM',
      whatsappMessage: `Acompanhe a Evolution Fitness nas redes sociais: https://www.instagram.com/evolutionfitness_tr/`,
      emailSubject: 'Redes Sociais — Evolution Fitness',
      emailBody: `Acompanhe a Evolution Fitness nas redes sociais: https://www.instagram.com/evolutionfitness_tr/`,
      displayLocation: 'HOME',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'avaliar_google',
      name: 'AVALIAR A EVOLUTION NO GOOGLE',
      category: 'Atendimento',
      description: 'Sua opinião ajuda a Evolution Fitness e outras pessoas a conhecerem nosso trabalho.',
      link: 'https://g.page/r/CXwn8jQ4-Z22EBM/review',
      buttonText: 'ABRIR GOOGLE',
      whatsappMessage: `Olá! Tudo bem?\n\nSua opinião é muito importante para a Evolution Fitness.\n\nSe você já treina com a gente, poderia deixar uma avaliação sobre sua experiência no nosso Perfil da Empresa no Google?\n\nSua opinião ajuda outras pessoas de Três Rios a conhecerem a Evolution Fitness.\n\nÉ rápido e pode ser realizado pelo link abaixo:\n\nhttps://g.page/r/CXwn8jQ4-Z22EBM/review\n\nMuito obrigado por fazer parte da Evolution Fitness.`,
      emailSubject: 'Avalie a Evolution Fitness no Google',
      emailBody: `Olá! Tudo bem?\n\nSua opinião é muito importante para a Evolution Fitness.\n\nSe você já treina com a gente, poderia deixar uma avaliação sobre sua experiência no nosso Perfil da Empresa no Google?\n\nSua opinião ajuda outras pessoas de Três Rios a conhecerem a Evolution Fitness.\n\nÉ rápido e pode ser realizado pelo link abaixo:\n\nhttps://g.page/r/CXwn8jQ4-Z22EBM/review\n\nMuito obrigado por fazer parte da Evolution Fitness.`,
      displayLocation: 'OUTROS RECURSOS',
      status: 'ATIVO',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];
}

export function getStoredResources(): Resource[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      const defaults = getDefaultResources();
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const defaults = getDefaultResources();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
    return defaults;
  } catch (err) {
    console.error('Erro ao recuperar recursos do localStorage:', err);
    return getDefaultResources();
  }
}

export function saveStoredResource(data: Omit<Resource, 'id' | 'createdAt'>): Resource {
  const existing = getStoredResources();
  const newResource: Resource = {
    ...data,
    id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [...existing, newResource];
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    notifyStorageChange();
  } catch (err) {
    console.error('Erro ao salvar recurso no localStorage:', err);
  }

  return newResource;
}

export function updateStoredResource(id: string, updates: Partial<Resource>): Resource | null {
  const existing = getStoredResources();
  const index = existing.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updatedResource: Resource = {
    ...existing[index],
    ...updates,
  };

  existing[index] = updatedResource;

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
    notifyStorageChange();
  } catch (err) {
    console.error('Erro ao atualizar recurso no localStorage:', err);
  }

  return updatedResource;
}

export function deleteStoredResource(id: string): boolean {
  const existing = getStoredResources();
  const filtered = existing.filter((r) => r.id !== id);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    notifyStorageChange();
    return true;
  } catch (err) {
    console.error('Erro ao excluir recurso no localStorage:', err);
    return false;
  }
}

export function toggleResourceStatus(id: string): Resource | null {
  const existing = getStoredResources();
  const resource = existing.find((r) => r.id === id);
  if (!resource) return null;

  const newStatus: ResourceStatus = resource.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
  return updateStoredResource(id, { status: newStatus });
}

export function setResourceDisplayLocation(id: string, displayLocation: DisplayLocation): Resource | null {
  return updateStoredResource(id, { displayLocation });
}

export function reorderResources(location: DisplayLocation, fromIndex: number, toIndex: number): Resource[] {
  const all = getStoredResources();
  const filtered = all.filter((r) => r.displayLocation === location);
  const others = all.filter((r) => r.displayLocation !== location);

  if (fromIndex < 0 || fromIndex >= filtered.length || toIndex < 0 || toIndex >= filtered.length) {
    return all;
  }

  const [moved] = filtered.splice(fromIndex, 1);
  filtered.splice(toIndex, 0, moved);

  // Manter os itens daquela localização na nova ordem
  const merged = location === 'HOME' ? [...filtered, ...others] : [...others, ...filtered];

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    notifyStorageChange();
  } catch (err) {
    console.error('Erro ao reordenar recursos no localStorage:', err);
  }

  return merged;
}
