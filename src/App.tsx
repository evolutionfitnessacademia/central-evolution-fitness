/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CadastroNovoAlunoView from './components/CadastroNovoAlunoView';
import PWAUpdateNotification from './components/PWAUpdateNotification';
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

  // O componente PWAUpdateNotification é montado no topo para avisar discretamente
  // sobre novas versões sem interromper a navegação ou formulários em andamento
  return (
    <>
      <PWAUpdateNotification />
      {isPublic ? (
        <CadastroNovoAlunoView isPublic={true} />
      ) : showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <HomeScreen />
      )}
    </>
  );
}
