export default function Sidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex">
      <div className="bg-black text-white w-64 p-6 shadow-xl flex flex-col">
        <button onClick={onClose} className="text-white text-left mb-8">Fechar</button>
        <nav className="space-y-4 text-lg">
          <a href="#" className="block py-2">Perfil</a>
          <a href="#" className="block py-2">Configurações</a>
          <a href="#" className="block py-2">Sair</a>
        </nav>
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose} />
    </div>
  );
}
