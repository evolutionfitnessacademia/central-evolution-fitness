import { useState } from 'react';
import Sidebar from './Sidebar';
import FeatureView from './FeatureView';

const cards = [
  { title: 'PAR-Q', desc: 'Questionário de prontidão para atividade física' },
  { title: 'ANAMNESE', desc: 'Histórico e informações do aluno' },
  { title: 'AVALIAÇÃO FÍSICA', desc: 'Avaliação física do aluno' },
  { title: 'CADASTRO', desc: 'Cadastro do aluno' },
  { title: 'LOCALIZAÇÃO', desc: 'Encontre a Evolution Fitness. Centro — Três Rios/RJ' },
  { title: 'EVENTOS', desc: 'Eventos e experiências da Evolution Fitness' },
  { title: 'REDES SOCIAIS', desc: 'Acompanhe a Evolution Fitness' },
  { title: 'OUTROS RECURSOS', desc: 'Outros recursos da Evolution Fitness' },
];

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<{ title: string, desc: string } | null>(null);

  if (activeFeature) {
    return <FeatureView feature={activeFeature} onBack={() => setActiveFeature(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 flex justify-between items-center z-10">
        <div>
          <h1 className="font-bold uppercase tracking-tight">EVOLUTION FITNESS</h1>
          <p className="text-xs opacity-70">CENTRAL DE ATENDIMENTO</p>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <span className="sr-only">Menu</span>
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        {cards.map((card, i) => (
          <button key={i} onClick={() => setActiveFeature(card)} className="w-full text-left border border-black p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-bold uppercase">{card.title}</h2>
            <p className="text-sm mt-1 text-slate-600">{card.desc}</p>
          </button>
        ))}
      </main>
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
