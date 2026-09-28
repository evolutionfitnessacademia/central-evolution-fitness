import { useState } from 'react';
import { getPublicCadastroUrl } from '../utils/publicUrl';
import { Resource } from '../types/resource';

interface FeatureViewProps {
  feature: { title: string; desc: string };
  resource?: Resource;
  outrosResources?: Resource[];
  onBack: () => void;
}

export default function FeatureView({
  feature,
  resource,
  outrosResources = [],
  onBack,
}: FeatureViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const titleUpper = (resource?.name || feature.title).toUpperCase();
  const isNovoAluno = titleUpper.includes('NOVO ALUNO') || resource?.id === 'cad_novo_aluno';
  const isParq = titleUpper === 'PAR-Q' || resource?.id === 'par_q';
  const isAnamnese = titleUpper === 'ANAMNESE' || resource?.id === 'anamnese';
  const isAvaliacaoFisica =
    titleUpper === 'AVALIAÇÃO FÍSICA' || titleUpper.includes('AVALIAÇÃO') || resource?.id === 'avaliacao_fisica';
  const isCadastro = titleUpper === 'CADASTRO' || resource?.id === 'cadastro';
  const isLocalizacao = titleUpper.includes('LOCALIZAÇÃO') || resource?.id === 'localizacao';
  const isEventos = titleUpper.includes('EVENTOS') || resource?.id === 'eventos';
  const isRedesSociais = titleUpper.includes('REDES SOCIAIS') || resource?.id === 'redes_sociais';
  const isOutros = titleUpper.includes('OUTROS RECURSOS');

  // Valores padrão oficiais
  const defaultNovoAlunoLink = getPublicCadastroUrl();
  const defaultNovoAlunoMsg = `Olá! Tudo bem?
Para iniciarmos sua matrícula na Evolution Fitness, pedimos que você preencha seu Cadastro de Novo Aluno pelo link abaixo:

${defaultNovoAlunoLink}

O formulário é rápido e inclui o Cadastro, PAR-Q e Anamnese em um único fluxo. Após preencher, envie pelo WhatsApp conforme as orientações da página.`;

  const defaultAnamneseLink = 'https://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/';
  const defaultAnamneseMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha a Anamnese pelo link abaixo:

https://evolutionfitnessacademia.github.io/Avalia-o-fisica-Anamnese/

Após preencher, envie o formulário conforme as orientações da página.`;

  const defaultParqLink = 'https://evolutionfitnessacademia.github.io/Parq/';
  const defaultParqMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha o PAR-Q pelo link abaixo:

https://evolutionfitnessacademia.github.io/Parq/

Após preencher, envie o formulário conforme as orientações da página.`;

  const defaultCadastroLink = 'https://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/';
  const defaultCadastroMsg = `Olá! Tudo bem?
Para iniciarmos seu atendimento na Evolution Fitness, pedimos que você preencha seu cadastro pelo link abaixo:

https://evolutionfitness-tr.github.io/Cadastro-Evolution-Fitness-/

Após preencher, envie o formulário conforme as orientações da página.`;

  const defaultAvaliacaoFisicaMsg = `Olá! Tudo bem?

Passando para lembrar da sua avaliação física na Evolution Fitness.

Data: [DATA]
Horário: [HORÁRIO]

Por favor, confirme sua presença respondendo esta mensagem.`;

  const eventosList = [
    {
      id: 'arraia',
      name: 'ARRAIÁ DA EVOLUTION FITNESS',
      link: resource?.link || 'https://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/',
      shareMsg:
        resource?.whatsappMessage ||
        `Olá! Tudo bem?\n\nA Evolution Fitness está realizando o evento:\n\nArraiá da Evolution Fitness\n\nConfira os detalhes e participe:\n\nhttps://evolutionfitness-tr.github.io/Eventos-Evolution-Fitness-/`,
    },
  ];

  const facebookLink = 'https://www.facebook.com/share/19HWTWwPLc/';
  const instagramLink = resource?.link || 'https://www.instagram.com/evolutionfitness_tr/';
  const tiktokLink = 'https://www.tiktok.com/@sabrinaevolution';

  const mapLink = resource?.link || 'https://tinyurl.com/4eubvvez';
  const address = `Evolution Fitness
Rua Dr. Valmir Peçanha, 50
Centro — Três Rios/RJ
CEP 25802-180`;
  const defaultLocalizacaoMsg = `${address}

Link para localização:
${mapLink}`;

  // Resolução dinâmica com base no armazenamento do ADM
  const effectiveLink =
    resource?.link ||
    (isNovoAluno
      ? defaultNovoAlunoLink
      : isAnamnese
      ? defaultAnamneseLink
      : isParq
      ? defaultParqLink
      : isCadastro
      ? defaultCadastroLink
      : isLocalizacao
      ? mapLink
      : '');

  const effectiveWhatsappMsg =
    resource?.whatsappMessage ||
    (isNovoAluno
      ? defaultNovoAlunoMsg
      : isAnamnese
      ? defaultAnamneseMsg
      : isParq
      ? defaultParqMsg
      : isCadastro
      ? defaultCadastroMsg
      : isAvaliacaoFisica
      ? defaultAvaliacaoFisicaMsg
      : isLocalizacao
      ? defaultLocalizacaoMsg
      : '');

  const effectiveEmailSubject =
    resource?.emailSubject ||
    (isNovoAluno
      ? 'Cadastro de Novo Aluno — Evolution Fitness'
      : isAnamnese
      ? 'Anamnese — Evolution Fitness'
      : isParq
      ? 'PAR-Q — Evolution Fitness'
      : isCadastro
      ? 'Cadastro — Evolution Fitness'
      : `${resource?.name || feature.title} — Evolution Fitness`);

  const effectiveEmailBody = resource?.emailBody || effectiveWhatsappMsg;

  const effectiveButtonText =
    resource?.buttonText ||
    (isNovoAluno || isAnamnese || isParq || isCadastro
      ? 'ABRIR FORMULÁRIO'
      : isLocalizacao
      ? 'COMO CHEGAR'
      : 'ABRIR');

  const handleOpenForm = (url: string) => {
    window.open(url, '_blank');
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
        <button
          onClick={onBack}
          className="text-white text-sm uppercase tracking-wider underline cursor-pointer"
        >
          Voltar
        </button>
        <h1 className="font-bold uppercase text-xl mt-4">
          {isLocalizacao
            ? 'LOCALIZAÇÃO DA EVOLUTION FITNESS'
            : isEventos
            ? 'EVENTOS'
            : resource?.name || feature.title}
        </h1>
      </header>

      <main className="p-6">
        <p className="text-slate-700 font-medium">
          {isLocalizacao
            ? 'Estamos no Centro de Três Rios.'
            : isEventos
            ? 'Confira os eventos e experiências especiais da Evolution Fitness.'
            : isRedesSociais
            ? 'Acompanhe a Evolution Fitness nas redes sociais.'
            : isAvaliacaoFisica
            ? 'Lembrete e confirmação da avaliação física.'
            : resource?.description || feature.desc}
        </p>

        {/* LOCALIZAÇÃO */}
        {isLocalizacao ? (
          <div className="mt-8 space-y-3">
            <p className="text-slate-600 text-sm whitespace-pre-line">{address}</p>
            <button
              onClick={() => handleOpenForm(effectiveLink)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer"
            >
              {effectiveButtonText}
            </button>
            <button
              onClick={() => handleCopy(address)}
              className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer"
            >
              {copied ? 'ENDEREÇO COPIADO' : 'Copiar Endereço'}
            </button>
            <button
              onClick={() => handleWhatsApp(effectiveWhatsappMsg)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors cursor-pointer"
            >
              Compartilhar Localização
            </button>
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Voltar
            </button>
          </div>
        ) : isEventos ? (
          /* EVENTOS */
          <div className="mt-8 space-y-6">
            {eventosList.map((evento) => (
              <div
                key={evento.id}
                className="border border-slate-200 rounded-lg p-5 space-y-3 bg-white shadow-sm"
              >
                <h2 className="text-lg font-bold uppercase text-black tracking-tight">
                  {evento.name}
                </h2>
                <button
                  onClick={() => handleOpenForm(evento.link)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer"
                >
                  {effectiveButtonText}
                </button>
                <button
                  onClick={() => handleWhatsApp(evento.shareMsg)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Compartilhar Evento
                </button>
                <button
                  onClick={() => handleCopyEvent(evento.id, evento.link)}
                  className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  {copiedEventId === evento.id ? 'LINK COPIADO' : 'Copiar Link'}
                </button>
              </div>
            ))}
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Voltar
            </button>
          </div>
        ) : isRedesSociais ? (
          /* REDES SOCIAIS */
          <div className="mt-8 space-y-3">
            <button
              onClick={() => handleOpenForm(facebookLink)}
              className="w-full bg-[#1877F2] text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
            >
              Facebook
            </button>
            <button
              onClick={() => handleOpenForm(instagramLink)}
              className="w-full bg-[#E1306C] text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
            >
              Instagram
            </button>
            <button
              onClick={() => handleOpenForm(tiktokLink)}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-black transition-colors cursor-pointer"
            >
              TikTok
            </button>
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Voltar
            </button>
          </div>
        ) : isAvaliacaoFisica ? (
          /* AVALIAÇÃO FÍSICA */
          <div className="mt-8 space-y-3">
            <button
              onClick={() => handleWhatsApp(effectiveWhatsappMsg)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors cursor-pointer"
            >
              Enviar Lembrete pelo WhatsApp
            </button>
            {effectiveEmailBody && (
              <button
                onClick={() => handleEmail(effectiveEmailSubject, effectiveEmailBody)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Enviar Lembrete por E-mail
              </button>
            )}
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Voltar
            </button>
          </div>
        ) : isOutros ? (
          /* OUTROS RECURSOS: DINÂMICO */
          <div className="mt-8 space-y-6">
            {outrosResources.length === 0 ? (
              <div className="border border-slate-200 rounded-lg p-6 text-center text-slate-500">
                Nenhum recurso configurado em Outros Recursos no momento.
              </div>
            ) : (
              outrosResources.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-lg p-5 space-y-3 bg-white shadow-sm"
                >
                  <h2 className="text-lg font-bold uppercase text-black tracking-tight">
                    {item.name}
                  </h2>
                  <p className="text-sm text-slate-600">{item.description}</p>

                  {item.link && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-600 break-all select-all">
                      {item.link}
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    {item.link && (
                      <button
                        onClick={() => handleOpenForm(item.link)}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors cursor-pointer text-sm"
                      >
                        {item.buttonText || 'Abrir'}
                      </button>
                    )}
                    {item.link && (
                      <button
                        onClick={() => handleCopyEvent(item.id, item.link)}
                        className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors cursor-pointer text-sm"
                      >
                        {copiedEventId === item.id ? 'LINK COPIADO' : 'Copiar Link'}
                      </button>
                    )}
                    {item.whatsappMessage && (
                      <button
                        onClick={() => handleWhatsApp(item.whatsappMessage)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors cursor-pointer text-sm"
                      >
                        Enviar pelo WhatsApp
                      </button>
                    )}
                    {(item.emailSubject || item.emailBody) && (
                      <button
                        onClick={() =>
                          handleEmail(
                            item.emailSubject || `${item.name} — Evolution Fitness`,
                            item.emailBody || item.whatsappMessage
                          )
                        }
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                      >
                        Enviar por E-mail
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer text-sm"
            >
              Voltar
            </button>
          </div>
        ) : (
          /* FORMULÁRIOS E RECURSOS GERAIS (PAR-Q, Anamnese, Cadastro, Novos Recursos) */
          <div className="mt-8 space-y-3">
            {/* Exibição do Link Público */}
            {effectiveLink && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 break-all select-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-sans mb-1">
                  {isNovoAluno
                    ? 'Link Público do Cadastro de Novo Aluno'
                    : 'Link Público do Formulário'}
                </span>
                {effectiveLink}
              </div>
            )}

            {effectiveLink && (
              <button
                onClick={() => handleCopy(effectiveLink)}
                className="w-full bg-slate-200 text-slate-800 py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>📋</span>{' '}
                {copied
                  ? 'LINK COPIADO COM SUCESSO!'
                  : isNovoAluno
                  ? 'Copiar Link Público do Cadastro'
                  : 'Copiar Link'}
              </button>
            )}

            {effectiveWhatsappMsg && (
              <button
                onClick={() => handleWhatsApp(effectiveWhatsappMsg)}
                className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>💬</span> Enviar pelo WhatsApp
              </button>
            )}

            {(effectiveEmailSubject || effectiveEmailBody) && (
              <button
                onClick={() => handleEmail(effectiveEmailSubject, effectiveEmailBody)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>✉️</span> Enviar por E-mail
              </button>
            )}

            {effectiveLink && (
              <button
                onClick={() => handleOpenForm(effectiveLink)}
                className="w-full bg-red-600 text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>🔗</span> {effectiveButtonText}
              </button>
            )}

            <button
              onClick={onBack}
              className="w-full bg-black text-white py-3.5 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer text-sm"
            >
              Voltar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
