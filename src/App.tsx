/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, LockKeyhole, LockOpen, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

type ScreenState = 'login' | 'quiz' | 'reveal';

type Question = {
  question: string;
  options: string[];
  answer?: string;
  allCorrect?: boolean;
  getHint?: (option: string) => string;
};

const QUESTIONS: Question[] = [
  {
    question: "Onde os nossos olhares se cruzaram pela primeira vez?",
    options: ["No shopping", "Na academia", "Na faculdade"],
    answer: "Na academia",
    getHint: () => "Ah amor, foca no shape! Lembra que foi no meio dos pesos e aparelhos?"
  },
  {
    question: "Para qual país nós sonhamos em nos mudar e construir nossa vida?",
    options: ["Estados Unidos", "Austrália", "Canadá"],
    answer: "Canadá",
    getHint: () => "Ah, amor, lembra que é um lugar bem frio, cheio de neve e folhinhas de plátano (maple)!"
  },
  {
    question: "Onde vamos passar a nossa tão sonhada lua de mel?",
    options: ["Em um resort no Nordeste", "Em um cruzeiro transatlântico", "Viajando pela Europa de trem"],
    answer: "Em um cruzeiro transatlântico",
    getHint: () => "Prepara o enjoo! Vamos passar vários dias no meio do oceano aproveitando muito luxo!"
  },
  {
    question: "Qual é a nossa série favorita para assistir juntos?",
    options: ["Breaking Bad", "Game of Thrones", "Naruto"],
    answer: "Naruto",
    getHint: () => "Tô certo! Dattebayo! Pensa em ninjas e vilas ocultas!"
  },
  {
    question: "Qual nosso maior sonho atual?",
    options: ["Morar fora do país", "Ter uma casa", "Casar"],
    answer: "Casar",
    getHint: () => "Esses também são, mas qual é o principal agora que estamos planejando?"
  },
  {
    question: "Quando pretendemos nos casar?",
    options: ["2027", "2028", "2030"],
    answer: "2028",
    getHint: (option) => option === "2030" ? "Amor, estamos se referindo ao plano A original rsrsrs" : "Abaixo de 2030, amor! Logo logo <3"
  },
  {
    question: "O que mais gostamos de comer?",
    options: ["Churrasco", "Sushi", "Chocolate"],
    allCorrect: true
  }
];

const DRIVE_LINKS = [
  "https://drive.google.com/file/d/16CQEtHEbwWzZm9BbmOhRg5XRnSQq48W6/view?usp=sharing",
  "https://drive.google.com/file/d/19VmCM4KqvvWdWr4MBWyNRBUFRUws3a0G/view?usp=sharing",
  "https://drive.google.com/file/d/1Dvie4x0Gw-wYSIkW0rZfljCwTaGbkucJ/view?usp=sharing",
  "https://drive.google.com/file/d/1FErh7kc95e-8brxK7LIAHJAf58niPwTj/view?usp=sharing",
  "https://drive.google.com/file/d/1H84d271z49jIf3bXqKwc3QpvjTJiJ7RM/view?usp=sharing",
  "https://drive.google.com/file/d/1MWykPIDKFXwAV4Vhz8s9_egivxv2WXFJ/view?usp=sharing",
  "https://drive.google.com/file/d/1OzW6hWwnWE6QVOoJ3UImt4glKRNeSpw5/view?usp=sharing",
  "https://drive.google.com/file/d/1RoOXUR3DEny-FOH2mBrpXZT9tlzW2bW3/view?usp=sharing",
  "https://drive.google.com/file/d/1SrKmPDRBUYUaMxnrimcV-KbNLxmULyL0/view?usp=sharing",
  "https://drive.google.com/file/d/1TES8vkBxcwbPE8HIqisJRrDCuWPdT_yX/view?usp=sharing",
  "https://drive.google.com/file/d/1TIOqf1Zyw85B7sZAyetHilEkcV8nPCo0/view?usp=sharing",
  "https://drive.google.com/file/d/1VFu8XgNz84MtM7XsmjdiSyE3AaUQBou4/view?usp=sharing",
  "https://drive.google.com/file/d/1Zq-6aBYewIuWo9Xv8aauzzCyT6S04xJn/view?usp=sharing",
  "https://drive.google.com/file/d/1_s5wBQKUxduYFMPoK6N4S-s9wBcXUvn1/view?usp=sharing",
  "https://drive.google.com/file/d/1gokImzyUR7n78P9LZiA4tBEnbzJpvJK-/view?usp=sharing",
  "https://drive.google.com/file/d/1iFL1F_tPeZGJTon0MVneporfdzgnHHSu/view?usp=sharing",
  "https://drive.google.com/file/d/1png18ENwi0oYTmqyNeadCGDX_EfiDM8-/view?usp=sharing",
  "https://drive.google.com/file/d/1sneYeOQvBKuCJ28LJdq_Fu_KK_GPAbI2/view?usp=sharing",
  "https://drive.google.com/file/d/1vhHkelA_CTalwPiuxgHQde7jHAHo7l8x/view?usp=sharing",
  "https://drive.google.com/file/d/1z909e7Mt9p5XT1lwc-fh-IPT2e5wa9pU/view?usp=sharing"
];

