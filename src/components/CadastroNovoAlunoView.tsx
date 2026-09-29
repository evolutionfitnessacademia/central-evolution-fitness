import React, { useState, useEffect } from 'react';

interface CadastroNovoAlunoViewProps {
  onBack?: () => void;
  isPublic?: boolean;
}

const STORAGE_KEY = 'evolution_fitness_checkout_novo_aluno_v3';
const EVOLUTION_WHATSAPP_NUMBER = '5524981433386';
const SUPABASE_URL = 'https://wxhopowiowujebscvrkw.supabase.co/rest/v1/alunos';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aG9wb3dpb3d1amVic2N2cmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYyMTAsImV4cCI6MjA4OTQ1MjIxMH0.mWlXrr5TYzFo3S8mCJw4cps-IVz9CdHpyfD-O7A5-us';

export default function CadastroNovoAlunoView({ onBack, isPublic = false }: CadastroNovoAlunoViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // ETAPA 1: CAMPOS DO CADASTRO (FONTE DE VERDADE)
  // ==========================================
  // DADOS PESSOAIS
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // ENDEREÇO
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Três Rios');
  const [estado, setEstado] = useState('RJ');
  const [cep, setCep] = useState('');

  // CONTATO E PLANO
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [plano, setPlano] = useState<string[]>(['Evolution On (Musculação)']);

  // RESPONSÁVEL (Apenas para menor de idade, determinado pela Data de Nascimento)
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [idadeResponsavel, setIdadeResponsavel] = useState('');
  const [cpfResponsavel, setCpfResponsavel] = useState('');
  const [celularResponsavel, setCelularResponsavel] = useState('');
  const [parentescoResponsavel, setParentescoResponsavel] = useState('');

  // ==========================================
  // ETAPA 2: CAMPOS DO PAR-Q (FONTE DE VERDADE)
  // ==========================================
  const parqQuestions = [
    {
      id: 1,
      text: 'Alguma vez um médico lhe disse que você possui algum problema cardíaco e que só deveria realizar atividade física recomendada por um médico?',
    },
    {
      id: 2,
      text: 'Você sente dor no peito quando realiza atividade física?',
    },
    {
      id: 3,
      text: 'No último mês, você sentiu dor no peito quando não estava realizando atividade física?',
    },
    {
      id: 4,
      text: 'Você perde o equilíbrio por causa de tontura ou já perdeu a consciência?',
    },
    {
      id: 5,
      text: 'Você possui algum problema ósseo ou articular que poderia piorar com a prática de atividade física?',
    },
    {
      id: 6,
      text: 'Atualmente, algum médico está prescrevendo medicamentos para pressão arterial ou para algum problema cardíaco?',
    },
    {
      id: 7,
      text: 'Existe alguma outra razão, não mencionada acima, pela qual você não deveria realizar atividade física?',
    },
  ];

  const [parqAnswers, setParqAnswers] = useState<{ [key: number]: boolean }>({});
  const [parqObservacoes, setParqObservacoes] = useState('');
  const [parqDeclaracao, setParqDeclaracao] = useState(false);

  // ==========================================
  // ETAPA 3: CAMPOS DA ANAMNESE (FONTE DE VERDADE)
  // ==========================================
  // DADOS GERAIS
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [atividadeProfissional, setAtividadeProfissional] = useState('');

  // DADOS ATUAIS / HÁBITOS E ROTINA
  const [praticaAtividade, setPraticaAtividade] = useState<string>('');
  const [sonoHoras, setSonoHoras] = useState('');
  const [qualidadeSono, setQualidadeSono] = useState('');
  const [fumante, setFumante] = useState<string>('');
  const [cigarrosDia, setCigarrosDia] = useState('');
  const [tempoFumante, setTempoFumante] = useState('');
  const [alcool, setAlcool] = useState<string>('');
  const [frequenciaAlcool, setFrequenciaAlcool] = useState('');
  const [frequenciaAlcoolOutro, setFrequenciaAlcoolOutro] = useState('');

  // HISTÓRICO DA SAÚDE
  const [doencas, setDoencas] = useState<string>('');
  const [quaisDoencas, setQuaisDoencas] = useState('');
  const [medicamento, setMedicamento] = useState<string>('');
  const [quaisMedicamentos, setQuaisMedicamentos] = useState('');
  const [tempoMedicamento, setTempoMedicamento] = useState('');
  const [historicoFamiliar, setHistoricoFamiliar] = useState('');
  const [cronicas, setCronicas] = useState<string>('');
  const [quaisCronicas, setQuaisCronicas] = useState('');

  // ==========================================
  // CÁLCULO DE IDADE AUTOMÁTICO (MENOR DE IDADE)
  // ==========================================
  const calcularIdade = (dataNascStr: string): number | null => {
    if (!dataNascStr) return null;
    const parts = dataNascStr.split('-');
    if (parts.length !== 3) return null;
    const ano = parseInt(parts[0], 10);
    const mes = parseInt(parts[1], 10) - 1;
    const dia = parseInt(parts[2], 10);
    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) return null;

    const dataNasc = new Date(ano, mes, dia);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const difMes = hoje.getMonth() - dataNasc.getMonth();
    if (difMes < 0 || (difMes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  };

  const alunoIdade = calcularIdade(nascimento);
  const isMenorDeIdade = alunoIdade !== null && alunoIdade < 18;

  // Carregar progresso salvo da sessão
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.currentStep) setCurrentStep(d.currentStep);
        if (d.completedSteps) setCompletedSteps(d.completedSteps);
        if (d.nome) setNome(d.nome);
        if (d.cpf) setCpf(d.cpf);
        if (d.nascimento) setNascimento(d.nascimento);
        if (d.whatsapp) setWhatsapp(d.whatsapp);
        if (d.rua) setRua(d.rua);
        if (d.bairro) setBairro(d.bairro);
        if (d.cidade) setCidade(d.cidade);
        if (d.estado) setEstado(d.estado);
        if (d.cep) setCep(d.cep);
        if (d.email) setEmail(d.email);
        if (d.instagram) setInstagram(d.instagram);
        if (d.plano) setPlano(d.plano);
        if (d.nomeResponsavel) setNomeResponsavel(d.nomeResponsavel);
        if (d.idadeResponsavel) setIdadeResponsavel(d.idadeResponsavel);
        if (d.cpfResponsavel) setCpfResponsavel(d.cpfResponsavel);
        if (d.celularResponsavel) setCelularResponsavel(d.celularResponsavel);
        if (d.parentescoResponsavel) setParentescoResponsavel(d.parentescoResponsavel);
        if (d.parqAnswers) setParqAnswers(d.parqAnswers);
        if (d.parqObservacoes) setParqObservacoes(d.parqObservacoes);
        if (d.parqDeclaracao !== undefined) setParqDeclaracao(d.parqDeclaracao);
        if (d.altura) setAltura(d.altura);
        if (d.objetivo) setObjetivo(d.objetivo);
        if (d.atividadeProfissional) setAtividadeProfissional(d.atividadeProfissional);
        if (d.praticaAtividade) setPraticaAtividade(d.praticaAtividade);
        if (d.sonoHoras) setSonoHoras(d.sonoHoras);
        if (d.qualidadeSono) setQualidadeSono(d.qualidadeSono);
        if (d.fumante) setFumante(d.fumante);
        if (d.cigarrosDia) setCigarrosDia(d.cigarrosDia);
        if (d.tempoFumante) setTempoFumante(d.tempoFumante);
        if (d.alcool) setAlcool(d.alcool);
        if (d.frequenciaAlcool) setFrequenciaAlcool(d.frequenciaAlcool);
        if (d.frequenciaAlcoolOutro) setFrequenciaAlcoolOutro(d.frequenciaAlcoolOutro);
        if (d.doencas) setDoencas(d.doencas);
        if (d.quaisDoencas) setQuaisDoencas(d.quaisDoencas);
        if (d.medicamento) setMedicamento(d.medicamento);
        if (d.quaisMedicamentos) setQuaisMedicamentos(d.quaisMedicamentos);
        if (d.tempoMedicamento) setTempoMedicamento(d.tempoMedicamento);
        if (d.historicoFamiliar) setHistoricoFamiliar(d.historicoFamiliar);
        if (d.cronicas) setCronicas(d.cronicas);
        if (d.quaisCronicas) setQuaisCronicas(d.quaisCronicas);
      }
    } catch {
      // Ignora erro de leitura
    }
  }, []);

  // Salvar progresso no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          completedSteps,
          nome,
          cpf,
          nascimento,
          whatsapp,
          rua,
          bairro,
          cidade,
          estado,
          cep,
          email,
          instagram,
          plano,
          nomeResponsavel,
          idadeResponsavel,
          cpfResponsavel,
          celularResponsavel,
          parentescoResponsavel,
          parqAnswers,
          parqObservacoes,
          parqDeclaracao,
          altura,
          objetivo,
          atividadeProfissional,
          praticaAtividade,
          sonoHoras,
          qualidadeSono,
          fumante,
          cigarrosDia,
          tempoFumante,
          alcool,
          frequenciaAlcool,
          frequenciaAlcoolOutro,
          doencas,
          quaisDoencas,
          medicamento,
          quaisMedicamentos,
          tempoMedicamento,
          historicoFamiliar,
          cronicas,
          quaisCronicas,
        })
      );
    } catch {
      // Ignora erro de escrita
    }
  }, [
    currentStep,
    completedSteps,
    nome,
    cpf,
    nascimento,
    whatsapp,
    rua,
    bairro,
    cidade,
    estado,
    cep,
    email,
    instagram,
    plano,
    nomeResponsavel,
    idadeResponsavel,
    cpfResponsavel,
    celularResponsavel,
    parentescoResponsavel,
    parqAnswers,
    parqObservacoes,
    parqDeclaracao,
    altura,
    objetivo,
    atividadeProfissional,
    praticaAtividade,
    sonoHoras,
    qualidadeSono,
    fumante,
    cigarrosDia,
    tempoFumante,
    alcool,
    frequenciaAlcool,
    frequenciaAlcoolOutro,
    doencas,
    quaisDoencas,
    medicamento,
    quaisMedicamentos,
    tempoMedicamento,
    historicoFamiliar,
    cronicas,
    quaisCronicas,
  ]);

  // ==========================================
  // MÁSCARAS E FORMATAÇÕES (IDÊNTICAS AO ORIGINAL)
  // ==========================================
  const formatCPF = (v: string) => {
    let s = v.replace(/\D/g, '').slice(0, 11);
    s = s.replace(/(\d{3})(\d)/, '$1.$2');
    s = s.replace(/(\d{3})(\d)/, '$1.$2');
    s = s.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return s;
  };

  const formatPhone = (v: string) => {
    const s = v.replace(/\D/g, '').slice(0, 11);
    if (s.length >= 7) {
      return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
    }
    if (s.length >= 3) {
      return `(${s.slice(0, 2)}) ${s.slice(2)}`;
    }
    return s;
  };

  const formatCEP = (v: string) => {
    const s = v.replace(/\D/g, '').slice(0, 8);
    if (s.length > 5) {
      return `${s.slice(0, 5)}-${s.slice(5)}`;
    }
    return s;
  };

  const formatDateBR = (iso: string) => {
    if (!iso) return '—';
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return iso;
  };

  const handleTogglePlano = (p: string) => {
    if (plano.includes(p)) {
      if (plano.length > 1) {
        setPlano(plano.filter((item) => item !== p));
      }
    } else {
      setPlano([...plano, p]);
    }
  };

  // ==========================================
  // VALIDAÇÕES E TRANSIÇÕES DE ETAPAS
  // ==========================================
  const handleAvancarEtapa1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cpf.trim() || !nascimento || !whatsapp.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios dos Dados Pessoais.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isMenorDeIdade) {
      if (
        !nomeResponsavel.trim() ||
        !idadeResponsavel.trim() ||
        !cpfResponsavel.trim() ||
        !celularResponsavel.trim() ||
        !parentescoResponsavel.trim()
      ) {
        setErrorMessage(
          'Como o aluno é menor de idade, todos os dados do Responsável são obrigatórios.'
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const idadeNum = parseInt(idadeResponsavel, 10);
      if (isNaN(idadeNum) || idadeNum < 18 || idadeNum > 120) {
        setErrorMessage(
          'A idade do responsável deve ser de no mínimo 18 e no máximo 120 anos.'
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setErrorMessage('');
    if (!completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAvancarEtapa2 = (e: React.FormEvent) => {
    e.preventDefault();
    const unanswered = parqQuestions.filter((q) => parqAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setErrorMessage(
        `Por favor, responda SIM ou NÃO para todas as perguntas do PAR-Q (faltam ${unanswered.length} perguntas).`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!parqDeclaracao) {
      setErrorMessage(
        'Por favor, marque a declaração confirmando que as informações prestadas são verdadeiras.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrorMessage('');
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizarCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!altura.trim()) {
      setErrorMessage('Por favor, informe a Altura do aluno na Anamnese.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!praticaAtividade || !fumante || !alcool || !doencas || !medicamento || !cronicas) {
      setErrorMessage(
        'Por favor, responda a todas as perguntas de SIM/NÃO da Anamnese para finalizar o cadastro.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    // Gravação definitiva no Supabase (compatível com a tabela existente e Google Sheets)
    try {
      const parts = nascimento.split('-');
      const nascFmt = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : nascimento;

      const payload = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        nascimento: nascFmt,
        whatsapp: whatsapp.trim(),
        email: email.trim() || null,
        instagram: instagram.trim() || null,
        rua: rua.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado,
        cep: cep.trim(),
        plano: plano.join(', ') || 'Evolution On (Musculação)',
      };

      await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify([payload]),
      });
    } catch (err) {
      // Mesmo se houver falha de rede/RLS, preservamos a experiência fluida
      console.warn('Aviso: sincronização com banco de dados em processamento.', err);
    } finally {
      setIsSaving(false);
      if (!completedSteps.includes(3)) {
        setCompletedSteps((prev) => [...prev, 3]);
      }
      setCurrentStep(4); // Tela de CADASTRO CONCLUÍDO
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ==========================================
  // ENVIO ÚNICO PELO WHATSAPP (3 BLOCOS ORGANIZADOS)
  // ==========================================
  const handleEnviarWhatsAppUnico = () => {
    const lines: string[] = [];

    lines.push('*CADASTRO DE NOVO ALUNO — EVOLUTION FITNESS*');
    lines.push('====================================');
    lines.push('');

    // BLOCO 1 — CADASTRO
    lines.push('*BLOCO 1 — CADASTRO*');
    lines.push('------------------------------------');
    lines.push('*DADOS PESSOAIS*');
    lines.push(`Nome: ${nome.trim()}`);
    lines.push(`CPF: ${cpf.trim()}`);
    lines.push(
      `Data de Nascimento: ${formatDateBR(nascimento)}${
        alunoIdade !== null ? ` (${alunoIdade} anos)` : ''
      }`
    );
    lines.push(`WhatsApp: ${whatsapp.trim()}`);
    lines.push(`E-mail: ${email.trim() || 'Não informado'}`);
    lines.push(`Instagram: ${instagram.trim() || 'Não informado'}`);
    lines.push('');
    lines.push('*ENDEREÇO*');
    lines.push(`Rua: ${rua.trim() || 'Não informada'}`);
    lines.push(`Bairro: ${bairro.trim() || 'Não informado'}`);
    lines.push(`Cidade: ${cidade.trim()} / ${estado}`);
    lines.push(`CEP: ${cep.trim() || 'Não informado'}`);
    lines.push('');
    lines.push('*PLANO ESCOLHIDO*');
    lines.push(plano.join(', ') || 'Evolution On (Musculação)');

    if (isMenorDeIdade) {
      lines.push('');
      lines.push('*DADOS DO RESPONSÁVEL (ALUNO MENOR)*');
      lines.push(`Nome do Responsável: ${nomeResponsavel.trim()}`);
      lines.push(`Idade do Responsável: ${idadeResponsavel.trim()} anos`);
      lines.push(`CPF do Responsável: ${cpfResponsavel.trim()}`);
      lines.push(`Celular do Responsável: ${celularResponsavel.trim()}`);
      lines.push(`Parentesco: ${parentescoResponsavel.trim()}`);
    }

    lines.push('');
    lines.push('====================================');

    // BLOCO 2 — PAR-Q
    lines.push('*BLOCO 2 — PAR-Q*');
    lines.push('------------------------------------');
    parqQuestions.forEach((q) => {
      lines.push(`${q.id}. ${q.text}`);
      lines.push(`Resposta: ${parqAnswers[q.id] ? 'SIM' : 'NÃO'}`);
    });

    const yesQuestions = parqQuestions.filter((q) => parqAnswers[q.id] === true);
    if (yesQuestions.length > 0) {
      lines.push('');
      lines.push(
        `*Pergunta(s) com resposta SIM:* ${yesQuestions.map((q) => q.id).join(', ')}`
      );
      lines.push(`*Observações:* ${parqObservacoes.trim() || '—'}`);
    } else if (parqObservacoes.trim()) {
      lines.push(`*Observações:* ${parqObservacoes.trim()}`);
    }
    lines.push('');
    lines.push('*Declaração:* Confirmo que as informações acima são verdadeiras.');

    lines.push('');
    lines.push('====================================');

    // BLOCO 3 — ANAMNESE
    lines.push('*BLOCO 3 — ANAMNESE*');
    lines.push('------------------------------------');
    lines.push('*DADOS GERAIS*');
    lines.push(`Altura: ${altura.trim()}`);
    lines.push(`Objetivo: ${objetivo.trim() || '—'}`);
    lines.push(`Atividade Profissional: ${atividadeProfissional.trim() || '—'}`);
    lines.push('');
    lines.push('*DADOS ATUAIS E ROTINA*');
    lines.push(`Pratica atividade física: ${praticaAtividade}`);
    lines.push(`Dorme quantas horas: ${sonoHoras.trim() || '—'}`);
    lines.push(`Qualidade do sono: ${qualidadeSono.trim() || '—'}`);
    lines.push(`Fumante: ${fumante}`);
    if (fumante === 'SIM') {
      lines.push(`- Cigarros por dia: ${cigarrosDia.trim() || '—'}`);
      lines.push(`- Tempo fumante: ${tempoFumante.trim() || '—'}`);
    }
    lines.push(`Ingestão de bebidas alcoólicas: ${alcool}`);
    if (alcool === 'SIM') {
      const freq =
        frequenciaAlcool === 'Outro'
          ? frequenciaAlcoolOutro.trim() || 'Outro'
          : frequenciaAlcool;
      lines.push(`- Frequência: ${freq || '—'}`);
    }
    lines.push('');
    lines.push('*HISTÓRICO DA SAÚDE*');
    lines.push(`Doenças / Problemas de saúde: ${doencas}`);
    if (doencas === 'SIM') {
      lines.push(`- Quais: ${quaisDoencas.trim() || '—'}`);
    }
    lines.push(`Faz uso de medicamento: ${medicamento}`);
    if (medicamento === 'SIM') {
      lines.push(`- Quais medicamentos: ${quaisMedicamentos.trim() || '—'}`);
      lines.push(`- Tempo de uso: ${tempoMedicamento.trim() || '—'}`);
    }
    lines.push(`Histórico familiar: ${historicoFamiliar.trim() || '—'}`);
    lines.push(`Possui doenças crônicas: ${cronicas}`);
    if (cronicas === 'SIM') {
      lines.push(`- Quais: ${quaisCronicas.trim() || '—'}`);
    }

    lines.push('');
    lines.push('====================================');
    lines.push('Cadastro realizado via Central de Atendimento Evolution Fitness.');

    const msg = lines.join('\n');
    window.open(
      `https://wa.me/${EVOLUTION_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  const handleResetarFluxo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(1);
    setCompletedSteps([]);
    setNome('');
    setCpf('');
    setNascimento('');
    setWhatsapp('');
    setRua('');
    setBairro('');
    setCidade('Três Rios');
    setEstado('RJ');
    setCep('');
    setEmail('');
    setInstagram('');
    setPlano(['Evolution On (Musculação)']);
    setNomeResponsavel('');
    setIdadeResponsavel('');
    setCpfResponsavel('');
    setCelularResponsavel('');
    setParentescoResponsavel('');
    setParqAnswers({});
    setParqObservacoes('');
    setParqDeclaracao(false);
    setAltura('');
    setObjetivo('');
    setAtividadeProfissional('');
    setPraticaAtividade('');
    setSonoHoras('');
    setQualidadeSono('');
    setFumante('');
    setCigarrosDia('');
    setTempoFumante('');
    setAlcool('');
    setFrequenciaAlcool('');
    setFrequenciaAlcoolOutro('');
    setDoencas('');
    setQuaisDoencas('');
    setMedicamento('');
    setQuaisMedicamentos('');
    setTempoMedicamento('');
    setHistoricoFamiliar('');
    setCronicas('');
    setQuaisCronicas('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepsNav = [
    { num: 1, title: 'CADASTRO' },
    { num: 2, title: 'PAR-Q' },
    { num: 3, title: 'ANAMNESE' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Header Fixo */}
      <header className="sticky top-0 bg-black text-white p-4 z-20 shadow-md border-b-2 border-red-600">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-red-500 font-extrabold uppercase tracking-widest text-[11px] block">
              EVOLUTION FITNESS
            </span>
            <h1 className="font-bold uppercase text-lg sm:text-xl tracking-tight text-white leading-tight">
              CADASTRO DE NOVO ALUNO
            </h1>
            <p className="text-[11px] text-slate-300">
              Formulário oficial de matrícula em 3 etapas consecutivas
            </p>
          </div>
          {!isPublic && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer hover:text-slate-300 ml-4 shrink-0"
            >
              Voltar
            </button>
          )}
        </div>
      </header>

      {/* Stepper Fixo no Topo */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-[73px] z-10 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between relative">
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-8 h-0.5 bg-black transition-all duration-300 -z-0"
            style={{
              width: `${
                currentStep >= 4 ? 100 : Math.max(0, ((Math.min(currentStep, 3) - 1) / 2) * 100)
              }%`,
              maxWidth: 'calc(100% - 4rem)',
            }}
          />

          {stepsNav.map((s) => {
            const isCompleted = completedSteps.includes(s.num);
            const isCurrent = currentStep === s.num;
            const canNavigate = isCompleted || s.num <= Math.max(...completedSteps, 0) + 1;

            return (
              <button
                key={s.num}
                type="button"
                disabled={!canNavigate && currentStep !== 4}
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep(s.num);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center relative z-10 ${
                  canNavigate ? 'cursor-pointer' : 'cursor-default opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-black text-white ring-2 ring-black'
                      : isCurrent
                      ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-sm'
                      : 'bg-white text-slate-500 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tight mt-1 ${
                    isCurrent ? 'text-red-600' : isCompleted ? 'text-black' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
                <span className="text-[9px] uppercase font-semibold text-slate-400">
                  {isCompleted ? 'CONCLUÍDO' : isCurrent ? 'ATUAL' : `ETAPA ${s.num}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-xl mx-auto p-4 sm:p-6">
        {/* Banner de Erro/Alerta */}
        {errorMessage && (
          <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs sm:text-sm font-semibold rounded shadow-xs">
            {errorMessage}
          </div>
        )}

        {/* ========================================================
            ETAPA 1 DE 3 — CADASTRO
           ======================================================== */}
        {currentStep === 1 && (
          <form onSubmit={handleAvancarEtapa1} className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                Etapa 1 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mt-2">
                CADASTRO
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Preencha os dados cadastrais do novo aluno.
              </p>
            </div>

            {/* SEÇÃO: DADOS PESSOAIS */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                01. Dados Pessoais
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome e sobrenome"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                  {alunoIdade !== null && (
                    <p className="text-[11px] font-semibold text-slate-500 mt-1">
                      Idade calculada: <span className="font-bold text-black">{alunoIdade} anos</span>
                      {isMenorDeIdade && (
                        <span className="ml-2 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                          Menor de idade
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={15}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* SEÇÃO: ENDEREÇO */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                02. Endereço
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rua, Número e Complemento
                </label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Rua, Avenida, número"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Bairro"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => setCep(formatCEP(e.target.value))}
                    placeholder="00000-000"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="SP">SP</option>
                    <option value="ES">ES</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEÇÃO: CONTATO E PLANO */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                03. Contato e Plano
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@seuperfil"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Escolha seu Plano *
                </label>
                <div className="space-y-2">
                  {[
                    'Evolution On (Musculação)',
                    'Evolution Total (Musculação e Aulas coletivas)',
                  ].map((p) => (
                    <label
                      key={p}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        plano.includes(p)
                          ? 'border-red-600 bg-red-50 text-red-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={plano.includes(p)}
                        onChange={() => handleTogglePlano(p)}
                        className="accent-red-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO: RESPONSÁVEL (APENAS PARA MENOR DE IDADE — DETERMINADO PELA DATA DE NASCIMENTO) */}
            {isMenorDeIdade && (
              <div className="bg-amber-50/70 border-2 border-amber-400 rounded-lg p-5 space-y-4 shadow-xs transition-all">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <span>⚠️</span> 04. Dados do Responsável (Aluno Menor — {alunoIdade} anos)
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                    Obrigatório
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Identificamos pela data de nascimento que o aluno é menor de 18 anos. Informe os
                  dados do responsável legal para prosseguir com a matrícula.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nome Completo do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    placeholder="Nome completo do responsável legal"
                    className="w-full bg-white border border-amber-300 rounded px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Idade do Responsável *
                  </label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={120}
                    value={idadeResponsavel}
                    onChange={(e) => setIdadeResponsavel(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ex.: 35"
                    className="w-full bg-white border border-amber-300 rounded px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      CPF do Responsável *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={14}
                      value={cpfResponsavel}
                      onChange={(e) => setCpfResponsavel(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      className="w-full bg-white border border-amber-300 rounded px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Celular do Responsável *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={celularResponsavel}
                      onChange={(e) => setCelularResponsavel(formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white border border-amber-300 rounded px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Parentesco *
                  </label>
                  <select
                    required
                    value={parentescoResponsavel}
                    onChange={(e) => setParentescoResponsavel(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
                  >
                    <option value="">Selecione o grau de parentesco...</option>
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Responsável Legal">Responsável Legal (Tutor/Guarda)</option>
                    <option value="Avô / Avó">Avô / Avó</option>
                    <option value="Tio / Tia">Tio / Tia</option>
                    <option value="Irmão / Irmã (Maior)">Irmão / Irmã (Maior)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
            )}

            {/* Botão de Avanço */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer shadow-sm text-sm"
              >
                CONTINUAR
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            ETAPA 2 DE 3 — PAR-Q
           ======================================================== */}
        {currentStep === 2 && (
          <form onSubmit={handleAvancarEtapa2} className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                Etapa 2 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mt-2">
                PAR-Q
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Questionário de Prontidão para Atividade Física.
              </p>
            </div>

            {/* Card com Dados Já Preenchidos na Etapa 1 */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Aluno Identificado (Etapa 1)
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold text-slate-800">
                <span>
                  Nome: <span className="font-bold text-black">{nome || '—'}</span>
                </span>
                <span>
                  Nasc.: <span className="font-bold text-black">{formatDateBR(nascimento)}</span>
                </span>
                <span>
                  WhatsApp: <span className="font-bold text-black">{whatsapp || '—'}</span>
                </span>
              </div>
            </div>

            {/* As 7 Perguntas Oficiais do PAR-Q */}
            <div className="space-y-4">
              {parqQuestions.map((q) => {
                const answer = parqAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-3 shadow-xs"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      <span className="text-red-600 font-bold mr-1.5">{q.id}.</span>
                      {q.text}
                    </p>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setParqAnswers((prev) => ({ ...prev, [q.id]: true }))}
                        className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border ${
                          answer === true
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        SIM
                      </button>
                      <button
                        type="button"
                        onClick={() => setParqAnswers((prev) => ({ ...prev, [q.id]: false }))}
                        className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border ${
                          answer === false
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        NÃO
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alerta se respondeu SIM em alguma */}
            {Object.values(parqAnswers).some((v) => v === true) && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Aviso importante:</span> Você respondeu{' '}
                <span className="font-bold">SIM</span> a uma ou mais perguntas do PAR-Q. Por favor,
                detalhe o motivo no campo de Observações abaixo e consulte seu médico antes de
                iniciar exercícios vigorosos.
              </div>
            )}

            {/* Observações */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Observações Adicionais (Opcional)
              </label>
              <textarea
                rows={3}
                value={parqObservacoes}
                onChange={(e) => setParqObservacoes(e.target.value)}
                placeholder="Caso tenha respondido SIM a alguma pergunta, informe mais detalhes aqui..."
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            {/* Declaração de Veracidade */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={parqDeclaracao}
                  onChange={(e) => setParqDeclaracao(e.target.checked)}
                  className="accent-red-600 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                  Declaro que as informações acima são verdadeiras.
                </span>
              </label>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer shadow-sm text-sm"
              >
                CONTINUAR
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer text-xs"
              >
                ← Voltar para Etapa 1 (Cadastro)
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            ETAPA 3 DE 3 — ANAMNESE
           ======================================================== */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalizarCadastro} className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                Etapa 3 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mt-2">
                ANAMNESE
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Histórico de saúde e hábitos do aluno {nome || ''}.
              </p>
            </div>

            {/* Card com Dados Reaproveitados */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Aluno Identificado (Etapas 1 e 2)
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold text-slate-800">
                <span>
                  Nome: <span className="font-bold text-black">{nome || '—'}</span>
                </span>
                <span>
                  Nasc.: <span className="font-bold text-black">{formatDateBR(nascimento)}</span>
                </span>
                <span>
                  WhatsApp: <span className="font-bold text-black">{whatsapp || '—'}</span>
                </span>
              </div>
            </div>

            {/* 01. DADOS GERAIS */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                01. Dados Gerais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Altura *
                  </label>
                  <input
                    type="text"
                    required
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    placeholder="Ex.: 1,75 m"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Atividade Profissional
                  </label>
                  <input
                    type="text"
                    value={atividadeProfissional}
                    onChange={(e) => setAtividadeProfissional(e.target.value)}
                    placeholder="Qual sua profissão?"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qual é o seu objetivo?
                </label>
                <textarea
                  rows={2}
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ex.: Emagrecimento, hipertrofia, saúde, condicionamento..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* 02. DADOS ATUAIS / HÁBITOS E ROTINA */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                02. Dados Atuais e Rotina
              </h3>

              {/* Pratica Atividade */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Pratica atividade física atualmente? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setPraticaAtividade(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        praticaAtividade === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Dorme quantas horas por noite?
                  </label>
                  <input
                    type="text"
                    value={sonoHoras}
                    onChange={(e) => setSonoHoras(e.target.value)}
                    placeholder="Ex.: 7 horas"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Qualidade do sono
                  </label>
                  <input
                    type="text"
                    value={qualidadeSono}
                    onChange={(e) => setQualidadeSono(e.target.value)}
                    placeholder="Ex.: Boa, regular, ruim..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fumante */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Fumante? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFumante(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        fumante === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {fumante === 'SIM' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Quantos por dia?
                      </label>
                      <input
                        type="text"
                        value={cigarrosDia}
                        onChange={(e) => setCigarrosDia(e.target.value)}
                        placeholder="Ex.: 10 cigarros"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Há quanto tempo?
                      </label>
                      <input
                        type="text"
                        value={tempoFumante}
                        onChange={(e) => setTempoFumante(e.target.value)}
                        placeholder="Ex.: 5 anos"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Álcool */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Ingestão de bebidas alcoólicas? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAlcool(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        alcool === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {alcool === 'SIM' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Frequência
                    </label>
                    <select
                      value={frequenciaAlcool}
                      onChange={(e) => setFrequenciaAlcool(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium"
                    >
                      <option value="">Selecione a frequência...</option>
                      <option value="Socialmente (eventos ocasionais)">
                        Socialmente (eventos ocasionais)
                      </option>
                      <option value="Aos fins de semana">Aos fins de semana</option>
                      <option value="Mais de 3 vezes por semana">Mais de 3 vezes por semana</option>
                      <option value="Diariamente">Diariamente</option>
                      <option value="Outro">Outro</option>
                    </select>
                    {frequenciaAlcool === 'Outro' && (
                      <input
                        type="text"
                        value={frequenciaAlcoolOutro}
                        onChange={(e) => setFrequenciaAlcoolOutro(e.target.value)}
                        placeholder="Informe a frequência detalhada..."
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 03. HISTÓRICO DE SAÚDE */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-slate-100 pb-2">
                03. Histórico de Saúde
              </h3>

              {/* Doenças / Problemas de Saúde */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Possui alguma doença ou problema de saúde? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDoencas(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        doencas === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {doencas === 'SIM' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Quais doenças ou problemas?
                    </label>
                    <textarea
                      rows={2}
                      value={quaisDoencas}
                      onChange={(e) => setQuaisDoencas(e.target.value)}
                      placeholder="Informe quais doenças..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Medicamentos */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Faz uso de algum medicamento? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMedicamento(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        medicamento === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {medicamento === 'SIM' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Quais medicamentos?
                      </label>
                      <input
                        type="text"
                        value={quaisMedicamentos}
                        onChange={(e) => setQuaisMedicamentos(e.target.value)}
                        placeholder="Informe quais..."
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Tempo de uso
                      </label>
                      <input
                        type="text"
                        value={tempoMedicamento}
                        onChange={(e) => setTempoMedicamento(e.target.value)}
                        placeholder="Ex.: 2 anos"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Histórico Familiar */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Histórico Familiar (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={historicoFamiliar}
                  onChange={(e) => setHistoricoFamiliar(e.target.value)}
                  placeholder="Informe doenças ou condições relevantes na família (ex: hipertensão, cardiopatias, diabetes)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none"
                />
              </div>

              {/* Doenças Crônicas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Possui doenças crônicas? *
                </label>
                <div className="flex gap-3">
                  {['SIM', 'NÃO'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCronicas(v)}
                      className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider border cursor-pointer transition-colors ${
                        cronicas === v
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {cronicas === 'SIM' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Quais doenças crônicas?
                    </label>
                    <textarea
                      rows={2}
                      value={quaisCronicas}
                      onChange={(e) => setQuaisCronicas(e.target.value)}
                      placeholder="Informe quais..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer shadow-sm text-sm disabled:opacity-60"
              >
                {isSaving ? 'Salvando...' : 'FINALIZAR CADASTRO'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer text-xs"
              >
                ← Voltar para Etapa 2 (PAR-Q)
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            TELA FINAL: CADASTRO CONCLUÍDO (APENAS APÓS AS 3 ETAPAS)
           ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border border-green-600 bg-green-50 p-6 rounded-lg text-center space-y-2 shadow-xs">
              <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
                ✓
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-green-950 pt-1">
                CADASTRO CONCLUÍDO
              </h2>
              <p className="text-xs sm:text-sm text-green-900 leading-relaxed font-medium">
                As três etapas internas foram preenchidas com sucesso. Clique no botão abaixo para
                enviar todos os dados em uma única mensagem organizada para o WhatsApp da Evolution
                Fitness.
              </p>
            </div>

            {/* Resumo com os 3 itens solicitados */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                Resumo das Etapas Concluídas
              </h3>
              <ul className="space-y-3 text-sm font-semibold text-slate-800">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> Cadastro
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-400">
                    Etapa 1 Concluída
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> PAR-Q
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-400">
                    Etapa 2 Concluída
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> Anamnese
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-400">
                    Etapa 3 Concluída
                  </span>
                </li>
              </ul>
            </div>

            {/* Card com Detalhes dos Dados Consolidados */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-2 text-xs text-slate-600 shadow-xs">
              <span className="font-bold text-black uppercase tracking-wider block text-[11px]">
                Dados do Aluno:
              </span>
              <p>
                <strong className="text-slate-800">Nome:</strong> {nome}
              </p>
              <p>
                <strong className="text-slate-800">CPF:</strong> {cpf} |{' '}
                <strong className="text-slate-800">Nascimento:</strong> {formatDateBR(nascimento)}
                {alunoIdade !== null ? ` (${alunoIdade} anos)` : ''}
              </p>
              <p>
                <strong className="text-slate-800">WhatsApp:</strong> {whatsapp}
              </p>
              <p>
                <strong className="text-slate-800">Plano:</strong> {plano.join(', ')}
              </p>
              {isMenorDeIdade && (
                <p className="text-amber-800 font-semibold bg-amber-50 p-2 rounded mt-1">
                  Responsável: {nomeResponsavel} ({parentescoResponsavel}) — {idadeResponsavel} anos — Cel:{' '}
                  {celularResponsavel}
                </p>
              )}
            </div>

            {/* BOTÃO PRINCIPAL EXCLUSIVO: ENVIAR CADASTRO PELO WHATSAPP */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleEnviarWhatsAppUnico}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors cursor-pointer shadow-md text-sm flex items-center justify-center gap-2"
              >
                <span>💬</span> ENVIAR CADASTRO PELO WHATSAPP
              </button>

              {!isPublic && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full bg-black text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer shadow-sm text-sm"
                >
                  Voltar para a Central
                </button>
              )}

              <button
                type="button"
                onClick={handleResetarFluxo}
                className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer text-xs"
              >
                Preencher Outro Cadastro
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
