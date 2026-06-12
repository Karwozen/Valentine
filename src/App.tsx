/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, LockKeyhole, LockOpen, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

type ScreenState = 'login' | 'quiz' | 'reveal';

const QUESTIONS = [
  {
    question: "Onde os nossos olhares se cruzaram pela primeira vez?",
    options: ["No shopping", "Na academia", "Na faculdade"],
    answer: "Na academia",
    hint: "Ah amor, foca no shape! Lembra que foi no meio dos pesos e aparelhos?"
  },
  {
    question: "Para qual país nós sonhamos em nos mudar e construir nossa vida?",
    options: ["Estados Unidos", "Austrália", "Canadá"],
    answer: "Canadá",
    hint: "Ah, amor, lembra que é um lugar bem frio, cheio de neve e folhinhas de plátano (maple)!"
  },
  {
    question: "Onde vamos passar a nossa tão sonhada lua de mel?",
    options: ["Em um resort no Nordeste", "Em um cruzeiro transatlântico", "Viajando pela Europa de trem"],
    answer: "Em um cruzeiro transatlântico",
    hint: "Prepara o enjoo! Vamos passar vários dias no meio do oceano aproveitando muito luxo!"
  },
  {
    question: "Qual é a nossa série favorita para assistir juntos?",
    options: ["Breaking Bad", "Game of Thrones", "Naruto"],
    answer: "Naruto",
    hint: "Tô certo! Dattebayo! Pensa em ninjas e vilas ocultas!"
  }
];

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; animationDuration: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 4,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-400 opacity-60"
          initial={{ top: '-10%', left: `${heart.left}%`, scale: 0.5 + Math.random() }}
          animate={{
            top: '110%',
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: heart.animationDuration,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        >
          <Heart fill="currentColor" size={24} />
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('login');
  
  // Login State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.replace(/\D/g, ''); // Remove formatting if any
    if (password === '04/03/2023' || cleanPass === '04032023') {
      setScreen('quiz');
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const q = QUESTIONS[currentQuestionIdx];
    
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
      setHint(q.hint);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-rose-100 rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pink-100 rounded-full blur-[60px] opacity-50"></div>
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[48px] p-12 text-center z-10"
          >
            <div className="flex justify-center mb-6 text-rose-500">
              <LockKeyhole size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
              Para desbloquear sua surpresa
            </h1>
            <p className="text-slate-600 mb-8 text-sm">
              insira a data em que nossa história começou (DD/MM/AAAA)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-rose-400 tracking-widest text-center text-lg text-slate-700 bg-white/50 shadow-sm"
                />
              </div>
              <AnimatePresence>
                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-rose-500 text-sm flex items-center justify-center gap-1 font-bold"
                  >
                    <AlertCircle size={14} /> Data incorreta. Tente novamente!
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-200 transform hover:scale-[1.02] transition-all flex justify-center items-center gap-2 text-xl"
              >
                <span>Desbloquear</span>
                <LockOpen size={18} />
              </button>
            </form>
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-[600px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[48px] z-10 overflow-hidden flex flex-col"
          >
            <div className="px-10 pt-10 pb-6 w-full flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                  {QUESTIONS.map((_, idx) => (
                    <div key={idx} className={`w-8 h-1.5 rounded-full ${idx <= currentQuestionIdx ? 'bg-rose-500' : 'bg-rose-200'}`}></div>
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                  Pergunta {currentQuestionIdx + 1}/{QUESTIONS.length}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-800 leading-snug tracking-tight text-center">
                {QUESTIONS[currentQuestionIdx].question}
              </div>
            </div>

            <div className="px-10 pb-10 space-y-4">
              {QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = isSelected && option === QUESTIONS[currentQuestionIdx].answer;
                const isWrong = isSelected && option !== QUESTIONS[currentQuestionIdx].answer;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-5 rounded-2xl text-left transition-all border-2 shadow-sm transform hover:scale-[1.01] flex items-center justify-between ${
                      isCorrect
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : isWrong
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : 'border-white bg-white/50 hover:bg-white text-slate-700 hover:shadow-md'
                    }`}
                  >
                    <span className="font-bold text-lg">{option}</span>
                    {isCorrect && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Heart className="text-green-500" fill="currentColor" size={20} />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6 text-center"
                >
                  <div className="bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl text-sm font-bold border border-rose-100 mb-2">
                    {hint}
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
            className="w-full max-w-[600px] z-10 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] rounded-[48px] p-12 flex flex-col items-center text-center"
          >
            <FloatingHearts />
            
            <div className="w-full flex justify-between items-center mb-8 relative z-10">
              <div className="flex space-x-2">
                <div className="w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-8 h-1.5 rounded-full bg-rose-500"></div>
                <div className="w-8 h-1.5 rounded-full bg-rose-500"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Missão Cumprida</span>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 10 }}
              className="mb-8 relative z-10"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 text-white">
                <Heart size={48} fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight relative z-10"
            >
              Para: <span className="text-rose-600">Letícia</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="relative z-10 mb-10 px-4"
            >
              <p className="text-lg text-slate-600 leading-relaxed">
                Você acertou cada detalhe da nossa jornada! Da academia ao Canadá, do nosso anime favorito até o sonho do nosso cruzeiro. Isso só prova o quanto nossa conexão é única. Mal posso esperar para construir cada um desses sonhos ao seu lado.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="w-full space-y-4 relative z-10"
            >
              <button
                onClick={() => setScreen('login')}
                className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-rose-200 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Feliz Dia dos Namorados!
                <Heart fill="currentColor" size={24} />
              </button>
              
              <div className="flex items-center justify-center space-x-6 pt-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Data de Início</p>
                  <p className="text-sm font-mono font-bold text-rose-500">04.03.2023</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Status</p>
                  <p className="text-sm font-bold text-slate-700 italic underline decoration-rose-300">Para Sempre</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
