import { useEffect, useRef, useState } from 'react';

const arabicLetters = [
  { arabic: 'ا', english: 'Alif', color: '#ffffff' },
  { arabic: 'ب', english: 'Baa', color: '#ffffff' },
  { arabic: 'ت', english: 'Taa', color: '#ffffff' },
  { arabic: 'ث', english: 'Saa', color: '#ffffff' },
  { arabic: 'ج', english: 'Jeem', color: '#ffffff' },
  { arabic: 'ح', english: 'Haa', color: '#ffffff' },
  { arabic: 'خ', english: 'Khaa', color: '#ffffff' },
  { arabic: 'د', english: 'Daal', color: '#ffffff' },
  { arabic: 'ذ', english: 'Zaal', color: '#ffffff' },
  { arabic: 'ر', english: 'Raa', color: '#ffffff' },
  { arabic: 'ز', english: 'Zaa', color: '#ffffff' },
  { arabic: 'س', english: 'Seen', color: '#ffffff' },
  { arabic: 'ش', english: 'Sheen', color: '#ffffff' },
  { arabic: 'ص', english: 'Saad', color: '#ffffff' },
  { arabic: 'ض', english: 'Daad', color: '#ffffff' },
  { arabic: 'ط', english: 'Taa', color: '#ffffff' },
  { arabic: 'ظ', english: 'Zaw', color: '#ffffff' },
  { arabic: 'ع', english: 'Ayn', color: '#ffffff' },
  { arabic: 'غ', english: 'Ghayn', color: '#ffffff' },
  { arabic: 'ف', english: 'Faa', color: '#ffffff' },
  { arabic: 'ق', english: 'Qaaf', color: '#ffffff' },
  { arabic: 'ك', english: 'Kaaf', color: '#ffffff' },
  { arabic: 'ل', english: 'Laam', color: '#ffffff' },
  { arabic: 'م', english: 'Meem', color: '#ffffff' },
  { arabic: 'ن', english: 'Noon', color: '#ffffff' },
  { arabic: 'ه', english: 'Haa', color: '#ffffff' },
  { arabic: 'و', english: 'Waaw', color: '#ffffff' },
  { arabic: 'ء', english: 'Hamza', color: '#ffffff' },
  { arabic: 'ي', english: 'Yaa', color: '#ffffff' },
];

const createLetterOptions = (targetLetter, selectedIndexes) => {
  const buildLetter = (letter) => ({ ...letter, id: `${letter.arabic}-${Math.random()}-${Date.now()}` });

  const letters = [buildLetter(targetLetter)];
  let distractors = selectedIndexes
    .map((index) => arabicLetters[index])
    .filter((letter) => letter.arabic !== targetLetter.arabic);

  if (distractors.length === 0) {
    distractors = arabicLetters.filter((letter) => letter.arabic !== targetLetter.arabic);
  }

  const totalLetters = window.innerWidth <= 768 ? 12 : 18;
  const neededDistractorsCount = totalLetters - 1;

  let shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
  let distractorIndex = 0;

  for (let i = 0; i < neededDistractorsCount; i += 1) {
    if (distractorIndex >= shuffledDistractors.length) {
      shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
      distractorIndex = 0;
    }
    letters.push(buildLetter(shuffledDistractors[distractorIndex]));
    distractorIndex += 1;
  }

  return letters.sort(() => Math.random() - 0.5);
};

const getRandomLetterExcluding = (excludeArabic = []) => {
  const letters = arabicLetters.filter((letter) => !excludeArabic.includes(letter.arabic));
  return letters[Math.floor(Math.random() * letters.length)] ?? arabicLetters[0];
};

