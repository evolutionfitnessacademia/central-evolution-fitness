import { useState, useEffect } from 'react';
import AddResourceForm from './AddResourceForm';
import {
  getStoredResources,
  updateStoredResource,
  deleteStoredResource,
  toggleResourceStatus,
  setResourceDisplayLocation,
  reorderResources,
} from '../services/resourceStorage';
import { DisplayLocation, Resource } from '../types/resource';

type AdminSubView =
  | null
  | 'add'
  | 'edit'
  | 'delete'
  | 'toggle_status'
  | 'display_location'
  | 'reorder'
  | 'edit_links'
  | 'edit_whatsapp'
  | 'edit_email';

export default function AdminView({ onBack }: { onBack: () => void }) {
  const [activeSubView, setActiveSubView] = useState<AdminSubView>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para exclusão com confirmação
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // Estado para aba de reordenação
  const [reorderTab, setReorderTab] = useState<DisplayLocation>('HOME');

  // Estados locais para edição rápida de links, whatsapp e e-mail
  const [linksDraft, setLinksDraft] = useState<{ [id: string]: string }>({});
  const [whatsappDraft, setWhatsappDraft] = useState<{ [id: string]: string }>({});
  const [emailSubjectDraft, setEmailSubjectDraft] = useState<{ [id: string]: string }>({});
  const [emailBodyDraft, setEmailBodyDraft] = useState<{ [id: string]: string }>({});

  const reloadResources = () => {
    const list = getStoredResources();
    setResources(list);

    // Sincronizar rascunhos de edição rápida
    const links: { [id: string]: string } = {};
    const wa: { [id: string]: string } = {};
    const eSub: { [id: string]: string } = {};
    const eBody: { [id: string]: string } = {};
    list.forEach((r) => {
      links[r.id] = r.link;
      wa[r.id] = r.whatsappMessage;
      eSub[r.id] = r.emailSubject;
      eBody[r.id] = r.emailBody;
    });
    setLinksDraft(links);
    setWhatsappDraft(wa);
    setEmailSubjectDraft(eSub);
    setEmailBodyDraft(eBody);
  };

  useEffect(() => {
    reloadResources();
    const handleStorageChange = () => reloadResources();
    window.addEventListener('evolution_resources_updated', handleStorageChange);
    return () => window.removeEventListener('evolution_resources_updated', handleStorageChange);
  }, []);

  const handleResourceSaved = (saved: Resource) => {
    setEditingResource(null);
    setActiveSubView(null);
    reloadResources();
    setSuccessMessage(`Recurso "${saved.name}" salvo com sucesso!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Se estiver adicionando ou editando formulário completo
  if (activeSubView === 'add' || editingResource) {
    return (
      <AddResourceForm
        initialData={editingResource || undefined}
        onCancel={() => {
          setEditingResource(null);
          setActiveSubView(null);
        }}
        onSuccess={handleResourceSaved}
      />
    );
  }

  // 1. TELA: EDITAR RECURSOS (Seleção)
  if (activeSubView === 'edit') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Editar Recursos</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Selecione um recurso para editar
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Todos os campos (nome, categoria, descrição, link, botões, WhatsApp, e-mail e exibição) poderão ser modificados.
            </p>
          </div>

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs hover:border-slate-400 transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold uppercase text-sm text-black tracking-tight">{res.name}</h3>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        res.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{res.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Exibição: <strong className="text-slate-700">{res.displayLocation}</strong> • Categoria: {res.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingResource(res)}
                  className="bg-black text-white px-3.5 py-2 rounded-md font-bold uppercase text-xs tracking-wider hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 2. TELA: EXCLUIR RECURSOS
  if (activeSubView === 'delete') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Excluir Recursos</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-red-800">
              Exclusão Permanente
            </p>
            <p className="text-xs text-red-600 mt-1">
              Selecione o recurso que deseja remover. Uma confirmação será solicitada antes da remoção definitiva.
            </p>
          </div>

          {/* Modal de confirmação se selecionado */}
          {resourceToDelete && (
            <div className="border-2 border-red-600 bg-white p-5 rounded-lg shadow-lg space-y-3 animate-fade-in">
              <h3 className="font-bold uppercase text-base text-red-600">
                Confirmar Exclusão
              </h3>
              <p className="text-sm text-slate-700">
                Tem certeza que deseja excluir o recurso <strong>"{resourceToDelete.name}"</strong>?
              </p>
              <p className="text-xs text-slate-500">
                Esta ação é irreversível e removerá o item imediatamente da Central de Atendimento.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const deletedName = resourceToDelete.name;
                    deleteStoredResource(resourceToDelete.id);
                    setResourceToDelete(null);
                    reloadResources();
                    setSuccessMessage(`Recurso "${deletedName}" excluído com sucesso!`);
                  }}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded font-bold uppercase text-xs tracking-wider hover:bg-red-700 cursor-pointer"
                >
                  Sim, Excluir Definitivamente
                </button>
                <button
                  type="button"
                  onClick={() => setResourceToDelete(null)}
                  className="flex-1 bg-slate-200 text-slate-800 py-2.5 rounded font-bold uppercase text-xs tracking-wider hover:bg-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{res.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Exibição: {res.displayLocation} • Status: {res.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setResourceToDelete(res)}
                  className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded font-bold uppercase text-xs tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 3. TELA: ATIVAR / DESATIVAR RECURSOS
  if (activeSubView === 'toggle_status') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Ativar / Desativar Recursos</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Controle de Visibilidade
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Recursos <strong>ATIVOS</strong> aparecem para os alunos na Central. Recursos <strong>INATIVOS</strong> ficam ocultados na Home e em Outros Recursos, mas continuam preservados no ADM.
            </p>
          </div>

          <div className="space-y-3">
            {resources.map((res) => {
              const isActive = res.status === 'ATIVO';
              return (
                <div
                  key={res.id}
                  className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = toggleResourceStatus(res.id);
                      reloadResources();
                      if (updated) {
                        setSuccessMessage(
                          `Recurso "${updated.name}" agora está ${updated.status}!`
                        );
                      }
                    }}
                    className={`px-4 py-2 rounded-md font-bold uppercase text-xs tracking-wider transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                    }`}
                  >
                    {isActive ? '✓ ATIVO' : '✕ INATIVO'}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 4. TELA: DEFINIR EXIBIÇÃO (HOME vs OUTROS RECURSOS)
  if (activeSubView === 'display_location') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Definir Exibição</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Local de Exibição
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Escolha se o card será exibido diretamente na tela principal (<strong>HOME</strong>) ou agrupado na seção <strong>OUTROS RECURSOS</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => {
                      setResourceDisplayLocation(res.id, 'HOME');
                      reloadResources();
                      setSuccessMessage(`Recurso "${res.name}" movido para a HOME!`);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      res.displayLocation === 'HOME'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    HOME
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResourceDisplayLocation(res.id, 'OUTROS RECURSOS');
                      reloadResources();
                      setSuccessMessage(`Recurso "${res.name}" movido para OUTROS RECURSOS!`);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      res.displayLocation === 'OUTROS RECURSOS'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    OUTROS RECURSOS
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 5. TELA: ALTERAR ORDEM DOS RECURSOS
  if (activeSubView === 'reorder') {
    const tabResources = resources.filter((r) => r.displayLocation === reorderTab);

    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Alterar Ordem dos Recursos</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Ordem de Exibição
            </p>
            <p className="text-xs text-slate-500 mt-1">
              A ordem dos itens é gerenciada de forma independente entre <strong>HOME</strong> e <strong>OUTROS RECURSOS</strong>. Use as setas para mover os itens para cima ou para baixo.
            </p>
          </div>

          {/* Abas independentes */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setReorderTab('HOME')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                reorderTab === 'HOME'
                  ? 'border-black text-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              HOME ({resources.filter((r) => r.displayLocation === 'HOME').length})
            </button>
            <button
              type="button"
              onClick={() => setReorderTab('OUTROS RECURSOS')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                reorderTab === 'OUTROS RECURSOS'
                  ? 'border-black text-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              OUTROS RECURSOS ({resources.filter((r) => r.displayLocation === 'OUTROS RECURSOS').length})
            </button>
          </div>

          <div className="space-y-2">
            {tabResources.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                Nenhum recurso configurado nesta seção.
              </p>
            ) : (
              tabResources.map((res, index) => (
                <div
                  key={res.id}
                  className="border border-slate-200 rounded-lg p-3 bg-white shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold uppercase text-xs sm:text-sm text-black">
                        {res.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{res.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        reorderResources(reorderTab, index, index - 1);
                        reloadResources();
                      }}
                      className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === tabResources.length - 1}
                      onClick={() => {
                        reorderResources(reorderTab, index, index + 1);
                        reloadResources();
                      }}
                      className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 6. TELA: EDITAR LINKS
  if (activeSubView === 'edit_links') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Editar Links</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Links de Formulários & URLs Externas
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Atualize as URLs de destino de cada recurso. A Central passará a utilizar o novo link imediatamente.
            </p>
          </div>

          <div className="space-y-4">
            {resources.map((res) => {
              const currentVal = linksDraft[res.id] !== undefined ? linksDraft[res.id] : res.link;
              const hasChanged = currentVal !== res.link;

              return (
                <div key={res.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{res.category}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      URL de Destino
                    </label>
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) =>
                        setLinksDraft((prev) => ({ ...prev, [res.id]: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {hasChanged ? 'Alteração pendente de salvamento' : 'Salvo no sistema'}
                    </span>
                    <button
                      type="button"
                      disabled={!hasChanged}
                      onClick={() => {
                        updateStoredResource(res.id, { link: currentVal.trim() });
                        reloadResources();
                        setSuccessMessage(`Link de "${res.name}" atualizado com sucesso!`);
                      }}
                      className="bg-black text-white px-3 py-1.5 rounded font-bold uppercase text-xs tracking-wider hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Salvar Link
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 7. TELA: EDITAR MENSAGENS DE WHATSAPP
  if (activeSubView === 'edit_whatsapp') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Editar Mensagens de WhatsApp</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Templates de Mensagem para WhatsApp
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Personalize o texto completo enviado quando o usuário clica no botão de compartilhar via WhatsApp. Múltiplas linhas são preservadas.
            </p>
          </div>

          <div className="space-y-4">
            {resources.map((res) => {
              const currentVal = whatsappDraft[res.id] !== undefined ? whatsappDraft[res.id] : res.whatsappMessage;
              const hasChanged = currentVal !== res.whatsappMessage;

              return (
                <div key={res.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{res.displayLocation}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Mensagem de Envio
                    </label>
                    <textarea
                      rows={5}
                      value={currentVal}
                      onChange={(e) =>
                        setWhatsappDraft((prev) => ({ ...prev, [res.id]: e.target.value }))
                      }
                      placeholder="Digite o modelo de mensagem..."
                      className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-sans focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {hasChanged ? 'Alteração pendente de salvamento' : 'Salvo'}
                    </span>
                    <button
                      type="button"
                      disabled={!hasChanged}
                      onClick={() => {
                        updateStoredResource(res.id, { whatsappMessage: currentVal.trim() });
                        reloadResources();
                        setSuccessMessage(`Mensagem de WhatsApp de "${res.name}" atualizada com sucesso!`);
                      }}
                      className="bg-green-600 text-white px-3.5 py-1.5 rounded font-bold uppercase text-xs tracking-wider hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Salvar Mensagem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // 8. TELA: EDITAR MENSAGENS DE E-MAIL
  if (activeSubView === 'edit_email') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
          <div>
            <button
              onClick={() => setActiveSubView(null)}
              className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
            >
              ← Voltar ao ADM
            </button>
            <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">Editar Mensagens de E-mail</h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
            ADM
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-800">
              Templates de Envio por E-mail
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Personalize o assunto e o corpo do e-mail disparado pelo botão "Enviar por E-mail".
            </p>
          </div>

          <div className="space-y-4">
            {resources.map((res) => {
              const currentSubject =
                emailSubjectDraft[res.id] !== undefined ? emailSubjectDraft[res.id] : res.emailSubject;
              const currentBody =
                emailBodyDraft[res.id] !== undefined ? emailBodyDraft[res.id] : res.emailBody;
              const hasChanged = currentSubject !== res.emailSubject || currentBody !== res.emailBody;

              return (
                <div key={res.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold uppercase text-sm text-black">{res.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{res.displayLocation}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Assunto do E-mail
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) =>
                        setEmailSubjectDraft((prev) => ({ ...prev, [res.id]: e.target.value }))
                      }
                      placeholder="Assunto do e-mail..."
                      className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-sans focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Corpo da Mensagem
                    </label>
                    <textarea
                      rows={5}
                      value={currentBody}
                      onChange={(e) =>
                        setEmailBodyDraft((prev) => ({ ...prev, [res.id]: e.target.value }))
                      }
                      placeholder="Corpo do e-mail..."
                      className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-sans focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {hasChanged ? 'Alteração pendente de salvamento' : 'Salvo'}
                    </span>
                    <button
                      type="button"
                      disabled={!hasChanged}
                      onClick={() => {
                        updateStoredResource(res.id, {
                          emailSubject: currentSubject.trim(),
                          emailBody: currentBody.trim(),
                        });
                        reloadResources();
                        setSuccessMessage(`E-mail de "${res.name}" atualizado com sucesso!`);
                      }}
                      className="bg-blue-600 text-white px-3.5 py-1.5 rounded font-bold uppercase text-xs tracking-wider hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Salvar E-mail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveSubView(null)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-200 transition-colors cursor-pointer mt-6"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  // TELA PRINCIPAL DO ADM
  const managementModules: { name: string; desc: string; view: AdminSubView }[] = [
    { name: 'Editar recursos', desc: 'Modificar títulos, descrições e propriedades', view: 'edit' },
    { name: 'Excluir recursos', desc: 'Remover itens obsoletos da plataforma', view: 'delete' },
    { name: 'Ativar / desativar recursos', desc: 'Habilitar ou ocultar recursos temporariamente', view: 'toggle_status' },
    { name: 'Definir exibição', desc: 'Definir se aparecem na Home ou em Outros Recursos', view: 'display_location' },
    { name: 'Alterar ordem dos recursos', desc: 'Reorganizar a sequência de exibição dos cards', view: 'reorder' },
  ];

  const commModules: { name: string; desc: string; view: AdminSubView }[] = [
    { name: 'Editar links', desc: 'Atualizar URLs de formulários e páginas externas', view: 'edit_links' },
    { name: 'Editar mensagens de WhatsApp', desc: 'Personalizar modelos de textos compartilhados', view: 'edit_whatsapp' },
    { name: 'Editar mensagens de e-mail', desc: 'Customizar templates de envio de e-mail', view: 'edit_email' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 z-10">
        <button onClick={onBack} className="text-white text-sm uppercase tracking-wider underline cursor-pointer">
          Voltar
        </button>
        <h1 className="font-bold uppercase text-xl mt-4">
          ADM — Central de Atendimento
        </h1>
      </header>

      <main className="p-6 space-y-6">
        {successMessage && (
          <div className="border border-green-600 bg-green-50 p-4 rounded-lg flex items-start justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-900">
                  Sucesso
                </p>
                <p className="text-sm text-green-800 font-medium">
                  {successMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-green-700 hover:text-green-950 font-bold uppercase cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        <div className="border border-red-600/30 bg-red-50/50 p-4 rounded-lg">
          <p className="text-xs uppercase font-bold tracking-wider text-red-600 mb-1">
            Área Administrativa
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            Painel de controle e gestão da Central de Atendimento Evolution Fitness. Todas as funções estão operacionais e sincronizadas com a Central.
          </p>
        </div>

        {/* Gerenciamento de Recursos */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Gestão de Recursos
          </h2>

          {/* Botão Adicionar Recursos */}
          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setActiveSubView('add');
            }}
            className="w-full text-left border-2 border-black rounded-lg p-4 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
                    Adicionar recursos
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                    Disponível
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Criar novos itens e formulários com validação e persistência na Central.
                </p>
              </div>
              <span className="text-xl text-black group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>

          {/* Módulos de Gestão Funcionais */}
          <div className="grid gap-2.5 pt-1">
            {managementModules.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setActiveSubView(item.view);
                }}
                className="w-full text-left border border-slate-200 rounded-lg p-3.5 bg-white hover:border-black hover:shadow-xs transition-all flex items-start justify-between cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Ativo
                  </span>
                  <span className="text-base text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Lista de Recursos Cadastrados no Storage */}
          {resources.length > 0 && (
            <div className="mt-6 pt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recursos na Central ({resources.length})
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  Salvos no Dispositivo
                </span>
              </div>
              <div className="space-y-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="border border-slate-200 rounded-lg p-3.5 bg-white hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-black uppercase tracking-tight">
                            {res.name}
                          </h4>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                              res.status === 'ATIVO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {res.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingResource(res)}
                          className="text-[11px] bg-black text-white px-2.5 py-1 rounded font-bold uppercase hover:bg-slate-800 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleResourceStatus(res.id);
                            reloadResources();
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded font-bold uppercase cursor-pointer ${
                            res.status === 'ATIVO'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {res.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {res.category}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        Exibição: {res.displayLocation}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 truncate max-w-[150px]">
                        Botão: {res.buttonText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comunicação e Mensagens */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Links & Comunicação
          </h2>
          <div className="grid gap-2.5">
            {commModules.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setActiveSubView(item.view);
                }}
                className="w-full text-left border border-slate-200 rounded-lg p-3.5 bg-white hover:border-black hover:shadow-xs transition-all flex items-start justify-between cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Ativo
                  </span>
                  <span className="text-base text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 pb-6">
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
