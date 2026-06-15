import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Sparkles,
} from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // 0-based index
  explanation?: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
}

export function Quiz({ title = "Quick Quiz", questions }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );

  const q = questions[current];
  const isCorrect = selected === q?.answer;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected(idx);
    },
    [answered],
  );

  const handleCheck = useCallback(() => {
    if (selected === null) return;
    setAnswered(true);
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    if (selected === q.answer) setScore((s) => s + 1);
  }, [selected, current, q, answers]);

  const handleNext = useCallback(() => {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }, [current, total]);

  const handleRetry = useCallback(() => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers(new Array(questions.length).fill(null));
  }, [questions.length]);

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="setu-quiz">
      {/* Header */}
      <div className="setu-quiz-header">
        <div className="setu-quiz-header-left">
          <Sparkles size={16} className="setu-quiz-icon" />
          <span className="setu-quiz-title">{title}</span>
        </div>
      </div>

      {/* Body */}
      <div className="setu-quiz-body">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Question counter */}
              <div className="setu-quiz-counter">
                Question {current + 1} of {total}
              </div>

              {/* Question */}
              <p className="setu-quiz-question">{q.question}</p>

              {/* Options */}
              <div className="setu-quiz-options">
                {q.options.map((opt, i) => {
                  let cls = "setu-quiz-option";
                  if (selected === i) cls += " selected";
                  if (answered) {
                    if (i === q.answer) cls += " correct";
                    else if (i === selected) cls += " wrong";
                    else cls += " dimmed";
                  }
                  return (
                    <motion.button
                      key={i}
                      className={cls}
                      onClick={() => handleSelect(i)}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                    >
                      <span className="setu-quiz-letter">
                        {optionLetters[i]}
                      </span>
                      <span className="setu-quiz-opttext">{opt}</span>
                      {answered && i === q.answer && (
                        <CheckCircle2 size={16} className="setu-quiz-check" />
                      )}
                      {answered && i === selected && i !== q.answer && (
                        <XCircle size={16} className="setu-quiz-x" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="setu-quiz-explanation"
                  >
                    <strong>
                      {isCorrect ? "✅ Correct!" : "❌ Not quite."}
                    </strong>{" "}
                    {q.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ── Results Screen ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="setu-quiz-results"
            >
              <Trophy size={32} className="setu-quiz-trophy" />
              <div className="setu-quiz-score-ring">
                <svg viewBox="0 0 100 100" width="80" height="80">
                  <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={
                      pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"
                    }
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${pct * 2.64} 264`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                  />
                </svg>
                <span className="setu-quiz-pct">{pct}%</span>
              </div>
              <p className="setu-quiz-score-text">
                You got <strong>{score}</strong> out of <strong>{total}</strong>{" "}
                correct!
              </p>
              <p className="setu-quiz-score-msg">
                {pct === 100
                  ? "Perfect score! You nailed it! 🎉"
                  : pct >= 80
                    ? "Great job! Almost perfect! 🔥"
                    : pct >= 50
                      ? "Good effort! Review and try again. 💪"
                      : "Review the page and try again."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="setu-quiz-footer">
        {/* Progress Bar — left side */}
        {!finished && (
          <div className="setu-quiz-progress-bar-container">
            <div
              className="setu-quiz-progress-fill"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
        )}

        {/* Action button — right side */}
        {!finished ? (
          <>
            {!answered ? (
              <button
                className="setu-quiz-btn primary"
                onClick={handleCheck}
                disabled={selected === null}
              >
                Check Answer
              </button>
            ) : (
              <button className="setu-quiz-btn primary" onClick={handleNext}>
                {current < total - 1 ? (
                  <>
                    Next <ChevronRight size={14} />
                  </>
                ) : (
                  <>
                    See Results <Trophy size={14} />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <button className="setu-quiz-btn secondary" onClick={handleRetry}>
            <RotateCcw size={14} /> Try Again
          </button>
        )}
      </div>
    </div>
  );
}
