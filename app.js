// Arabic Letters with English Pronunciations
const arabicLetters = [
    { arabic: 'ا', english: 'Alif', color: '#ffffff' },
    { arabic: 'ب', english: 'Baa', color: '#ffffff' },
    { arabic: 'ت', english: 'Taa', color: '#ffffff' },
    { arabic: 'ث', english: 'Saa', color: '#ffffff' },
    { arabic: 'ج', english: 'Jeem', color: '#ffffff' },
    { arabic: 'ح', english: 'Haa', color: '#ffffff' },
    { arabic: 'خ', english: 'Khaa', color: '#ffffff' },  // Mustaliya - Gold
    { arabic: 'د', english: 'Daal', color: '#ffffff' },
    { arabic: 'ذ', english: 'Zaal', color: '#ffffff' },
    { arabic: 'ر', english: 'Raa', color: '#ffffff' },
    { arabic: 'ز', english: 'Zaa', color: '#ffffff' },
    { arabic: 'س', english: 'Seen', color: '#ffffff' },
    { arabic: 'ش', english: 'Sheen', color: '#ffffff' },
    { arabic: 'ص', english: 'Saad', color: '#ffffff' },  // Mustaliya - Red
    { arabic: 'ض', english: 'Daad', color: '#ffffff' },  // Mustaliya - Cyan
    { arabic: 'ط', english: 'Taa', color: '#ffffff' },   // Mustaliya - Orange
    { arabic: 'ظ', english: 'Zaw', color: '#ffffff' },  // Mustaliya - Deep Pink
    { arabic: 'ع', english: 'Ayn', color: '#ffffff' },
    { arabic: 'غ', english: 'Ghayn', color: '#ffffff' }, // Mustaliya - Purple
    { arabic: 'ف', english: 'Faa', color: '#ffffff' },
    { arabic: 'ق', english: 'Qaaf', color: '#ffffff' },  // Mustaliya - Lime Green
    { arabic: 'ك', english: 'Kaaf', color: '#ffffff' },
    { arabic: 'ل', english: 'Laam', color: '#ffffff' },
    { arabic: 'م', english: 'Meem', color: '#ffffff' },
    { arabic: 'ن', english: 'Noon', color: '#ffffff' },
    { arabic: 'ه', english: 'Haa', color: '#ffffff' },
    { arabic: 'و', english: 'Waaw', color: '#ffffff' },
    { arabic: 'ء', english: 'Hamza', color: '#ffffff' },
    { arabic: 'ي', english: 'Yaa', color: '#ffffff' }
];

// Game State
let score = 0;
let mistakes = 0;
let mistakesHistory = [];
let targetLetter = null;
let gameActive = false;
let playerName = '';
let selectedLetters = [];
let correctAnswers = 0;
let sessionLettersPool = [];

// DOM Elements
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerName');
const letterGrid = document.getElementById('letterGrid');
const selectAllBtn = document.getElementById('selectAllBtn');
const letterContainer = document.getElementById('letterContainer');
const targetLetterEl = document.getElementById('targetLetter');
const targetPronunciationEl = document.getElementById('targetPronunciation');
const scoreEl = document.getElementById('score');
const mistakesEl = document.getElementById('mistakes');
const mistakesContainer = document.getElementById('mistakesContainer');
const homeButton = document.getElementById('homeButton');
const feedbackEl = document.getElementById('feedback');

