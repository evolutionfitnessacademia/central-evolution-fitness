import { useState } from 'react';

export default function FeatureView({ feature, onBack }: { feature: { title: string, desc: string }, onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const isParq = feature.title === 'PAR-Q';
  const isAnamnese = feature.title === 'ANAMNESE';
  const isAvaliacaoFisica = feature.title === 'AVALIAÇÃO FÍSICA';
  const isCadastro = feature.title === 'CADASTRO';
  const isLocalizacao = feature.title === 'LOCALIZAÇÃO';
  const isEventos = feature.title === 'EVENTOS';
  const isRedesSociais = feature.title === 'REDES SOCIAIS';
  const isOutros = feature.title === 'OUTROS RECURSOS';

  const anamneseLink = 'https://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/';
  const anamneseMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha a Anamnese pelo link abaixo:

https://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/

Após preencher, envie o formulário conforme as orientações da página.`;

  const parqLink = 'https://evolutionfitnessacademia.github.io/Parq/';
  const parqMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha o PAR-Q pelo link abaixo:

https://evolutionfitnessacademia.github.io/Parq/

Após preencher, envie o formulário conforme as orientações da página.`;

  const cadastroLink = 'https://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/';
  const cadastroMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha seu cadastro pelo link abaixo:

https://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/

Após preencher, envie o formulário conforme as orientações da página.`;

  const avaliacaoFisicaMsg = `Olá! Tudo bem?

Passando para lembrar da sua avaliação física na Evolution Fitness.

Data: [DATA]
Horário: [HORÁRIO]

Por favor, confirme sua presença respondendo esta mensagem.`;

  const eventosList = [
    {
      id: 'arraia',
      name: 'ARRAIÁ DA EVOLUTION FITNESS',
      link: 'https://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/',
      shareMsg: `Olá! Tudo bem?

A Evolution Fitness está realizando o evento:

Arraiá da Evolution Fitness

Confira os detalhes e participe:

https://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/`,
    },
  ];

  const facebookLink = 'https://www.facebook.com/share/19HWTWwPLc/';
  const instagramLink = 'https://www.instagram.com/evolutionfitness_tr/';
  const tiktokLink = 'https://www.tiktok.com/@sabrinaevolution';

  const mapLink = 'https://tinyurl.com/4eubvvez';
  const address = `Evolution Fitness
Rua Dr. Valmir Peçanha, 50
Centro — Três Rios/RJ
CEP 25802-180`;
  const localizacaoMsg = `${address}

Link para localização:
${mapLink}`;

  const googleLink = 'https://g.page/r/CXwn8jQ4-Z22EBM/review';
  const googleMsg = `Olá! Tudo bem?

Sua opinião é muito importante para a Evolution Fitness.

Se você já treina com a gente, poderia deixar uma avaliação sobre sua experiência no nosso Perfil da Empresa no Google?

Sua opinião ajuda outras pessoas de Três Rios a conhecerem a Evolution Fitness.

É rápido e pode ser realizado pelo link abaixo:

https://g.page/r/CXwn8jQ4-Z22EBM/review

Muito obrigado por fazer parte da Evolution Fitness.`;

  const handleOpenForm = (link: string) => {
    window.open(link, '_blank');
  };

  const handleWhatsApp = (msg: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmail = (subject: string, msg: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEvent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEventId(id);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 z-10">
        <button onClick={onBack} className="text-white text-sm uppercase tracking-wider underline">Voltar</button>
        <h1 className="font-bold uppercase text-xl mt-4">
            {isLocalizacao ? 'LOCALIZAÇÃO DA EVOLUTION FITNESS' : isEventos ? 'EVENTOS' : feature.title}
        </h1>
      </header>
      <main className="p-6">
        <p className="text-slate-700 font-medium">
            {isLocalizacao ? 'Estamos no Centro de Três Rios.' : isEventos ? 'Confira os eventos e experiências especiais da Evolution Fitness.' : isRedesSociais ? 'Acompanhe a Evolution Fitness nas redes sociais.' : isAvaliacaoFisica ? 'Lembrete e confirmação da avaliação física.' : feature.desc}
        </p>
        
        {isLocalizacao ? (
          <div className="mt-8 space-y-3">
            <p className="text-slate-600 text-sm whitespace-pre-line">{address}</p>
            <button onClick={() => handleOpenForm(mapLink)} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors">Como Chegar</button>
            <button onClick={() => handleCopy(address)} className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors">{copied ? 'ENDEREÇO COPIADO' : 'Copiar Endereço'}</button>
            <button onClick={() => handleWhatsApp(localizacaoMsg)} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors">Compartilhar Localização</button>
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : isEventos ? (
          <div className="mt-8 space-y-6">
            {eventosList.map((evento) => (
              <div key={evento.id} className="border border-slate-200 rounded-lg p-5 space-y-3 bg-white shadow-sm">
                <h2 className="text-lg font-bold uppercase text-black tracking-tight">{evento.name}</h2>
                <button 
                  onClick={() => handleOpenForm(evento.link)} 
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors"
                >
                  Abrir Evento
                </button>
                <button 
                  onClick={() => handleWhatsApp(evento.shareMsg)} 
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors"
                >
                  Compartilhar Evento
                </button>
                <button 
                  onClick={() => handleCopyEvent(evento.id, evento.link)} 
                  className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors"
                >
                  {copiedEventId === evento.id ? 'LINK COPIADO' : 'Copiar Link'}
                </button>
              </div>
            ))}
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : isRedesSociais ? (
          <div className="mt-8 space-y-3">
            <button onClick={() => handleOpenForm(facebookLink)} className="w-full bg-[#1877F2] text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:opacity-90 transition-opacity">Facebook</button>
            <button onClick={() => handleOpenForm(instagramLink)} className="w-full bg-[#E1306C] text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:opacity-90 transition-opacity">Instagram</button>
            <button onClick={() => handleOpenForm(tiktokLink)} className="w-full bg-neutral-900 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-black transition-colors">TikTok</button>
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : isAvaliacaoFisica ? (
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => handleWhatsApp(avaliacaoFisicaMsg)} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors"
            >
              Enviar Lembrete pelo WhatsApp
            </button>
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : isAnamnese || isParq || isCadastro ? (
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => handleWhatsApp(isAnamnese ? anamneseMsg : isParq ? parqMsg : cadastroMsg)} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors"
            >
              Enviar pelo WhatsApp
            </button>
            <button 
              onClick={() => handleEmail(
                isAnamnese ? 'Anamnese — Evolution Fitness' : isParq ? 'PAR-Q — Evolution Fitness' : 'Cadastro — Evolution Fitness', 
                isAnamnese ? anamneseMsg : isParq ? parqMsg : cadastroMsg
              )} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-blue-700 transition-colors"
            >
              Enviar por E-mail
            </button>
            <button 
              onClick={() => handleCopy(isAnamnese ? anamneseLink : isParq ? parqLink : cadastroLink)} 
              className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors"
            >
              {copied ? 'LINK COPIADO' : 'Copiar Link'}
            </button>
            <button 
              onClick={() => handleOpenForm(isAnamnese ? anamneseLink : isParq ? parqLink : cadastroLink)} 
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors"
            >
              Abrir Formulário
            </button>
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : isOutros ? (
          <div className="mt-8 space-y-3">
            <h2 className="text-lg font-bold uppercase text-black">AVALIAR A EVOLUTION NO GOOGLE</h2>
            <p className="text-sm text-slate-600">Sua opinião ajuda a Evolution Fitness e outras pessoas a conhecerem nosso trabalho.</p>
            <button 
              onClick={() => handleWhatsApp(googleMsg)} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors"
            >
              Enviar pelo WhatsApp
            </button>
            <button 
              onClick={() => handleCopy(googleLink)} 
              className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors"
            >
              {copied ? 'LINK COPIADO' : 'Copiar Link'}
            </button>
            <button 
              onClick={() => handleOpenForm(googleLink)} 
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors"
            >
              Abrir Google
            </button>
            <button onClick={onBack} className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors">Voltar</button>
          </div>
        ) : (
          <div className="mt-8 p-8 border border-slate-200 rounded-lg text-slate-500 text-center">
            Conteúdo do {feature.title} será implementado nesta tela.
          </div>
        )}
      </main>
    </div>
  );
}
