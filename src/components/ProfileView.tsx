export default function ProfileView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 z-10">
        <button onClick={onBack} className="text-white text-sm uppercase tracking-wider underline cursor-pointer">
          Voltar
        </button>
        <h1 className="font-bold uppercase text-xl mt-4">
          Perfil da Evolution
        </h1>
      </header>
      <main className="p-6">
        <div className="border border-black p-6 rounded-lg shadow-sm bg-white space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
              EVOLUTION FITNESS
            </h2>
            <p className="text-sm font-semibold text-red-600 mt-1 uppercase tracking-wider">
              Três Rios — RJ
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            Academia com ambiente acolhedor, acompanhamento e foco em saúde, evolução e qualidade de vida.
          </p>
        </div>

        <div className="mt-8">
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