// Modal Elements
const mistakesModal = document.getElementById('mistakesModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const mistakesGrid = document.getElementById('mistakesGrid');
const noMistakesMsg = document.getElementById('noMistakesMsg');

// Victory Modal Elements
const victoryModal = document.getElementById('victoryModal');
const victoryName = document.getElementById('victoryName');
const victoryScore = document.getElementById('victoryScore');
const victoryMistakes = document.getElementById('victoryMistakes');
const victoryRemarks = document.getElementById('victoryRemarks');
const victoryMistakesBox = document.getElementById('victoryMistakesBox');
const victoryMistakesGrid = document.getElementById('victoryMistakesGrid');
const playAgainBtn = document.getElementById('playAgainBtn');
const quitBtn = document.getElementById('quitBtn');

// Update mistakes display
function updateMistakes() {
    mistakesEl.textContent = mistakes;
}

// Initialize Letter Grid
function initLetterGrid() {
    letterGrid.innerHTML = '';
    arabicLetters.forEach((letter, index) => {
        const option = document.createElement('div');
        option.className = 'letter-option';
        option.dataset.index = index;
        option.innerHTML = `
            <div class="letter-option-arabic" style="color: ${letter.color};">${letter.arabic}</div>
            <div class="letter-option-english">${letter.english}</div>
        `;
        option.addEventListener('click', () => toggleLetterSelection(option, index));
        letterGrid.appendChild(option);
    });
}

// Toggle Letter Selection
function toggleLetterSelection(element, index) {
    element.classList.toggle('selected');
    const letterIndex = selectedLetters.indexOf(index);
    if (letterIndex > -1) {
        selectedLetters.splice(letterIndex, 1);
    } else {
        selectedLetters.push(index);
    }
    updateStartButton();
}

// Select All Letters
selectAllBtn.addEventListener('click', () => {
    const allOptions = letterGrid.querySelectorAll('.letter-option');
    const allSelected = selectedLetters.length === arabicLetters.length;
    
    if (allSelected) {
        allOptions.forEach(opt => opt.classList.remove('selected'));
        selectedLetters = [];
        selectAllBtn.textContent = 'Select All Letters';
    } else {
        allOptions.forEach((opt, idx) => {
            opt.classList.add('selected');
        });
        selectedLetters = arabicLetters.map((_, idx) => idx);
        selectAllBtn.textContent = 'Deselect All';
    }
    updateStartButton();
});

// Update Start Button State
function updateStartButton() {
    if (selectedLetters.length > 0) {
        startButton.disabled = false;
    } else {
        startButton.disabled = true;
    }
}

// Initialize Game
function initGame() {
    playerName = playerNameInput.value.trim() || 'Student';
    
    if (selectedLetters.length === 0) {
        alert('Please select at least one letter to practice!');
        return;
    }

    // Reset score, mistakes, and pool
    mistakes = 0;
    mistakesHistory = [];
    correctAnswers = 0;
    sessionLettersPool = [...selectedLetters];
    updateMistakes();

    startScreen.classList.add('hidden');
    gameActive = true;
    score = 0;
    updateScore();
    startNewRound();
}

// Start New Round
function startNewRound() {
    if (!gameActive || sessionLettersPool.length === 0) return;

    // Select random letter from remaining pool and remove it
    const randomPoolIndex = Math.floor(Math.random() * sessionLettersPool.length);
    const letterIndex = sessionLettersPool.splice(randomPoolIndex, 1)[0];
    targetLetter = arabicLetters[letterIndex];
    
    targetLetterEl.textContent = targetLetter.arabic;
    targetLetterEl.style.color = targetLetter.color;
    targetPronunciationEl.textContent = targetLetter.english;

    // Create letter circles
    createLetterCircles();
}

// Create Letter Circles
function createLetterCircles() {
    letterContainer.innerHTML = '';

    // Create array of letters
    const letters = [];

    // Add target letter exactly once (unique in container)
    letters.push(targetLetter);

    // Determine available distractors
    let distractors = selectedLetters
        .map(idx => arabicLetters[idx])
        .filter(l => l.arabic !== targetLetter.arabic);

    // If no other selected letters, fall back to all other arabic letters
    if (distractors.length === 0) {
        distractors = arabicLetters.filter(l => l.arabic !== targetLetter.arabic);
    }

    const totalLetters = window.innerWidth <= 768 ? 12 : 18;
    const neededDistractorsCount = totalLetters - 1;

    // Fill letters array with unique distractors as much as possible
    // Shuffle the distractors first
    let shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
    let distractorIndex = 0;

    for (let i = 0; i < neededDistractorsCount; i++) {
        // If we ran out of unique distractors, reshuffle and start over
        if (distractorIndex >= shuffledDistractors.length) {
            shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
            distractorIndex = 0;
        }
        letters.push(shuffledDistractors[distractorIndex]);
        distractorIndex++;
    }

    // Shuffle letters
    letters.sort(() => Math.random() - 0.5);

    // Create letter elements with staggered animation
    letters.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-circle';
        letterDiv.innerHTML = `
            <div class="letter-arabic" style="color: ${letter.color};">${letter.arabic}</div>
            <div class="letter-english">${letter.english}</div>
        `;
        letterDiv.dataset.arabic = letter.arabic;
        letterDiv.style.animationDelay = (index * 0.05) + 's';

        letterDiv.addEventListener('click', () => handleLetterClick(letterDiv));

        letterContainer.appendChild(letterDiv);
    });
}