function getDirectImageUrl(link: string): string {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return link;
}

// 20 Fotos vindas diretamente do Google Drive, formatadas para download direto
const PHOTOS = DRIVE_LINKS.map(getDirectImageUrl);

// 20 posições descentralizadas para cobrir a tela sem invadir o centro com escala ampliada em 1.5x
const PHOTO_POSITIONS = [
  // 1. Coluna Esquerda Externa (4 items)
  { top: "2%", left: "1%", right: undefined, bottom: undefined, rotation: -8, size: "w-[120px] h-[120px] md:w-[360px] md:h-[360px]" },
  { top: "26%", left: "2%", right: undefined, bottom: undefined, rotation: 10, size: "w-[132px] h-[132px] md:w-[390px] md:h-[390px]" },
  { top: "51%", left: "1%", right: undefined, bottom: undefined, rotation: -12, size: "w-[120px] h-[120px] md:w-[360px] md:h-[360px]" },
  { top: "76%", left: "3%", right: undefined, bottom: undefined, rotation: 6, size: "w-[132px] h-[132px] md:w-[390px] md:h-[390px]" },

  // 2. Coluna Esquerda Interna (3 items)
  { top: "14%", left: "12%", right: undefined, bottom: undefined, rotation: -4, size: "w-[108px] h-[108px] md:w-[315px] md:h-[315px]" },
  { top: "40%", left: "14%", right: undefined, bottom: undefined, rotation: 8, size: "w-[108px] h-[108px] md:w-[315px] md:h-[315px]" },
  { top: "66%", left: "12%", right: undefined, bottom: undefined, rotation: -15, size: "w-[120px] h-[120px] md:w-[345px] md:h-[345px]" },

  // 3. Coluna Direita Externa (4 items)
  { top: "2%", left: undefined, right: "1%", bottom: undefined, rotation: 12, size: "w-[120px] h-[120px] md:w-[360px] md:h-[360px]" },
  { top: "26%", left: undefined, right: "2%", bottom: undefined, rotation: -8, size: "w-[132px] h-[132px] md:w-[390px] md:h-[390px]" },
  { top: "51%", left: undefined, right: "1%", bottom: undefined, rotation: 15, size: "w-[120px] h-[120px] md:w-[360px] md:h-[360px]" },
  { top: "76%", left: undefined, right: "3%", bottom: undefined, rotation: -6, size: "w-[132px] h-[132px] md:w-[390px] md:h-[390px]" },

  // 4. Coluna Direita Interna (3 items)
  { top: "14%", left: undefined, right: "12%", bottom: undefined, rotation: 6, size: "w-[108px] h-[108px] md:w-[315px] md:h-[315px]" },
  { top: "40%", left: undefined, right: "14%", bottom: undefined, rotation: -11, size: "w-[108px] h-[108px] md:w-[315px] md:h-[315px]" },
  { top: "66%", left: undefined, right: "12%", bottom: undefined, rotation: 9, size: "w-[120px] h-[120px] md:w-[345px] md:h-[345px]" },

  // 5. Faixa Superior (3 items)
  { top: "1%", left: "25%", right: undefined, bottom: undefined, rotation: -9, size: "w-[108px] h-[108px] md:w-[300px] md:h-[300px]" },
  { top: "2%", left: "46%", right: undefined, bottom: undefined, rotation: 4, size: "w-[120px] h-[120px] md:w-[330px] md:h-[330px]" },
  { top: "1%", left: "67%", right: undefined, bottom: undefined, rotation: -6, size: "w-[108px] h-[108px] md:w-[300px] md:h-[300px]" },

  // 6. Faixa Inferior (3 items)
  { top: undefined, left: "25%", right: undefined, bottom: "1%", rotation: 14, size: "w-[108px] h-[108px] md:w-[300px] md:h-[300px]" },
  { top: undefined, left: "46%", right: undefined, bottom: "2%", rotation: -8, size: "w-[120px] h-[120px] md:w-[330px] md:h-[330px]" },
  { top: undefined, left: "67%", right: undefined, bottom: "1%", rotation: 11, size: "w-[108px] h-[108px] md:w-[300px] md:h-[300px]" },
];

