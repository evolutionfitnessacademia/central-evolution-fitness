import { useState } from 'react';
import { DisplayLocation, Resource, ResourceStatus } from '../types/resource';
import { saveStoredResource, updateStoredResource } from '../services/resourceStorage';

interface AddResourceFormProps {
  onCancel: () => void;
  onSuccess: (savedResource: Resource) => void;
  initialData?: Resource;
}

const DEFAULT_CATEGORIES = [
  'Formulários',
  'Atendimento',
  'Avaliações',
  'Eventos',
  'Planos & Matrículas',
  'Outro',
];

export default function AddResourceForm({ onCancel, onSuccess, initialData }: AddResourceFormProps) {
  const isEditing = Boolean(initialData);

  const initialCatIsStandard = initialData ? DEFAULT_CATEGORIES.includes(initialData.category) : true;
  const [name, setName] = useState(initialData?.name || '');
  const [categoryType, setCategoryType] = useState(
    initialData ? (initialCatIsStandard ? initialData.category : 'Outro') : 'Formulários'
  );
  const [customCategory, setCustomCategory] = useState(
    initialData && !initialCatIsStandard ? initialData.category : ''
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [buttonText, setButtonText] = useState(initialData?.buttonText || 'ABRIR FORMULÁRIO');
  const [whatsappMessage, setWhatsappMessage] = useState(initialData?.whatsappMessage || '');
  const [emailSubject, setEmailSubject] = useState(initialData?.emailSubject || '');
  const [emailBody, setEmailBody] = useState(initialData?.emailBody || '');
  const [displayLocation, setDisplayLocation] = useState<DisplayLocation>(
    initialData?.displayLocation || 'HOME'
  );
  const [status, setStatus] = useState<ResourceStatus>(initialData?.status || 'ATIVO');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome do recurso é obrigatório.';
    }

    const effectiveCategory = categoryType === 'Outro' ? customCategory.trim() : categoryType.trim();
    if (!effectiveCategory) {
      newErrors.category = 'Selecione ou informe uma categoria válida.';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição do recurso é obrigatória.';
    }

    if (!link.trim()) {
      newErrors.link = 'O link externo é obrigatório.';
    } else {
      const trimmedLink = link.trim();
      if (!/^https?:\/\//i.test(trimmedLink) && !/^mailto:/i.test(trimmedLink) && !/^tel:/i.test(trimmedLink) && !/^\//.test(trimmedLink)) {
        newErrors.link = 'Informe uma URL válida (exemplo: https://link.com).';
      }
    }

    if (!buttonText.trim()) {
      newErrors.buttonText = 'O texto do botão é obrigatório (ex: ABRIR FORMULÁRIO).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Rolar suavemente para o primeiro erro se houver
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const effectiveCategory = categoryType === 'Outro' ? customCategory.trim() : categoryType.trim();

    if (isEditing && initialData) {
      const updated = updateStoredResource(initialData.id, {
        name: name.trim(),
        category: effectiveCategory,
        description: description.trim(),
        link: link.trim(),
        buttonText: buttonText.trim().toUpperCase(),
        whatsappMessage: whatsappMessage.trim(),
        emailSubject: emailSubject.trim(),
        emailBody: emailBody.trim(),
        displayLocation,
        status,
      });
      if (updated) {
        onSuccess(updated);
      }
    } else {
      const saved = saveStoredResource({
        name: name.trim(),
        category: effectiveCategory,
        description: description.trim(),
        link: link.trim(),
        buttonText: buttonText.trim().toUpperCase(),
        whatsappMessage: whatsappMessage.trim(),
        emailSubject: emailSubject.trim(),
        emailBody: emailBody.trim(),
        displayLocation,
        status,
      });
      onSuccess(saved);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-black text-white p-4 z-10 flex items-center justify-between shadow-md">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-white text-xs uppercase tracking-wider underline cursor-pointer"
          >
            ← Cancelar e Voltar
          </button>
          <h1 className="font-bold uppercase text-lg mt-1 tracking-tight">
            {isEditing ? 'Editar Recurso' : 'Adicionar Recurso'}
          </h1>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
          ADM
        </span>
      </header>

      <main className="p-4 sm:p-6 max-w-2xl mx-auto pb-16">
        <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg mb-6">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-700">
            {isEditing ? 'Edição de Recurso Cadastrado' : 'Cadastro de Novo Recurso'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing
              ? 'Modifique os dados do recurso abaixo. As alterações serão salvas imediatamente.'
              : 'Preencha os campos abaixo para registrar um recurso no catálogo da Central de Atendimento.'}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. NOME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              1. Nome do Recurso <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Ex: AVALIAÇÃO NUTRICIONAL"
              className={`w-full border p-3 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                errors.name ? 'border-red-600 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errors.name}
              </p>
            )}
          </div>

          {/* 2. CATEGORIA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              2. Categoria <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoryType(cat);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                  className={`text-xs font-semibold py-2 px-3 rounded-md border text-center transition-colors cursor-pointer ${
                    categoryType === cat
                      ? 'border-black bg-black text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {categoryType === 'Outro' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                  placeholder="Digite o nome da nova categoria..."
                  className={`w-full border p-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.category ? 'border-red-600 bg-red-50/30' : 'border-slate-300 bg-white'
                  }`}
                />
              </div>
            )}

            {errors.category && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errors.category}
              </p>
            )}
          </div>

          {/* 3. DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              3. Descrição <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Ex: Agende e acompanhe sua consulta com nosso nutricionista parceiro."
              className={`w-full border p-3 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none ${
                errors.description ? 'border-red-600 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errors.description}
              </p>
            )}
          </div>

          {/* 4. LINK */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              4. Link Externo <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (errors.link) setErrors((prev) => ({ ...prev, link: '' }));
              }}
              placeholder="https://exemplo.com/formulario"
              className={`w-full border p-3 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                errors.link ? 'border-red-600 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              URL completa de destino para abrir no navegador ao acionar o recurso.
            </p>
            {errors.link && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errors.link}
              </p>
            )}
          </div>

          {/* 5. TEXTO DO BOTÃO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              5. Texto do Botão <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => {
                setButtonText(e.target.value);
                if (errors.buttonText) setErrors((prev) => ({ ...prev, buttonText: '' }));
              }}
              placeholder="Ex: ABRIR FORMULÁRIO, SAIBA MAIS, ACESSAR"
              className={`w-full border p-3 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                errors.buttonText ? 'border-red-600 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            <div className="flex gap-2 mt-2">
              {['ABRIR FORMULÁRIO', 'SAIBA MAIS', 'ACESSAR'].map((txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => {
                    setButtonText(txt);
                    if (errors.buttonText) setErrors((prev) => ({ ...prev, buttonText: '' }));
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer"
                >
                  {txt}
                </button>
              ))}
            </div>
            {errors.buttonText && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errors.buttonText}
              </p>
            )}
          </div>

          {/* 6. MENSAGEM DE WHATSAPP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              6. Mensagem de WhatsApp (Opcional)
            </label>
            <textarea
              rows={3}
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              placeholder="Texto padrão que será preparado para envio no WhatsApp ao compartilhar este recurso..."
              className="w-full border border-slate-300 p-3 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Pode ser deixada em branco para utilizar a mensagem padrão da Central.
            </p>
          </div>

          {/* 7. MENSAGEM DE E-MAIL */}
          <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black">
              7. Mensagem de E-mail (Opcional)
            </h2>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Assunto do E-mail
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Ex: Evolution Fitness — Agendamento de Avaliação"
                className="w-full border border-slate-300 bg-white p-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Corpo do E-mail
              </label>
              <textarea
                rows={3}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Ex: Olá! Segue o link com as instruções para o seu atendimento..."
                className="w-full border border-slate-300 bg-white p-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* 8. EXIBIÇÃO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              8. Local de Exibição <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['HOME', 'OUTROS RECURSOS'] as DisplayLocation[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setDisplayLocation(loc)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    displayLocation === loc
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{loc}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        displayLocation === loc ? 'border-white bg-white' : 'border-slate-400'
                      }`}
                    >
                      {displayLocation === loc && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 ${
                      displayLocation === loc ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {loc === 'HOME'
                      ? 'Aparecerá nos cards principais da Home'
                      : 'Aparecerá dentro de Outros Recursos'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 9. STATUS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              9. Status Inicial <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['ATIVO', 'INATIVO'] as ResourceStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    status === st
                      ? st === 'ATIVO'
                        ? 'border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600'
                        : 'border-slate-600 bg-slate-100 text-slate-800 ring-1 ring-slate-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          st === 'ATIVO' ? 'bg-green-600' : 'bg-slate-400'
                        }`}
                      />
                      {st}
                    </span>
                    {status === st && (
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Selecionado
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Recursos ativos ficam habilitados para utilização. Por padrão, criado como ATIVO.
            </p>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="pt-4 space-y-3 border-t border-slate-200">
            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Salvar Recurso'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
