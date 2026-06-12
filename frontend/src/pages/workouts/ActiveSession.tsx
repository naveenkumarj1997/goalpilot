import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { workoutApi } from '../../api/workoutApi';
import { useRestTimer } from '../../hooks/useRestTimer';
import { CheckCircle, Play, Pause, SkipForward, X, Timer, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveSession() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const day = state?.day;
  const planId = state?.planId;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [startTime] = useState(Date.now());
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const currentExerciseData = day?.exercises[currentExerciseIndex];

  const { timeLeft, start: startTimer, pause: pauseTimer, resume: resumeTimer, isActive: isTimerActive } = useRestTimer(
    currentExerciseData?.restTime || 60,
    () => handleRestComplete()
  );

  useEffect(() => {
    if (!day) navigate('/workouts/plan');
  }, [day, navigate]);

  // Reset video when exercise changes
  useEffect(() => {
    setShowVideo(false);
  }, [currentExerciseIndex]);

  if (!day || !currentExerciseData) return null;

  const handleSetComplete = () => {
    if (currentSet < currentExerciseData.sets) {
      setIsResting(true);
      startTimer(currentExerciseData.restTime);
    } else {
      // Exercise finished
      if (currentExerciseIndex < day.exercises.length - 1) {
        setIsResting(true);
        startTimer(90); // 90s rest between different exercises
      } else {
        finishWorkout();
      }
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    if (currentSet < currentExerciseData.sets) {
      setCurrentSet(s => s + 1);
    } else {
      setCurrentExerciseIndex(i => i + 1);
      setCurrentSet(1);
    }
  };

  const skipRest = () => {
    pauseTimer();
    handleRestComplete();
  };

  const skipExercise = () => {
    if (currentExerciseIndex < day.exercises.length - 1) {
      setCurrentExerciseIndex(i => i + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    const durationMinutes = Math.floor((Date.now() - startTime) / 60000);
    const caloriesBurned = durationMinutes * 8; // Estimate

    try {
      const res = await workoutApi.logSession({
        planId,
        durationMinutes,
        caloriesBurned,
        completedExercises: day.exercises.map((e: any) => ({
          exercise: e.exercise?._id || e.exercise,
          setsCompleted: e.sets,
          repsCompleted: e.reps
        }))
      });
      setEarnedXP(res.data.totalXP);
      setSessionCompleted(true);
    } catch (error) {
      console.error(error);
      alert('Error saving session');
    }
  };

  if (sessionCompleted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl"
        >
          <div className="w-24 h-24 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-brand" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Workout Complete!</h1>
          <p className="text-slate-400 mb-8">You crushed Day {day.dayNumber}: {day.focus}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 rounded-2xl p-4">
              <span className="text-3xl font-black text-brand">+{earnedXP}</span>
              <p className="text-sm font-bold text-slate-400 mt-1">XP EARNED</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4">
              <span className="text-3xl font-black text-emerald-400">{Math.floor((Date.now() - startTime) / 60000)}</span>
              <p className="text-sm font-bold text-slate-400 mt-1">MINUTES</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/workouts')}
            className="w-full py-4 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,112,209,0.5)]"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const exerciseDetails = currentExerciseData.exercise;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Day {day.dayNumber}: {day.focus}</h1>
          <p className="text-slate-400 font-medium">Exercise {currentExerciseIndex + 1} of {day.exercises.length}</p>
        </div>
        <button onClick={() => navigate('/workouts/plan')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-brand transition-all duration-500"
          style={{ width: `${((currentExerciseIndex) / day.exercises.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isResting ? (
          <motion.div 
            key="rest"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-12 shadow-2xl text-center"
          >
            <Timer className="w-16 h-16 text-emerald-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-black text-white mb-2">Rest</h2>
            <p className="text-slate-400 mb-8 font-medium">Next: {currentSet < currentExerciseData.sets ? 'Next Set' : day.exercises[currentExerciseIndex + 1]?.exercise?.name || 'Done!'}</p>
            
            <div className="text-8xl font-black text-brand mb-12 tabular-nums">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={isTimerActive ? pauseTimer : resumeTimer}
                className="px-8 py-4 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 flex items-center transition-colors"
              >
                {isTimerActive ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Resume</>}
              </button>
              <button 
                onClick={skipRest}
                className="px-8 py-4 rounded-xl font-bold bg-brand hover:bg-brand-hover text-white flex items-center transition-colors shadow-[0_0_15px_rgba(0,112,209,0.3)]"
              >
                Skip Rest <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="exercise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl"
          >
            <div className="aspect-video bg-slate-800 rounded-2xl mb-8 flex items-center justify-center border border-white/5 overflow-hidden relative group">
               {showVideo ? (
                 <iframe 
                   className="w-full h-full"
                   src={`https://www.youtube.com/embed/${exerciseDetails?.animationUrl}?autoplay=1`}
                   title="YouTube video player" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 ></iframe>
               ) : (
                 <>
                   <img 
                     src="/images/exercise-demo.png" 
                     alt="Exercise Demonstration" 
                     className="w-full h-full object-cover mix-blend-screen opacity-40 transition-all duration-500 group-hover:opacity-60 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
                   <div 
                     className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                     onClick={() => setShowVideo(true)}
                   >
                     <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] mb-4 group-hover:scale-110 transition-transform duration-300">
                       <Play className="w-8 h-8 text-white ml-1" />
                     </div>
                     <span className="text-white font-bold tracking-wide">Watch Video Tutorial</span>
                     <span className="text-slate-400 text-sm mt-1">Plays in browser</span>
                   </div>
                 </>
               )}
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {exerciseDetails?.targetMuscles?.map((m: string) => (
                  <span key={m} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">{m}</span>
                ))}
              </div>
              <h2 className="text-3xl font-black text-white mb-2">{exerciseDetails?.name || 'Unknown Exercise'}</h2>
              <div className="flex gap-6 text-slate-400 font-bold mb-6">
                <div className="bg-slate-800 px-4 py-2 rounded-lg">
                  <span className="text-brand">Set</span> {currentSet} / {currentExerciseData.sets}
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-lg">
                  <span className="text-brand">Target</span> {currentExerciseData.reps} Reps
                </div>
              </div>
              
              {/* Form Instructions */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-brand" /> How to Perform</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-brand uppercase tracking-wider mb-1">1. Starting Position</h4>
                    <p className="text-slate-300 text-sm">Assume a stable starting position. Keep your core tight and maintain a neutral spine. {exerciseDetails?.equipment !== 'None' ? `Grip the ${exerciseDetails?.equipment} firmly.` : ''}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand uppercase tracking-wider mb-1">2. Execution (The Form)</h4>
                    <p className="text-slate-300 text-sm">{exerciseDetails?.description || 'Perform the movement in a controlled manner, focusing on the target muscles.'} Breathe out as you exert force.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand uppercase tracking-wider mb-1">3. Stop & Return</h4>
                    <p className="text-slate-300 text-sm">Slowly return to the starting position resisting the weight. Breathe in during this eccentric phase. Do not drop the weight abruptly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSetComplete}
                className="flex-1 py-5 bg-brand hover:bg-brand-hover text-white rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(0,112,209,0.5)] flex items-center justify-center hover:scale-[1.02]"
              >
                <CheckCircle className="w-6 h-6 mr-3" /> Complete Set
              </button>
              <button 
                onClick={skipExercise}
                className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-bold transition-colors flex flex-col items-center justify-center"
              >
                <SkipForward className="w-5 h-5 mb-1" />
                <span className="text-xs">Skip</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
