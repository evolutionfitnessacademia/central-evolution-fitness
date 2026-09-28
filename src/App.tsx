/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CadastroNovoAlunoView from './components/CadastroNovoAlunoView';
import { isPublicCadastroRoute } from './utils/publicUrl';

export default function App() {
  const [isPublic, setIsPublic] = useState(isPublicCadastroRoute());
  const [showSplash, setShowSplash] = useState(!isPublicCadastroRoute());

  useEffect(() => {
    const handleUrlChange = () => {
      const isPublicForm = isPublicCadastroRoute();
      setIsPublic(isPublicForm);
      if (isPublicForm) {
        setShowSplash(false);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Se a URL for o link público do Cadastro, abre diretamente o formulário
  // sem exibir SplashScreen, Central de Atendimento, menus ou ferramentas administrativas
  if (isPublic) {
    return <CadastroNovoAlunoView isPublic={true} />;
  }

  return showSplash ? (
    <SplashScreen onComplete={() => setShowSplash(false)} />
  ) : (
    <HomeScreen />
  );
}