// Handle Letter Click
function handleLetterClick(letterDiv) {
    if (!gameActive || letterDiv.classList.contains('correct') || letterDiv.classList.contains('wrong')) {
        return;
    }

    const clickedLetter = letterDiv.dataset.arabic;

    if (clickedLetter === targetLetter.arabic) {
        // Correct Answer
        letterDiv.classList.add('correct');
        correctAnswers++;
        
        // Calculate dynamic score
        score = Math.round((correctAnswers / selectedLetters.length) * 100);
        updateScore();
        
        createConfetti(letterDiv);

        if (sessionLettersPool.length === 0) {
            // Generate remarks based on mistakes
            let remarks = "";
            if (mistakes === 0) {
                remarks = "⭐ Subhan'Allah! Perfect Practice with Zero Mistakes! ⭐";
            } else if (mistakes <= 2) {
                remarks = "🌟 Masha'Allah! Excellent practice, nearly perfect! 🌟";
            } else if (mistakes <= 5) {
                remarks = "👍 Alhamdulillah! Great practice. Keep aiming for zero mistakes! 👍";
            } else {
                remarks = "📚 Well tried! Practice more to improve your score and reduce mistakes! 📚";
            }

            // Populate Victory Modal
            victoryName.textContent = `Great Job, ${playerName}!`;
            victoryScore.textContent = `100 / 100`;
            victoryMistakes.textContent = mistakes;
            victoryRemarks.textContent = remarks;

            // Populate Victory Modal Mistakes list
            victoryMistakesGrid.innerHTML = '';
            if (mistakesHistory.length > 0) {
                victoryMistakesBox.style.display = 'block';
                mistakesHistory.forEach(letter => {
                    const item = document.createElement('div');
                    item.className = 'victory-mistake-item';
                    item.innerHTML = `
                        <div class="victory-mistake-arabic" style="color: ${letter.color};">${letter.arabic}</div>
                        <div class="victory-mistake-english">${letter.english}</div>
                    `;
                    victoryMistakesGrid.appendChild(item);
                });
            } else {
                victoryMistakesBox.style.display = 'none';
            }

            // Multi-blast confetti
            for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                    createConfetti(letterDiv);
                }, j * 300);
            }

            // Show victory modal after a brief delay
            setTimeout(() => {
                victoryModal.classList.add('show');
            }, 1000);
        } else {
            showFeedback(`Excellent, ${playerName}!`, '#28a745', 1200);
            // Play next round after delay
            setTimeout(() => {
                startNewRound();
            }, 1400);
        }

    } else {
        // Wrong Answer
        letterDiv.classList.add('wrong');
        mistakes++;
        updateMistakes();
        
        // Add to history if not already there
        if (!mistakesHistory.some(l => l.arabic === clickedLetter)) {
            const letterObj = arabicLetters.find(l => l.arabic === clickedLetter);
            if (letterObj) {
                mistakesHistory.push(letterObj);
            }
        }
        
        showFeedback(`Try Again, ${playerName}!`, '#dc3545', 1200);

        setTimeout(() => {
            letterDiv.classList.remove('wrong');
            
            // Replace with a new different random letter (that is also not the target letter)
            let availableLetters = selectedLetters
                .map(idx => arabicLetters[idx])
                .filter(l => l.arabic !== clickedLetter && l.arabic !== targetLetter.arabic);
                
            if (availableLetters.length === 0) {
                availableLetters = arabicLetters.filter(l => l.arabic !== clickedLetter && l.arabic !== targetLetter.arabic);
            }
                
            if (availableLetters.length > 0) {
                const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
                
                // Add a small fade-in effect when replacing
                letterDiv.style.opacity = '0';
                setTimeout(() => {
                    letterDiv.innerHTML = `
                        <div class="letter-arabic" style="color: ${randomLetter.color};">${randomLetter.arabic}</div>
                        <div class="letter-english">${randomLetter.english}</div>
                    `;
                    letterDiv.dataset.arabic = randomLetter.arabic;
                    letterDiv.style.transition = 'opacity 0.3s ease';
                    letterDiv.style.opacity = '1';
                }, 150);
            }
        }, 600);
    }
}

