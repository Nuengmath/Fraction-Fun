/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Heart, Trophy, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Utility Functions ---
const getGCD = (a: number, b: number): number => (b === 0 ? a : getGCD(b, a % b));

const simplify = (num: number, den: number) => {
  const common = Math.abs(getGCD(num, den));
  return { n: num / common, d: den / common };
};

export default function App() {
  // --- States ---
  const [problem, setProblem] = useState({ n1: 1, d1: 2, n2: 1, d2: 3, op: '+' });
  const [userAnswer, setUserAnswer] = useState({ n: '', d: '' });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'sad'>('idle');

  // --- Refs for Focus ---
  const numRef = useRef<HTMLInputElement>(null);
  const denRef = useRef<HTMLInputElement>(null);

  // --- Logic ---
  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let n1 = Math.floor(Math.random() * 9) + 1;
    let d1 = Math.floor(Math.random() * 9) + 2;
    let n2 = Math.floor(Math.random() * 9) + 1;
    let d2 = Math.floor(Math.random() * 9) + 2;

    if (op === '-' && n1/d1 < n2/d2) {
      [n1, n2] = [n2, n1];
      [d1, d2] = [d2, d1];
    }

    setProblem({ n1, d1, n2, d2, op });
    setUserAnswer({ n: '', d: '' });
    setFeedback({ type: null, msg: '' });
    setMascotState('idle');
    
    // Auto-focus numerator
    setTimeout(() => numRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  // --- Check Answer ---
  const checkAnswer = () => {
    const un = parseInt(userAnswer.n);
    const ud = parseInt(userAnswer.d);

    if (isNaN(un) || isNaN(ud) || ud === 0) {
      setFeedback({ type: 'error', msg: 'ใส่ตัวเลขให้ครบก่อนนะเมี๊ยว~' });
      setMascotState('sad');
      return;
    }

    let correctN = 0;
    let correctD = 1;

    const { n1, d1, n2, d2, op } = problem;

    if (op === '+') {
      correctN = n1 * d2 + n2 * d1;
      correctD = d1 * d2;
    } else if (op === '-') {
      correctN = n1 * d2 - n2 * d1;
      correctD = d1 * d2;
    } else if (op === '×') {
      correctN = n1 * n2;
      correctD = d1 * d2;
    } else if (op === '÷') {
      correctN = n1 * d2;
      correctD = d1 * n2;
    }

    const correctSimple = simplify(correctN, correctD);
    const userSimple = simplify(un, ud);

    if (correctSimple.n === userSimple.n && correctSimple.d === userSimple.d) {
      setFeedback({ type: 'success', msg: 'เก่งมากเลยเมี๊ยว! ถูกต้องแล้ว 🎉' });
      setMascotState('happy');
      setScore(s => {
        const newScore = s + 10;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });
      setTimeout(generateProblem, 2000);
    } else {
      setFeedback({ type: 'error', msg: 'ยังไม่ถูกนะเมี๊ยว ลองใหม่อีกที! 💪' });
      setMascotState('sad');
      setLives(l => {
        if (l <= 1) setIsGameOver(true);
        return l - 1;
      });
    }
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 relative">
        <div className="mesh-gradient" />
        
        {/* Floating Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-64 h-64 bg-mascot-purple/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-mascot-green/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-mascot-purple/20"
        >
          <img 
            src="https://picsum.photos/seed/cute-white-cat/400/400" 
            alt="Mascot" 
            className="w-40 h-40 mx-auto mb-6 rounded-full border-8 border-mascot-purple mascot-shadow object-cover"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-5xl font-bold mb-4 text-mascot-purple">จบเกมแล้วเมี๊ยว!</h1>
          <div className="space-y-2 mb-8">
            <p className="text-2xl text-slate-600">คะแนนของคุณ: <span className="font-bold text-mascot-orange">{score}</span></p>
            <p className="text-lg text-slate-400">คะแนนสูงสุด: {highScore}</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsGameOver(false); setScore(0); setLives(3); generateProblem(); }}
            className="bg-mascot-purple hover:bg-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-purple-200"
          >
            เล่นอีกรอบนะเมี๊ยว!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 font-sans selection:bg-mascot-purple/20 relative">
      {/* Animated Mesh Gradient Background */}
      <div className="mesh-gradient" />
      
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-64 h-64 bg-mascot-purple/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-mascot-green/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -150, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[20%] w-72 h-72 bg-mascot-orange/10 rounded-full blur-3xl"
        />
      </div>
      
      {/* Header & Stats */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-lg border-2 border-mascot-purple/10"
      >
        <div className="flex items-center gap-4">
          <div className="bg-mascot-purple/10 p-3 rounded-2xl">
            <Trophy className="text-mascot-purple w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-mascot-purple font-black uppercase tracking-widest">Score</p>
            <motion.span 
              key={score}
              initial={{ scale: 1.5, color: '#9333EA' }}
              animate={{ scale: 1, color: '#1E293B' }}
              className="font-bold text-2xl"
            >
              {score}
            </motion.span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-mascot-orange/10 px-5 py-3 rounded-2xl border border-mascot-orange/20">
          <AnimatePresence mode="popLayout">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Heart 
                  className={`w-7 h-7 transition-colors duration-300 ${i < lives ? 'fill-mascot-orange text-mascot-orange' : 'text-slate-200'}`} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mascot & Game Card Container */}
      <div className="w-full max-w-xl flex flex-col items-center gap-6">
        {/* Mascot */}
        <motion.div
          animate={{ 
            y: mascotState === 'idle' ? [0, -10, 0] : 0,
            scale: mascotState === 'happy' ? [1, 1.1, 1] : 1,
            rotate: mascotState === 'sad' ? [0, -5, 5, 0] : 0
          }}
          transition={{ 
            repeat: mascotState === 'idle' ? Infinity : 0, 
            duration: 2 
          }}
          className="relative"
        >
          <img 
            src="https://picsum.photos/seed/cute-white-cat/400/400" 
            alt="Mascot" 
            className="w-32 h-32 rounded-full border-4 border-mascot-purple mascot-shadow object-cover bg-white"
            referrerPolicy="no-referrer"
          />
          <AnimatePresence>
            {mascotState === 'happy' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-4 -right-4 bg-mascot-orange text-white p-2 rounded-full shadow-lg"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Game Card */}
        <motion.div 
          layout
          className="w-full bg-white rounded-[3rem] shadow-2xl shadow-mascot-purple/10 p-8 sm:p-12 flex flex-col items-center border-4 border-mascot-purple/5 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-mascot-purple/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-mascot-green/5 rounded-full blur-3xl" />

          <h2 className="text-mascot-purple font-black mb-10 uppercase tracking-[0.3em] text-sm relative">
            หาคำตอบให้หน่อยนะเมี๊ยว
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-4xl sm:text-5xl font-bold text-slate-800 relative">
            <motion.div 
              key={`${problem.n1}-${problem.d1}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <span className="border-b-[8px] border-mascot-purple rounded-full pb-2 px-3 min-w-[3.5rem] text-center">{problem.n1}</span>
              <span className="pt-2 px-3 min-w-[3.5rem] text-center">{problem.d1}</span>
            </motion.div>
            
            <motion.span 
              key={problem.op}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-mascot-green text-6xl font-black"
            >
              {problem.op}
            </motion.span>
            
            <motion.div 
              key={`${problem.n2}-${problem.d2}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <span className="border-b-[8px] border-mascot-purple rounded-full pb-2 px-3 min-w-[3.5rem] text-center">{problem.n2}</span>
              <span className="pt-2 px-3 min-w-[3.5rem] text-center">{problem.d2}</span>
            </motion.div>

            <span className="text-slate-200 font-light text-6xl">=</span>

            <div className="flex flex-col items-center gap-3">
              <input 
                ref={numRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userAnswer.n}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'ArrowDown') {
                    denRef.current?.focus();
                  }
                }}
                onChange={(e) => setUserAnswer(prev => ({ ...prev, n: e.target.value.replace(/[^0-9]/g, '') }))}
                className="w-24 h-24 text-center border-4 border-mascot-purple/10 rounded-3xl focus:border-mascot-purple focus:ring-8 focus:ring-mascot-purple/5 focus:outline-none transition-all text-4xl font-bold bg-mascot-cream/30"
                placeholder="?"
              />
              <div className="w-24 h-2 bg-mascot-purple rounded-full" />
              <input 
                ref={denRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userAnswer.d}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    checkAnswer();
                  } else if (e.key === 'ArrowUp') {
                    numRef.current?.focus();
                  }
                }}
                onChange={(e) => setUserAnswer(prev => ({ ...prev, d: e.target.value.replace(/[^0-9]/g, '') }))}
                className="w-24 h-24 text-center border-4 border-mascot-purple/10 rounded-3xl focus:border-mascot-purple focus:ring-8 focus:ring-mascot-purple/5 focus:outline-none transition-all text-4xl font-bold bg-mascot-cream/30"
                placeholder="?"
              />
            </div>
          </div>

          {/* Feedback Message */}
          <AnimatePresence mode="wait">
            {feedback.msg && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className={`mb-10 flex items-center gap-4 font-black text-xl px-8 py-4 rounded-[2rem] shadow-lg ${
                  feedback.type === 'success' ? 'bg-mascot-green text-white' : 'bg-mascot-orange text-white'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="w-full flex gap-4 relative">
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateProblem}
              className="p-6 rounded-3xl border-4 border-mascot-purple/10 text-mascot-purple hover:bg-mascot-purple/5 transition-all"
              title="ข้ามโจทย์"
            >
              <RefreshCw className="w-8 h-8" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98, y: 0 }}
              onClick={checkAnswer}
              className="flex-1 bg-mascot-purple hover:bg-purple-700 text-white font-black text-2xl py-6 rounded-[2rem] shadow-2xl shadow-mascot-purple/30 transition-all flex items-center justify-center gap-4"
            >
              ส่งคำตอบเมี๊ยว! <ChevronRight className="w-8 h-8" />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-sm border-2 border-mascot-purple/5 flex items-center gap-3"
        >
          <div className="w-3 h-3 rounded-full bg-mascot-orange animate-ping" />
          <p className="text-mascot-purple font-bold text-sm">
            อย่าลืมทำเป็นเศษส่วนอย่างต่ำนะเมี๊ยว!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
