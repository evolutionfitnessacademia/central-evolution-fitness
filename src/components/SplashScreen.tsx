import { useState, useEffect } from 'react';
import splashImage from '../assets/splash-evolution-fitness.png';

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      <img
        src={splashImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/splash-evolution-fitness.png';
        }}
        className="absolute inset-0 w-full h-full object-cover object-center"
        alt="Evolution Fitness Splash"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-12 w-full max-w-xs px-6 z-10">
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