function FloatingPhotosBackground() {
  const animatedPhotos = useMemo(() => {
    return PHOTOS.map((url, i) => {
      const pos = PHOTO_POSITIONS[i % PHOTO_POSITIONS.length];
      const floatDuration = 4 + Math.random() * 6; // 4s to 10s
      const floatDelay = Math.random() * -10; // negative delay so they are pre-arranged and already floating
      const floatY = 15 + Math.random() * 15; // 15px to 30px float distance
      const rotationWobble = Math.random() * 4 - 2;

      return {
        url,
        pos,
        floatDuration,
        floatDelay,
        floatY,
        rotationWobble
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {animatedPhotos.map((photo, i) => (
        <motion.div
          key={i}
          className={`absolute ${photo.pos.size} p-1.5 md:p-3 bg-white rounded-xl md:rounded-3xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:shadow-[0_24px_50px_rgba(0,0,0,0.15)] border border-slate-100/50 opacity-60 md:opacity-80 pointer-events-auto cursor-pointer flex items-center justify-center`}
          style={{ 
            top: photo.pos.top, 
            left: photo.pos.left, 
            right: photo.pos.right, 
            bottom: photo.pos.bottom,
            zIndex: 1
          }}
          initial={{ y: 0, rotate: photo.pos.rotation }}
          animate={{ 
            y: [-photo.floatY, photo.floatY, -photo.floatY],
            rotate: [photo.pos.rotation, photo.pos.rotation + photo.rotationWobble, photo.pos.rotation] 
          }}
          whileHover={{
            scale: 1.25,
            zIndex: 50,
            rotate: 0,
            y: 0,
            opacity: 1,
            transition: { duration: 0.25, ease: "easeOut" }
          }}
          whileTap={{
            scale: 1.25,
            zIndex: 50,
            rotate: 0,
            y: 0,
            opacity: 1,
            transition: { duration: 0.25, ease: "easeOut" }
          }}
          transition={{
            y: {
              duration: photo.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: photo.floatDelay
            },
            rotate: {
              duration: photo.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: photo.floatDelay
            }
          }}
        >
          <img 
            src={photo.url} 
            alt={`Memory ${i + 1}`} 
            className="w-full h-full object-cover rounded-lg md:rounded-2xl" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      ))}
    </div>
  );
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ 
    id: number; 
    left: number; 
    scale: number; 
    duration: number; 
    delay: number; 
    color: string;
    size: number;
  }[]>([]);

  useEffect(() => {
    const colors = [
      'text-rose-200/40', 'text-pink-200/40', 'text-rose-300/45', 
      'text-pink-300/45', 'text-red-200/40', 'text-red-300/40',
      'text-rose-400/30', 'text-pink-400/30'
    ];
    const newHearts = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      scale: 0.4 + Math.random() * 0.8,
      duration: 12 + Math.random() * 14, 
      delay: Math.random() * -20, 
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 12 + Math.floor(Math.random() * 24), 
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className={`absolute ${heart.color}`}
          style={{
            left: `${heart.left}%`,
          }}
          initial={{ y: '105vh', scale: heart.scale, opacity: 0 }}
          animate={{
            y: '-10vh',
            x: [0, 40, -40, 0], 
            opacity: [0, 0.7, 0.7, 0] 
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: heart.delay,
          }}
        >
          <Heart fill="currentColor" size={heart.size} />
        </motion.div>
      ))}
    </div>
  );
}

function CursorHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime.current < 80) return; 
      lastTime.current = now;

      const newHeart = { id: nextId.current++, x: e.clientX, y: e.clientY };
      setHearts(prev => [...prev, newHeart]);

      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, x: heart.x - 8, y: heart.y - 8, scale: 0.5 }}
            animate={{ opacity: 0, y: heart.y - 60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute text-rose-500"
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('login');
  
  // Login State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [allCorrectMarked, setAllCorrectMarked] = useState(false);
  const [showAllCorrectModal, setShowAllCorrectModal] = useState(false);

  // Explosão abundante e realista de confetes na Revelação Final
  useEffect(() => {
    if (screen === 'reveal') {
      // Grande estouro inicial de corações/rosa/pink confetes no centro
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#ff719a', '#ec4899', '#f43f5e', '#ff4d6d', '#ffb3c1', '#fff0f3']
      });

      // Disparos contínuos e alternados das laterais por 5 segundos
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 45 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [screen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.replace(/\D/g, ''); 
    if (password === '04/03/2023' || cleanPass === '04032023') {
      setScreen('quiz');
      setLoginError(false);
      setHasInteracted(true);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const q = QUESTIONS[currentQuestionIdx];
    
    if (q.allCorrect) {
      setHint(null);
      setAllCorrectMarked(true);
      setShowAllCorrectModal(true);
      setTimeout(() => {
        setShowAllCorrectModal(false);
        setScreen('reveal');
      }, 3000);
      return;
    }

    if (option === q.answer) {
      setHint(null);
      setTimeout(() => {
        if (currentQuestionIdx < QUESTIONS.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
          setSelectedOption(null);
        } else {
          setScreen('reveal');
        }
      }, 1000);
    } else {
      setHint(q.getHint ? q.getHint(option) : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Video de Background Desfocado para clima romântico */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <iframe
          src="https://drive.google.com/file/d/1Gc5WcbyraJCL6Bdod4lcQMh8jbOKFqrN/preview?autoplay=1&mute=1&controls=0&loop=1"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] min-w-full min-h-full border-none pointer-events-none"
          allow="autoplay; encrypted-media"
          title="Background Video"
          style={{ filter: 'blur(16px)', opacity: 0.45 }}
        />
        <div className="absolute inset-0 bg-[#FFF5F7]/45 pointer-events-none" />
      </div>

      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-rose-100 rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pink-100 rounded-full blur-[60px] opacity-50"></div>
      
      <FloatingPhotosBackground />
      {/* Remove backgroud hearts on final screen to let confetti shine beautifully */}
      {screen !== 'reveal' && <FloatingHearts />}
      <CursorHearts />
      
      {/* Hidden music player with native iframe autoplay bypass */}
      {screen !== 'login' && (
        <iframe
          style={{ position: 'absolute', width: '1px', height: '1px', left: '-9999px', top: '-9999px', opacity: 0 }}
          src="https://www.youtube.com/embed/dPiQbEDWDG8?autoplay=1&loop=1&playlist=dPiQbEDWDG8&controls=0"
          title="Background Music"
          allow="autoplay; encrypted-media"
        />
      )}

      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[32px] md:rounded-[48px] p-6 md:p-12 pb-8 text-center z-10"
          >
            <div className="flex justify-center mb-4 md:mb-6 text-rose-500">
              <LockKeyhole className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 md:mb-4 tracking-tight">
              Para desbloquear sua surpresa
            </h1>
            <p className="text-slate-600 mb-6 md:mb-8 text-xs md:text-sm">
              insira a data em que nossa história começou (DD/MM/AAAA)
            </p>
 
            <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
              <div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-rose-400 tracking-widest text-center text-base md:text-lg text-slate-700 bg-white/50 shadow-sm"
                />
              </div>
              <AnimatePresence>
                {loginError && (
                  <motion.p
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="text-rose-500 text-xs md:text-sm flex items-center justify-center gap-1 font-bold"
                  >
                    <AlertCircle size={14} /> Data incorreta. Tente novamente!
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl shadow-xl shadow-rose-200 flex justify-center items-center gap-2 text-lg md:text-xl cursor-pointer"
              >
                <span>Desbloquear</span>
                <LockOpen size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-[600px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[32px] md:rounded-[48px] z-10 overflow-hidden flex flex-col"
          >
            {/* Header / Progresso - Estático para que não deslize de forma redundante */}
            <div className="px-6 md:px-10 pt-6 md:pt-10 pb-0 w-full flex flex-col items-center">
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 md:mb-6">
                <div className="flex space-x-1.5 w-full sm:w-auto flex-1">
                  {QUESTIONS.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full flex-1 sm:w-6 ${idx <= currentQuestionIdx ? 'bg-rose-500' : 'bg-rose-200'}`}></div>
                  ))}
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-400 shrink-0">
                  Pergunta {currentQuestionIdx + 1}/{QUESTIONS.length}
                </span>
              </div>
            </div>

            {/* Transições Deslizantes do Bloco da Pergunta e Opções */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIdx}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full flex flex-col"
              >
                {/* Pergunta */}
                <div className="px-6 md:px-10 pb-4 md:pb-6 w-full flex flex-col items-center">
                  <div className="text-xl md:text-2xl font-extrabold text-slate-800 leading-snug tracking-tight text-center">
                    {QUESTIONS[currentQuestionIdx].question}
                  </div>
                </div>

                {/* Opções */}
                <div className="px-6 md:px-10 pb-6 md:pb-10 space-y-3 md:space-y-4">
                  {QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                    const q = QUESTIONS[currentQuestionIdx];
                    const isSelected = selectedOption === option;
                    const isCorrect = allCorrectMarked || (isSelected && option === q.answer);
                    const isWrong = !allCorrectMarked && isSelected && option !== q.answer;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl text-left transition-all border-2 shadow-sm transform hover:scale-[1.01] flex items-center justify-between ${
                          isCorrect
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : isWrong
                            ? 'border-rose-400 bg-rose-50 text-rose-700'
                            : 'border-white bg-white/50 hover:bg-white text-slate-700 hover:shadow-md'
                        }`}
                      >
                        <span className="font-bold text-base md:text-lg">{option}</span>
                        {isCorrect && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Heart className="text-green-500" fill="currentColor" size={20} />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dica */}
                <AnimatePresence>
                  {hint && !allCorrectMarked && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-center"
                    >
                      <div className="bg-rose-50 text-rose-600 px-5 py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold border border-rose-100 mb-2">
                        {hint}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showAllCorrectModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-white/40 backdrop-blur-sm rounded-[32px] md:rounded-[48px]"
                >
                  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl border border-rose-100 text-center max-w-sm mx-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-rose-500 flex justify-center mb-4"
                    >
                      <Heart size={48} fill="currentColor" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-2">Acertou!</h2>
                    <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                      É, essa é uma pergunta difícil mesmo! Gostamos de comer de tudo juntos rsrsrs ❤️!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {screen === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[600px] z-10 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[32px] md:rounded-[48px] p-6 md:p-12 flex flex-col items-center text-center"
          >
            <div className="w-full flex justify-between items-center mb-6 md:mb-8 relative z-10">
              <div className="flex space-x-2">
                <div className="w-6 md:w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-6 md:w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-6 md:w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-6 md:w-8 h-1.5 rounded-full bg-rose-500"></div>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-400">Missão Cumprida</span>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 10 }}
              className="mb-6 md:mb-8 relative z-10"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 text-white">
                <Heart className="w-8 h-8 md:w-12 md:h-12" fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-2 md:border-4 border-white rounded-full"></div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-2 md:mb-4 tracking-tight relative z-10"
            >
              Para: <span className="text-rose-600">Letícia</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="relative z-10 mb-6 md:mb-10 px-0 md:px-4 space-y-3 md:space-y-4"
            >
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                Você acertou cada detalhe da nossa jornada! Da academia ao Canadá, do nosso anime favorito até o sonho do nosso cruzeiro. Só você conseguiria acertar todas as perguntas, pois nos conhecemos tão bem e dividimos todos os nossos sonhos juntos. Isso só prova o quanto a nossa conexão é única. Mal posso esperar para construir cada um desses sonhos ao seu lado.
              </p>
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                Iremos conquistar todos eles, independente de qualquer dificuldade que apareça em nosso caminho, sempre com Deus como nosso guia e nosso pilar! Eu te amo mais do que qualquer coisa neste mundo. Quero sempre ser o meu lado bom contigo, sempre te fazer feliz para ver o seu sorriso que eu adoro e que me faz tão bem!
              </p>
              <p className="text-base md:text-xl font-bold text-rose-600 pt-1 md:pt-2">
                Feliz Dia dos Namorados para a melhor namorada que eu poderia ter!!! Te amo, Letícia ❤️
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="w-full space-y-3 md:space-y-4 relative z-10"
            >
              <button
                onClick={() => setScreen('login')}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl md:rounded-2xl font-bold text-lg md:text-xl shadow-xl shadow-rose-200 transform hover:scale-[1.01] md:hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Feliz Dia dos Namorados!
              </button>
              
              <div className="flex items-center justify-center space-x-6 pt-3 md:pt-4">
                <div className="text-center">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Data de Início</p>
                  <p className="text-xs md:text-sm font-mono font-bold text-rose-500">04.03.2023</p>
                </div>
                <div className="h-6 md:h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Status</p>
                  <p className="text-xs md:text-sm font-bold text-slate-700 italic underline decoration-rose-300">Para Sempre</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
