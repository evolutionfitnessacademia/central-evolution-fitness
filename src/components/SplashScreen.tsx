import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-white text-center">
      <h1 className="text-3xl font-bold uppercase tracking-tight">EVOLUTION FITNESS</h1>
      <p className="text-xl mt-2 font-light">CENTRAL DE ATENDIMENTO</p>
      <p className="text-sm mt-8 opacity-70 tracking-widest">SAÚDE • DISCIPLINA • RESULTADOS</p>
      <div className="w-full max-w-xs mt-12 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
