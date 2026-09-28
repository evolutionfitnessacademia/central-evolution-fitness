export default function SettingsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 z-10">
        <button onClick={onBack} className="text-white text-sm uppercase tracking-wider underline cursor-pointer">
          Voltar
        </button>
        <h1 className="font-bold uppercase text-xl mt-4">
          Configurações
        </h1>
      </header>
      <main className="p-6 space-y-6">
        <p className="text-slate-700 font-medium">
          Ajustes e preferências da Central de Atendimento.
        </p>

        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ajustes do Sistema
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            As configurações administrativas serão implementadas posteriormente nesta área.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onBack}
            className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
}
