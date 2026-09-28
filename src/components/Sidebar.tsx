interface SidebarProps {
  onClose: () => void;
  onNavigate: (view: 'perfil' | 'configuracoes' | 'adm') => void;
}

export default function Sidebar({ onClose, onNavigate }: SidebarProps) {
  return (
    <div className="fixed inset-0 z-20 flex">
      <div className="bg-black text-white w-64 p-6 shadow-xl flex flex-col">
        <button onClick={onClose} className="text-white text-left mb-8 cursor-pointer">
          Fechar
        </button>
        <nav className="space-y-4 text-lg">
          <button
            onClick={() => {
              onNavigate('perfil');
              onClose();
            }}
            className="w-full text-left block py-2 cursor-pointer hover:text-red-500 transition-colors"
          >
            Perfil da Evolution
          </button>
          <button
            onClick={() => {
              onNavigate('configuracoes');
              onClose();
            }}
            className="w-full text-left block py-2 cursor-pointer hover:text-red-500 transition-colors"
          >
            Configurações
          </button>
          <button
            onClick={() => {
              onNavigate('adm');
              onClose();
            }}
            className="w-full text-left block py-2 cursor-pointer hover:text-red-500 transition-colors"
          >
            ADM
          </button>
        </nav>
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose} />
    </div>
  );
}
