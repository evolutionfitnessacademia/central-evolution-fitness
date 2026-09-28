import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import FeatureView from './FeatureView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import AdminView from './AdminView';
import { getStoredResources } from '../services/resourceStorage';
import { Resource } from '../types/resource';

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>(() => getStoredResources());
  const [activeFeature, setActiveFeature] = useState<{
    feature: { title: string; desc: string };
    resource?: Resource;
    outrosResources?: Resource[];
  } | null>(null);
  const [activeMenuView, setActiveMenuView] = useState<'perfil' | 'configuracoes' | 'adm' | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setResources(getStoredResources());
    };
    handleUpdate();
    window.addEventListener('evolution_resources_updated', handleUpdate);
    return () => window.removeEventListener('evolution_resources_updated', handleUpdate);
  }, []);

  if (activeMenuView === 'perfil') {
    return <ProfileView onBack={() => setActiveMenuView(null)} />;
  }

  if (activeMenuView === 'configuracoes') {
    return <SettingsView onBack={() => setActiveMenuView(null)} />;
  }

  if (activeMenuView === 'adm') {
    return <AdminView onBack={() => setActiveMenuView(null)} />;
  }

  if (activeFeature) {
    return (
      <FeatureView
        feature={activeFeature.feature}
        resource={activeFeature.resource}
        outrosResources={activeFeature.outrosResources}
        onBack={() => setActiveFeature(null)}
      />
    );
  }

  // Filtrar apenas recursos ATIVOS para exibição ao usuário final
  const activeHomeResources = resources.filter(
    (r) => r.displayLocation === 'HOME' && r.status === 'ATIVO'
  );
  const activeOutrosResources = resources.filter(
    (r) => r.displayLocation === 'OUTROS RECURSOS' && r.status === 'ATIVO'
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 flex justify-between items-center z-10">
        <div>
          <h1 className="font-bold uppercase tracking-tight">EVOLUTION FITNESS</h1>
          <p className="text-xs opacity-70">CENTRAL DE ATENDIMENTO</p>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 cursor-pointer">
          <span className="sr-only">Menu</span>
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white" />
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* Cards da HOME */}
        {activeHomeResources.map((res) => (
          <button
            key={res.id}
            onClick={() =>
              setActiveFeature({
                feature: { title: res.name, desc: res.description },
                resource: res,
              })
            }
            className="w-full text-left border border-black p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold uppercase">{res.name}</h2>
            <p className="text-sm mt-1 text-slate-600">{res.description}</p>
          </button>
        ))}

        {/* Card OUTROS RECURSOS se houver itens ativos agrupados nesta seção */}
        {activeOutrosResources.length > 0 && (
          <button
            onClick={() =>
              setActiveFeature({
                feature: {
                  title: 'OUTROS RECURSOS',
                  desc: 'Outros recursos da Evolution Fitness',
                },
                outrosResources: activeOutrosResources,
              })
            }
            className="w-full text-left border border-black p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold uppercase">OUTROS RECURSOS</h2>
            <p className="text-sm mt-1 text-slate-600">Outros recursos da Evolution Fitness</p>
          </button>
        )}
      </main>

      {isSidebarOpen && (
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={(view) => setActiveMenuView(view)}
        />
      )}
    </div>
  );
}