// Update Score
function updateScore() {
    scoreEl.textContent = score;
    scoreEl.style.animation = 'none';
    setTimeout(() => {
        scoreEl.style.animation = 'correctBounce 0.5s ease';
    }, 10);
}

// Show Feedback
function showFeedback(message, color, duration = 1500) {
    feedbackEl.textContent = message;
    feedbackEl.style.color = color;
    feedbackEl.style.borderColor = color;
    feedbackEl.classList.add('show');

    setTimeout(() => {
        feedbackEl.classList.remove('show');
    }, duration);
}

// Create Confetti
function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 0.3) + 's';

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 100 + Math.random() * 100;

        document.body.appendChild(confetti);

        confetti.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity + 200}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// Reset Game
function resetGame() {
    gameActive = false;
    
    score = 0;
    mistakes = 0;
    correctAnswers = 0;
    sessionLettersPool = [];
    mistakesHistory = [];
    updateScore();
    updateMistakes();
    letterContainer.innerHTML = '';
    startScreen.classList.remove('hidden');
}

// Event Listeners
startButton.addEventListener('click', initGame);
homeButton.addEventListener('click', resetGame);

// Mistakes Modal Listeners
mistakesContainer.addEventListener('click', () => {
    mistakesGrid.innerHTML = '';
    if (mistakesHistory.length === 0) {
        mistakesGrid.style.display = 'none';
        noMistakesMsg.style.display = 'block';
    } else {
        mistakesGrid.style.display = 'grid';
        noMistakesMsg.style.display = 'none';
        mistakesHistory.forEach(letter => {
            const div = document.createElement('div');
            div.className = 'mistake-item';
            div.innerHTML = `
                <div class="mistake-arabic" style="color: ${letter.color};">${letter.arabic}</div>
                <div class="mistake-english">${letter.english}</div>
            `;
            mistakesGrid.appendChild(div);
        });
    }
    mistakesModal.classList.add('show');
});

mistakesContainer.style.cursor = 'pointer';

closeModalBtn.addEventListener('click', () => {
    mistakesModal.classList.remove('show');
});

mistakesModal.addEventListener('click', (e) => {
    if (e.target === mistakesModal) {
        mistakesModal.classList.remove('show');
    }
});

// Victory Modal Listeners
playAgainBtn.addEventListener('click', () => {
    victoryModal.classList.remove('show');
    initGame();
});

quitBtn.addEventListener('click', () => {
    victoryModal.classList.remove('show');
    resetGame();
});

victoryModal.addEventListener('click', (e) => {
    if (e.target === victoryModal) {
        victoryModal.classList.remove('show');
        resetGame();
    }
});

// Initialize
initLetterGrid();
updateStartButton();

// Auto-focus name input
playerNameInput.focus();

// Enter key to start
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && selectedLetters.length > 0) {
        initGame();
    }
});