function App() {
  const nameInputRef = useRef(null);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mistakesHistory, setMistakesHistory] = useState([]);
  const [targetLetter, setTargetLetter] = useState(null);
  const [sessionLettersPool, setSessionLettersPool] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundLetters, setRoundLetters] = useState([]);
  const [feedback, setFeedback] = useState({ text: '', color: '#FFD700', visible: false });
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const updateStartButton = selectedLetters.length > 0;

  const toggleLetterSelection = (index) => {
    setSelectedLetters((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
  };

  const selectAllLetters = () => {
    const allSelected = selectedLetters.length === arabicLetters.length;
    setSelectedLetters(allSelected ? [] : arabicLetters.map((_, index) => index));
  };

  const startNewRound = (pool = sessionLettersPool) => {
    if (!gameActive || pool.length === 0) return;

    const randomPoolIndex = Math.floor(Math.random() * pool.length);
    const nextLetterIndex = pool[randomPoolIndex];
    const chosenLetter = arabicLetters[nextLetterIndex];
    const remainingPool = pool.filter((_, index) => index !== randomPoolIndex);

    setSessionLettersPool(remainingPool);
    setTargetLetter(chosenLetter);
    setRoundLetters(createLetterOptions(chosenLetter, selectedLetters));
  };

  const revealConfetti = () => {
    const pieces = Array.from({ length: 30 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 30}%`,
      color: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4'][
        Math.floor(Math.random() * 6)
      ],
      delay: `${(Math.random() * 0.3).toFixed(2)}s`,
      x: `${(Math.random() - 0.5) * 260}px`,
      y: `${120 + Math.random() * 120}px`,
      rotation: `${Math.random() * 720}deg`,
    }));

    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 1800);
  };

  const showFeedback = (message, color, duration = 1500) => {
    setFeedback({ text: message, color, visible: true });
    setTimeout(() => {
      setFeedback((current) => ({ ...current, visible: false }));
    }, duration);
  };

  const initGame = () => {
    const safeName = playerName.trim() || 'Student';

    if (selectedLetters.length === 0) {
      alert('Please select at least one letter to practice!');
      return;
    }

    setPlayerName(safeName);
    setScore(0);
    setMistakes(0);
    setMistakesHistory([]);
    setCorrectAnswers(0);
    setGameActive(true);
    setShowStartScreen(false);
    setShowVictoryModal(false);

    const pool = [...selectedLetters];
    const randomPoolIndex = Math.floor(Math.random() * pool.length);
    const firstLetterIndex = pool[randomPoolIndex];
    const chosenLetter = arabicLetters[firstLetterIndex];
    const remainingPool = pool.filter((_, index) => index !== randomPoolIndex);

    setSessionLettersPool(remainingPool);
    setTargetLetter(chosenLetter);
    setRoundLetters(createLetterOptions(chosenLetter, selectedLetters));
  };

  const resetGame = () => {
    setShowStartScreen(true);
    setGameActive(false);
    setScore(0);
    setMistakes(0);
    setMistakesHistory([]);
    setSessionLettersPool([]);
    setCorrectAnswers(0);
    setTargetLetter(null);
    setRoundLetters([]);
    setFeedback({ text: '', color: '#FFD700', visible: false });
    setShowMistakesModal(false);
    setShowVictoryModal(false);
    setConfettiPieces([]);
  };

  const handleLetterClick = (clickedLetterDetails) => {
    if (!gameActive || clickedLetterDetails.status === 'correct' || clickedLetterDetails.status === 'wrong') {
      return;
    }

    if (clickedLetterDetails.arabic === targetLetter.arabic) {
      setRoundLetters((current) =>
        current.map((item) =>
          item.id === clickedLetterDetails.id ? { ...item, status: 'correct' } : item
        )
      );

      const nextCorrectAnswers = correctAnswers + 1;
      const nextScore = Math.round((nextCorrectAnswers / selectedLetters.length) * 100);
      setCorrectAnswers(nextCorrectAnswers);
      setScore(nextScore);
      revealConfetti();

      if (sessionLettersPool.length === 0) {
        const finalRemarks = mistakes === 0
          ? "⭐ Subhan'Allah! Perfect Practice with Zero Mistakes! ⭐"
          : mistakes <= 2
            ? "🌟 Masha'Allah! Excellent practice, nearly perfect! 🌟"
            : mistakes <= 5
              ? "👍 Alhamdulillah! Great practice. Keep aiming for zero mistakes! 👍"
              : "📚 Well tried! Practice more to improve your score and reduce mistakes! 📚";

        setTimeout(() => {
          setShowVictoryModal(true);
        }, 1000);

        setFeedback({ text: `Excellent, ${playerName}!`, color: '#28a745', visible: true });
        setTimeout(() => {
          setFeedback((current) => ({ ...current, visible: false }));
        }, 1200);

        return;
      }

      showFeedback(`Excellent, ${playerName}!`, '#28a745', 1200);
      setTimeout(() => {
        startNewRound(sessionLettersPool);
      }, 1400);
      return;
    }

    setRoundLetters((current) =>
      current.map((item) =>
        item.id === clickedLetterDetails.id ? { ...item, status: 'wrong' } : item
      )
    );

    setMistakes((current) => current + 1);
    setMistakesHistory((current) => {
      if (current.some((entry) => entry.arabic === clickedLetterDetails.arabic)) {
        return current;
      }

      const letterInfo = arabicLetters.find((letter) => letter.arabic === clickedLetterDetails.arabic);
      return letterInfo ? [...current, letterInfo] : current;
    });

    showFeedback(`Try Again, ${playerName}!`, '#dc3545', 1200);

    setTimeout(() => {
      setRoundLetters((current) =>
        current.map((item) => {
          if (item.id !== clickedLetterDetails.id) return item;

          const randomLetter = getRandomLetterExcluding([
            clickedLetterDetails.arabic,
            targetLetter.arabic,
            ...current.map((entry) => entry.arabic),
          ]);

          return {
            ...randomLetter,
            id: `${randomLetter.arabic}-${Date.now()}-${Math.random()}`,
          };
        })
      );
    }, 600);
  };

  const handleMistakesOpen = () => {
    setShowMistakesModal(true);
  };

  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    initGame();
  };

  const handleQuit = () => {
    setShowVictoryModal(false);
    resetGame();
  };

  const modalMistakeItems = mistakesHistory.length > 0 ? mistakesHistory : [];

  return (
    <>
      <div className="islamic-bg">
        <div className="moon">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path
              d="M40 10 A40 40 0 1 0 90 60 A30 30 0 1 1 40 10 Z"
              fill="#FFF59D"
              filter="drop-shadow(0 0 10px rgba(255, 245, 157, 0.8))"
            />
          </svg>
        </div>

        <div className="star star1">✨</div>
        <div className="star star2">⭐</div>
        <div className="star star3">✨</div>
        <div className="star star4">⭐</div>
        <div className="star star5">✨</div>
        <div className="star star6">⭐</div>

        <div className="mosque-landscape">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <line x1="100" y1="90" x2="100" y2="75" stroke="#FFD700" strokeWidth="2" />
            <path d="M 95 70 A 5 5 0 1 0 105 70 A 4 4 0 1 1 95 70 Z" fill="#FFD700" />
            <line x1="500" y1="60" x2="500" y2="35" stroke="#FFD700" strokeWidth="2" />
            <path d="M 495 28 A 8 8 0 1 0 505 28 A 6 6 0 1 1 495 28 Z" fill="#FFD700" />
            <line x1="920" y1="100" x2="920" y2="85" stroke="#FFD700" strokeWidth="2" />
            <path d="M 915 80 A 5 5 0 1 0 925 80 A 4 4 0 1 1 915 80 Z" fill="#FFD700" />
            <path d="M 0 200 L 0 140 L 50 140 C 50 140, 60 90, 100 90 C 140 90, 150 140, 150 140 L 200 140 L 200 80 L 210 50 L 220 80 L 220 140 L 400 140 C 400 140, 420 60, 500 60 C 580 60, 600 140, 600 140 L 700 140 L 700 70 L 715 40 L 730 70 L 730 140 L 850 140 C 850 140, 870 100, 920 100 C 970 100, 990 140, 990 140 L 1000 140 L 1000 200 Z" fill="#00838F" opacity="0.6" />
            <line x1="180" y1="110" x2="180" y2="90" stroke="#FFB300" strokeWidth="3" />
            <path d="M 173 83 A 7 7 0 1 0 187 83 A 5 5 0 1 1 173 83 Z" fill="#FFB300" />
            <line x1="720" y1="80" x2="720" y2="50" stroke="#FFB300" strokeWidth="3" />
            <path d="M 710 40 A 10 10 0 1 0 730 40 A 8 8 0 1 1 710 40 Z" fill="#FFB300" />
            <path d="M 0 200 L 0 170 L 100 170 C 100 170, 120 110, 180 110 C 240 110, 260 170, 260 170 L 350 170 L 350 90 L 365 50 L 380 90 L 380 170 L 600 170 C 600 170, 630 80, 720 80 C 810 80, 840 170, 840 170 L 880 170 L 880 100 L 890 70 L 900 100 L 900 170 L 1000 170 L 1000 200 Z" fill="#006064" opacity="0.8" />
          </svg>
        </div>
      </div>

      <div className="developer-credit">
        <span className="developer-credit-icon">💻</span>
        Developed by <strong>Yasir Nawaz</strong>
      </div>

      {showStartScreen && (
        <div className="start-screen" id="startScreen">
          <div className="start-screen-content">
            <h1 className="start-title">🌟 Arabic Letter Learning Game 🌟</h1>
            <p className="start-subtitle">Learn Arabic Letters in a Fun Way!</p>

            <div className="input-group">
              <label className="input-label">Enter Your Name</label>
              <input
                ref={nameInputRef}
                type="text"
                className="name-input"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Type your name..."
                maxLength="20"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && selectedLetters.length > 0) {
                    initGame();
                  }
                }}
              />
            </div>

            <div className="letter-selector">
              <div className="selector-title">Select Letters to Practice</div>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <button className="select-all-btn" onClick={selectAllLetters}>
                  {selectedLetters.length === arabicLetters.length ? 'Deselect All' : 'Select All Letters'}
                </button>
              </div>
              <div className="letter-grid">
                {arabicLetters.map((letter, index) => (
                  <div
                    key={`${letter.arabic}-${index}`}
                    className={`letter-option ${selectedLetters.includes(index) ? 'selected' : ''}`}
                    onClick={() => toggleLetterSelection(index)}
                  >
                    <div className="letter-option-arabic" style={{ color: letter.color }}>
                      {letter.arabic}
                    </div>
                    <div className="letter-option-english">{letter.english}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="start-button" disabled={!updateStartButton} onClick={initGame}>
              Start Now
            </button>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="score-board">
          <div className="score-column">
            <div className="score-label">Score</div>
            <div className="score-value" id="score">{score}</div>
          </div>
          <div className="score-divider"></div>
          <div className="score-column" onClick={handleMistakesOpen} style={{ cursor: 'pointer' }}>
            <div className="high-score-label" style={{ borderTop: 'none', marginTop: '0', paddingTop: '0' }}>
              Mistakes
            </div>
            <div className="high-score-value">{mistakes}</div>
          </div>
        </div>

        <div className="home-button" onClick={resetGame}>
          <div className="home-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <svg viewBox="0 0 100 100" style={{ width: '85%', height: '85%', minWidth: '30px' }} xmlns="http://www.w3.org/2000/svg">
              <filter id="shadow">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
              </filter>
              <g filter="url(#shadow)">
                <rect x="65" y="15" width="12" height="30" rx="2" fill="#E64A19" />
                <rect x="62" y="12" width="18" height="6" rx="2" fill="#BF360C" />
                <path d="M20 50 v 35 a 5 5 0 0 0 5 5 h 50 a 5 5 0 0 0 5 -5 v -35 L 50 24 Z" fill="#FFF59D" />
                <circle cx="35" cy="55" r="10" fill="#81D4FA" stroke="#FFF" strokeWidth="3" />
                <path d="M35 45 v20 M25 55 h20" stroke="#FFF" strokeWidth="3" />
                <circle cx="65" cy="55" r="10" fill="#81D4FA" stroke="#FFF" strokeWidth="3" />
                <path d="M65 45 v20 M55 55 h20" stroke="#FFF" strokeWidth="3" />
                <path d="M40 90 v -20 a 10 10 0 0 1 20 0 v 20 z" fill="#8D6E63" />
                <circle cx="55" cy="80" r="3" fill="#FFD54F" />
                <path d="M10 50 L50 15 L90 50" fill="none" stroke="#FF7043" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <circle cx="71" cy="8" r="4" fill="#FFF" opacity="0.8" />
              <circle cx="78" cy="4" r="3" fill="#FFF" opacity="0.6" />
              <path d="M 15 10 Q 15 18 23 18 Q 15 18 15 26 Q 15 18 7 18 Q 15 18 15 10 Z" fill="#FFF" />
              <path d="M 85 25 Q 85 30 90 30 Q 85 30 85 35 Q 85 30 80 30 Q 85 30 85 25 Z" fill="#FFF" />
            </svg>
          </div>
        </div>

        {targetLetter && (
          <div className="target-frame">
            <div className="target-frame-inner"></div>
            <div className="target-label">Find the Letter</div>
            <div className="target-letter" style={{ color: targetLetter.color }}>{targetLetter.arabic}</div>
            <div className="target-pronunciation">{targetLetter.english}</div>
          </div>
        )}

        {roundLetters.length > 0 && (
          <div className="letter-container">
            {roundLetters.map((letter) => (
              <div
                key={letter.id}
                className={`letter-circle ${letter.status || ''}`}
                onClick={() => handleLetterClick(letter)}
                style={{ animationDelay: `${Math.random() * 0.3}s` }}
              >
                <div className="letter-arabic" style={{ color: letter.color }}>{letter.arabic}</div>
                <div className="letter-english">{letter.english}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {feedback.visible && (
        <div className="feedback show" style={{ color: feedback.color, borderColor: feedback.color }}>
          {feedback.text}
        </div>
      )}

      {showMistakesModal && (
        <div className="modal show" onClick={(event) => event.target === event.currentTarget && setShowMistakesModal(false)}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowMistakesModal(false)}>
              &times;
            </span>
            <h2 className="modal-title">Letters to Practice More</h2>
            <div className="mistakes-grid" style={{ display: modalMistakeItems.length > 0 ? 'grid' : 'none' }}>
              {modalMistakeItems.map((letter) => (
                <div key={`${letter.arabic}-mistake`} className="mistake-item">
                  <div className="mistake-arabic" style={{ color: letter.color }}>{letter.arabic}</div>
                  <div className="mistake-english">{letter.english}</div>
                </div>
              ))}
            </div>
            {modalMistakeItems.length === 0 && (
              <p style={{ textAlign: 'center', color: '#FFF', fontSize: '1.2em' }}>
                Great job! You haven't made any mistakes yet.
              </p>
            )}
          </div>
        </div>
      )}

      {showVictoryModal && (
        <div className="modal show" onClick={(event) => event.target === event.currentTarget && handleQuit()}>
          <div className="modal-content victory-content">
            <h2 className="victory-title">🎉 Masha'Allah! 🎉</h2>
            <h3 className="victory-subtitle">Great Job, {playerName}!</h3>

            <div className="victory-stats">
              <div className="stat-card">
                <span className="stat-label">Score</span>
                <span className="stat-value">100 / 100</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Mistakes</span>
                <span className="stat-value">{mistakes}</span>
              </div>
            </div>

            <div className="victory-remarks-box">
              <div className="remarks-label">Teacher's Remarks:</div>
              <div className="remarks-value">
                {mistakes === 0
                  ? "⭐ Subhan'Allah! Perfect Practice with Zero Mistakes! ⭐"
                  : mistakes <= 2
                    ? "🌟 Masha'Allah! Excellent practice, nearly perfect! 🌟"
                    : mistakes <= 5
                      ? "👍 Alhamdulillah! Great practice. Keep aiming for zero mistakes! 👍"
                      : "📚 Well tried! Practice more to improve your score and reduce mistakes! 📚"}
              </div>
            </div>

            {mistakesHistory.length > 0 && (
              <div className="victory-mistakes-box">
                <div className="remarks-label" style={{ color: '#FF6347' }}>Letters to Practice More:</div>
                <div className="victory-mistakes-grid">
                  {mistakesHistory.map((letter) => (
                    <div key={`${letter.arabic}-victory`} className="victory-mistake-item">
                      <div className="victory-mistake-arabic" style={{ color: letter.color }}>{letter.arabic}</div>
                      <div className="victory-mistake-english">{letter.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="victory-actions">
              <button className="quit-btn" onClick={handleQuit}>Quit 🚪</button>
              <button className="play-again-btn" onClick={handlePlayAgain}>Play Again 🔁</button>
            </div>
          </div>
        </div>
      )}

      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: piece.left,
            top: piece.top,
            background: piece.color,
            animationDelay: piece.delay,
            transform: `translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`,
          }}
        />
      ))}
    </>
  );
}

export default App;
