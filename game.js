const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const board = document.getElementById("board");
const routePath = document.getElementById("routePath");

const playerNameInput = document.getElementById("playerName");
const characterCards = document.querySelectorAll(".selectable-character");

const playerInfo = document.getElementById("playerInfo");
const characterInfo = document.getElementById("characterInfo");
const characterPreview = document.getElementById("characterPreview");
const levelInfo = document.getElementById("levelInfo");
const positionInfo = document.getElementById("positionInfo");
const scoreInfo = document.getElementById("scoreInfo");

const rollDiceButton = document.getElementById("rollDiceButton");
const diceResult = document.getElementById("diceResult");

const questionModal = document.getElementById("questionModal");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const answerOptions = document.getElementById("answerOptions");
const questionFeedback = document.getElementById("questionFeedback");

const levelTitle = document.getElementById("levelTitle");
const levelModal = document.getElementById("levelModal");
const levelModalTitle = document.getElementById("levelModalTitle");
const levelModalText = document.getElementById("levelModalText");
const nextLevelButton = document.getElementById("nextLevelButton");
const restartGameButton = document.getElementById("restartGameButton");
const backHomeButton = document.getElementById("backHomeButton");

const leaderboardList = document.getElementById("leaderboardList");
const instructionsButton = document.getElementById("instructionsButton");
const instructionsModal = document.getElementById("instructionsModal");
const closeInstructionsButton = document.getElementById("closeInstructionsButton");
const clearScoresButton = document.getElementById("clearScoresButton");
const musicButton = document.getElementById("musicButton");

const LOCAL_SCORES_KEY = "hakuSamaelScores";

let selectedCharacter = "";
let selectedPlayer = "";
let selectedImage = "";
let playerName = "";
let playerPosition = 1;
let score = 0;

let pendingPosition = 1;
let pendingDice = 0;
let currentQuestion = null;
let currentQuestionType = "";

let currentLevel = 1;
const maxLevel = 2;

const levelNames = {
    1: "Aventura del conocimiento",
    2: "Desafío de los sabios"
};

const characterSprites = {
    haku: {
        idle: "img/haku-idle.png",
        walk: "img/haku-walk.png",
        win: "img/haku-win.png"
    },
    samael: {
        idle: "img/samael-idle.png",
        walk: "img/samael-walk.png",
        win: "img/samael-alert.png"
    }
};

let usedQuestions = {
    math: [],
    spanish: [],
    science: [],
    bonus: [],
    challenge: [],
    goal: []
};

const gameSounds = {
    music: new Audio("sounds/bg-music.mp3"),
    dice: new Audio("sounds/dice.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    wrong: new Audio("sounds/wrong.mp3"),
    duck: new Audio("sounds/duck.mp3"),
    dog: new Audio("sounds/dog.mp3")
};

gameSounds.music.loop = true;
gameSounds.music.volume = 0.08;

gameSounds.dice.volume = 0.55;
gameSounds.correct.volume = 0.55;
gameSounds.wrong.volume = 0.55;
gameSounds.duck.volume = 0.55;
gameSounds.dog.volume = 0.55;

let musicEnabled = false;
let audioUnlocked = false;
let lastCharacterSoundTime = 0;

const cells = [
    { number: 1, type: "start", icon: "🚩", text: "Inicio", x: 90, y: 665, angle: -6 },
    { number: 2, type: "math", icon: "➕", text: "Mate", x: 180, y: 665, angle: 2 },
    { number: 3, type: "spanish", icon: "📖", text: "Español", x: 270, y: 665, angle: -2 },
    { number: 4, type: "science", icon: "🌎", text: "Ciencias", x: 360, y: 665, angle: 2 },
    { number: 5, type: "challenge", icon: "❓", text: "Reto", x: 450, y: 665, angle: -1 },
    { number: 6, type: "math", icon: "🧮", text: "Mate", x: 540, y: 665, angle: 1 },
    { number: 7, type: "spanish", icon: "✏️", text: "Español", x: 630, y: 665, angle: -2 },
    { number: 8, type: "science", icon: "🌱", text: "Ciencias", x: 720, y: 665, angle: 2 },
    { number: 9, type: "bonus", icon: "⭐", text: "Bono", x: 810, y: 665, angle: -1 },
    { number: 10, type: "math", icon: "➗", text: "Mate", x: 900, y: 665, angle: 2 },
    { number: 11, type: "challenge", icon: "🎲", text: "Reto", x: 990, y: 665, angle: -2 },
    { number: 12, type: "spanish", icon: "🔤", text: "Español", x: 1080, y: 665, angle: 6 },

    { number: 13, type: "science", icon: "🔬", text: "Ciencias", x: 1100, y: 555, angle: 8 },
    { number: 14, type: "bonus", icon: "🎁", text: "Bono", x: 1100, y: 455, angle: 4 },
    { number: 15, type: "challenge", icon: "❓", text: "Reto", x: 1100, y: 355, angle: 0 },
    { number: 16, type: "math", icon: "🧮", text: "Mate", x: 1100, y: 255, angle: -4 },
    { number: 17, type: "science", icon: "💧", text: "Ciencias", x: 1100, y: 155, angle: -8 },
    { number: 18, type: "spanish", icon: "📚", text: "Español", x: 1070, y: 75, angle: -10 },

    { number: 19, type: "bonus", icon: "⭐", text: "Bono", x: 980, y: 75, angle: 2 },
    { number: 20, type: "challenge", icon: "🎲", text: "Reto", x: 890, y: 75, angle: -1 },
    { number: 21, type: "science", icon: "🌿", text: "Ciencias", x: 800, y: 75, angle: 1 },
    { number: 22, type: "math", icon: "✖️", text: "Mate", x: 710, y: 75, angle: -2 },
    { number: 23, type: "spanish", icon: "📘", text: "Español", x: 620, y: 75, angle: 1 },
    { number: 24, type: "bonus", icon: "🌟", text: "Bono", x: 530, y: 75, angle: -1 },
    { number: 25, type: "science", icon: "☀️", text: "Ciencias", x: 440, y: 75, angle: 2 },
    { number: 26, type: "challenge", icon: "❓", text: "Reto", x: 350, y: 75, angle: -2 },
    { number: 27, type: "math", icon: "➖", text: "Mate", x: 260, y: 75, angle: 2 },
    { number: 28, type: "spanish", icon: "📖", text: "Español", x: 170, y: 85, angle: -8 },

    { number: 29, type: "science", icon: "🌎", text: "Ciencias", x: 90, y: 185, angle: -8 },
    { number: 30, type: "bonus", icon: "⭐", text: "Bono", x: 90, y: 295, angle: -4 },
    { number: 31, type: "challenge", icon: "🎲", text: "Reto", x: 90, y: 405, angle: 2 },
    { number: 32, type: "math", icon: "➕", text: "Mate", x: 120, y: 530, angle: 8 },

    { number: 33, type: "spanish", icon: "🔤", text: "Español", x: 300, y: 570, angle: -2 },
    { number: 34, type: "science", icon: "🔬", text: "Ciencias", x: 430, y: 570, angle: 1 },
    { number: 35, type: "bonus", icon: "🎁", text: "Bono", x: 560, y: 570, angle: -1 },
    { number: 36, type: "goal", icon: "🏆", text: "Meta", x: 700, y: 570, angle: 3 }
];

const questionBank = {
    math: [
        { question: "¿Cuánto es 5 + 3?", options: ["6", "7", "8", "9"], answer: "8" },
        { question: "¿Cuánto es 10 - 4?", options: ["5", "6", "7", "8"], answer: "6" },
        { question: "¿Cuánto es 3 x 4?", options: ["7", "10", "12", "14"], answer: "12" },
        { question: "¿Qué número sigue? 2, 4, 6, 8, __", options: ["9", "10", "11", "12"], answer: "10" },
        { question: "¿Cuánto es 20 ÷ 4?", options: ["4", "5", "6", "8"], answer: "5" }
    ],
    spanish: [
        { question: "¿Cuál palabra está escrita correctamente?", options: ["Kasa", "Casa", "Cassa", "Kaza"], answer: "Casa" },
        { question: "¿Cuál es una vocal?", options: ["B", "M", "A", "S"], answer: "A" },
        { question: "¿Cuál palabra es un sustantivo?", options: ["Correr", "Bonito", "Perro", "Rápido"], answer: "Perro" },
        { question: "¿Cuál signo se usa para hacer una pregunta?", options: ["¿?", "¡!", "...", ","], answer: "¿?" },
        { question: "¿Cuál palabra está en plural?", options: ["Niño", "Casa", "Perros", "Flor"], answer: "Perros" }
    ],
    science: [
        { question: "¿Qué necesita una planta para crecer?", options: ["Agua", "Piedras", "Plástico", "Metal"], answer: "Agua" },
        { question: "¿Cuál es el planeta donde vivimos?", options: ["Marte", "Tierra", "Venus", "Júpiter"], answer: "Tierra" },
        { question: "¿Qué animal es un mamífero?", options: ["Perro", "Pez", "Mariposa", "Rana"], answer: "Perro" },
        { question: "¿Cuál es una fuente natural de luz?", options: ["Sol", "Mesa", "Libro", "Zapato"], answer: "Sol" },
        { question: "¿Qué usamos para respirar?", options: ["Pulmones", "Oídos", "Manos", "Pies"], answer: "Pulmones" }
    ],
    bonus: [
        { question: "Casilla de bono: ¿cuánto es 2 + 2?", options: ["2", "3", "4", "5"], answer: "4" },
        { question: "Casilla de bono: ¿qué palabra empieza con la letra M?", options: ["Sol", "Mesa", "Casa", "Perro"], answer: "Mesa" },
        { question: "Casilla de bono: ¿qué usamos para respirar?", options: ["Pulmones", "Oídos", "Manos", "Pies"], answer: "Pulmones" }
    ],
    challenge: [
        { question: "Reto: ¿cuánto es 15 - 7?", options: ["6", "7", "8", "9"], answer: "8" },
        { question: "Reto: ¿cuál es el plural de 'lápiz'?", options: ["Lápizs", "Lápices", "Lapizes", "Lápiz"], answer: "Lápices" },
        { question: "Reto: ¿qué estado del agua es el hielo?", options: ["Líquido", "Sólido", "Gas", "Vapor"], answer: "Sólido" },
        { question: "Reto: ¿cuánto es 6 x 5?", options: ["20", "25", "30", "35"], answer: "30" }
    ],
    goal: [
        { question: "Pregunta final: ¿cuánto es 6 x 3?", options: ["12", "15", "18", "21"], answer: "18" },
        { question: "Pregunta final: ¿cuál palabra está bien escrita?", options: ["Niño", "Ninyo", "Ninio", "Niñio"], answer: "Niño" },
        { question: "Pregunta final: ¿cuál es el planeta donde vivimos?", options: ["Tierra", "Marte", "Saturno", "Mercurio"], answer: "Tierra" }
    ]
};

const questionBankLevel2 = {
    math: [
        { question: "¿Cuánto es 12 + 15?", options: ["25", "26", "27", "28"], answer: "27" },
        { question: "¿Cuánto es 9 x 6?", options: ["45", "54", "56", "63"], answer: "54" },
        { question: "¿Cuánto es 72 ÷ 8?", options: ["7", "8", "9", "10"], answer: "9" },
        { question: "Si tienes 3 bolsas con 8 dulces cada una, ¿cuántos dulces tienes?", options: ["18", "21", "24", "30"], answer: "24" }
    ],
    spanish: [
        { question: "¿Cuál es el sujeto en la oración: 'El perro corre en el parque'?", options: ["Corre", "El perro", "En el parque", "Parque"], answer: "El perro" },
        { question: "¿Cuál palabra es un adjetivo?", options: ["Mesa", "Correr", "Grande", "Niño"], answer: "Grande" },
        { question: "¿Cuál palabra está escrita correctamente?", options: ["Árvol", "Árbol", "Arvol", "Arbol"], answer: "Árbol" },
        { question: "¿Cuál es el plural de 'pez'?", options: ["Pezes", "Peces", "Pezs", "Pez"], answer: "Peces" }
    ],
    science: [
        { question: "¿Qué órgano bombea la sangre en el cuerpo?", options: ["Pulmón", "Cerebro", "Corazón", "Estómago"], answer: "Corazón" },
        { question: "¿Cuál es el estado del agua cuando se convierte en vapor?", options: ["Sólido", "Líquido", "Gaseoso", "Frío"], answer: "Gaseoso" },
        { question: "¿Qué planeta es conocido como el planeta rojo?", options: ["Venus", "Marte", "Júpiter", "Saturno"], answer: "Marte" },
        { question: "¿Qué parte de la planta absorbe agua del suelo?", options: ["Flor", "Tallo", "Raíz", "Hoja"], answer: "Raíz" }
    ],
    bonus: [
        { question: "Bono: ¿cuánto es 25 + 25?", options: ["40", "45", "50", "55"], answer: "50" },
        { question: "Bono: ¿cuál es el antónimo de 'alto'?", options: ["Grande", "Bajo", "Largo", "Fuerte"], answer: "Bajo" },
        { question: "Bono: ¿qué gas necesitan las personas para respirar?", options: ["Oxígeno", "Hidrógeno", "Helio", "Nitrógeno"], answer: "Oxígeno" }
    ],
    challenge: [
        { question: "Reto: ¿cuánto es 100 - 37?", options: ["53", "63", "67", "73"], answer: "63" },
        { question: "Reto: ¿qué tipo de palabra es 'rápidamente'?", options: ["Sustantivo", "Verbo", "Adverbio", "Artículo"], answer: "Adverbio" },
        { question: "Reto: ¿qué movimiento de la Tierra produce el día y la noche?", options: ["Traslación", "Rotación", "Evaporación", "Inclinación"], answer: "Rotación" }
    ],
    goal: [
        { question: "Pregunta final: ¿cuánto es 11 x 7?", options: ["67", "77", "87", "97"], answer: "77" },
        { question: "Pregunta final: ¿cuál es el sujeto en 'La niña lee un cuento'?", options: ["Lee", "Un cuento", "La niña", "Cuento"], answer: "La niña" },
        { question: "Pregunta final: ¿cuál es el planeta más cercano al Sol?", options: ["Venus", "Mercurio", "Tierra", "Marte"], answer: "Mercurio" }
    ]
};

const typeTitles = {
    start: "Inicio",
    math: "Matemáticas",
    spanish: "Español",
    science: "Ciencias",
    bonus: "Bono",
    challenge: "Reto",
    goal: "Meta"
};

characterCards.forEach(function (card) {
    card.addEventListener("click", function () {
        characterCards.forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedCharacter = card.dataset.character;
        selectedPlayer = card.dataset.player;
        selectedImage = characterSprites[selectedPlayer].idle;

        playSound("click");
    });
});

startButton.addEventListener("click", function () {
    playerName = playerNameInput.value.trim();

    if (playerName === "") {
        alert("Por favor escribe el nombre del jugador.");
        return;
    }

    if (selectedCharacter === "") {
        alert("Por favor selecciona a Haku o Samael.");
        return;
    }

    playSound("click");

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    currentLevel = 1;
    playerPosition = 1;
    score = 0;
    pendingPosition = 1;
    pendingDice = 0;

    diceResult.textContent = "Dado: -";
    rollDiceButton.disabled = false;

    resetUsedQuestions();
    updateLevelDesign();
    createBoard();
    drawRoute();
    updateGameInfo();
    placePlayerToken(playerPosition);
});

rollDiceButton.addEventListener("click", function () {
    rollDice();
});

nextLevelButton.addEventListener("click", function () {
    playSound("click");
    startNextLevel();
});

restartGameButton.addEventListener("click", function () {
    playSound("click");
    restartGame();
});

backHomeButton.addEventListener("click", function () {
    playSound("click");
    returnToStartScreen();
});

instructionsButton.addEventListener("click", function () {
    playSound("click");
    instructionsModal.classList.remove("hidden");
});

closeInstructionsButton.addEventListener("click", function () {
    playSound("click");
    instructionsModal.classList.add("hidden");
});

clearScoresButton.addEventListener("click", function () {
    clearScores();
});

musicButton.addEventListener("click", function () {
    toggleMusic();
});

function unlockAudio() {
    if (audioUnlocked) {
        return;
    }

    Object.values(gameSounds).forEach(function (sound) {
        if (sound) {
            sound.load();
        }
    });

    audioUnlocked = true;
}

function playSound(type) {
    unlockAudio();

    const sound = gameSounds[type];

    if (!sound) {
        return;
    }

    sound.currentTime = 0;

    sound.play().catch(function () {
        console.log("El navegador bloqueó temporalmente el sonido:", type);
    });
}

function toggleMusic() {
    unlockAudio();

    if (musicEnabled) {
        gameSounds.music.pause();
        musicButton.textContent = "🎵 Música: OFF";
        musicEnabled = false;
    } else {
        gameSounds.music.play()
            .then(function () {
                musicButton.textContent = "🎵 Música: ON";
                musicEnabled = true;
            })
            .catch(function () {
                alert("Haz clic nuevamente para activar la música.");
            });
    }
}

function playCharacterMoveSound() {
    const now = Date.now();

    if (now - lastCharacterSoundTime < 650) {
        return;
    }

    if (selectedPlayer === "haku") {
        playSound("duck");
    } else if (selectedPlayer === "samael") {
        playSound("dog");
    }

    lastCharacterSoundTime = now;
}

function createBoard() {
    const oldCells = document.querySelectorAll(".cell");

    oldCells.forEach(function (cell) {
        cell.remove();
    });

    cells.forEach(function (cell) {
        const cellElement = document.createElement("div");

        cellElement.classList.add("cell");
        cellElement.classList.add(`cell-${cell.type}`);

        cellElement.style.left = `${cell.x}px`;
        cellElement.style.top = `${cell.y}px`;
        cellElement.style.setProperty("--angle", `${cell.angle}deg`);

        cellElement.id = `cell-${cell.number}`;

        cellElement.innerHTML = `
            <span class="cell-number">${cell.number}</span>
            <span class="cell-icon">${cell.icon}</span>
            <span class="cell-text">${cell.text}</span>
        `;

        board.appendChild(cellElement);
    });
}

function drawRoute() {
    const points = cells.map(function (cell) {
        return `${cell.x},${cell.y}`;
    }).join(" ");

    routePath.setAttribute("points", points);
}

function updateGameInfo() {
    playerInfo.textContent = playerName;
    characterInfo.textContent = selectedCharacter || "Sin seleccionar";
    levelInfo.textContent = currentLevel;
    positionInfo.textContent = playerPosition;
    scoreInfo.textContent = score;

    if (selectedImage) {
        characterPreview.innerHTML = `
            <img src="${selectedImage}" alt="${selectedCharacter}" class="character-mini">
        `;
    } else {
        characterPreview.innerHTML = "";
    }
}

function placePlayerToken(cellNumber, pose = "idle") {
    const oldToken = document.getElementById("playerToken");

    if (oldToken) {
        oldToken.remove();
    }

    const oldPlayerCell = document.querySelector(".player-cell");

    if (oldPlayerCell) {
        oldPlayerCell.classList.remove("player-cell");
    }

    const currentCell = document.getElementById(`cell-${cellNumber}`);

    if (!currentCell) {
        return;
    }

    currentCell.classList.add("player-cell");

    const token = document.createElement("div");
    token.id = "playerToken";
    token.classList.add("player-token");

    if (pose === "walk") {
        token.classList.add("moving");
    }

    let sprite = selectedImage;

    if (selectedPlayer && characterSprites[selectedPlayer][pose]) {
        sprite = characterSprites[selectedPlayer][pose];
    }

    if (sprite) {
        token.innerHTML = `<img src="${sprite}" alt="${selectedCharacter}">`;
    } else {
        token.textContent = "?";
    }

    currentCell.appendChild(token);
}

function rollDice() {
    if (playerPosition >= 36) {
        alert("Ya llegaste a la meta.");
        return;
    }

    rollDiceButton.disabled = true;
    playSound("dice");

    const diceNumber = Math.floor(Math.random() * 6) + 1;
    pendingDice = diceNumber;

    let newPosition = playerPosition + diceNumber;

    if (newPosition > 36) {
        newPosition = 36;
    }

    pendingPosition = newPosition;

    diceResult.textContent = `Dado: ${diceNumber} | Responde bien para avanzar a la casilla ${pendingPosition}`;

    const currentCell = getCellByNumber(playerPosition);
    const questionType = getQuestionTypeForCurrentCell(currentCell.type);

    showQuestion(questionType, playerPosition, pendingPosition);
}

function movePlayerStepByStep(newPosition) {
    const movement = setInterval(function () {
        if (playerPosition < newPosition) {
            playerPosition++;
            placePlayerToken(playerPosition, "walk");
            updateGameInfo();
            playCharacterMoveSound();
        } else {
            clearInterval(movement);

            if (playerPosition === 36) {
                placePlayerToken(playerPosition, "win");
                completeLevel();
            } else {
                placePlayerToken(playerPosition, "idle");
                rollDiceButton.disabled = false;
            }
        }
    }, 350);
}

function getCellByNumber(number) {
    return cells.find(function (cell) {
        return cell.number === number;
    });
}

function getQuestionTypeForCurrentCell(cellType) {
    if (cellType === "start") {
        const basicTypes = ["math", "spanish", "science"];
        const randomIndex = Math.floor(Math.random() * basicTypes.length);
        return basicTypes[randomIndex];
    }

    return cellType;
}

function getActiveQuestionBank() {
    if (currentLevel === 2) {
        return questionBankLevel2;
    }

    return questionBank;
}

function getRandomQuestion(type) {
    const activeBank = getActiveQuestionBank();
    const bankType = activeBank[type] ? type : "challenge";
    const bank = activeBank[bankType];

    let availableIndexes = [];

    bank.forEach(function (question, index) {
        if (!usedQuestions[bankType].includes(index)) {
            availableIndexes.push(index);
        }
    });

    if (availableIndexes.length === 0) {
        usedQuestions[bankType] = [];

        bank.forEach(function (question, index) {
            availableIndexes.push(index);
        });
    }

    const randomPosition = Math.floor(Math.random() * availableIndexes.length);
    const questionIndex = availableIndexes[randomPosition];

    usedQuestions[bankType].push(questionIndex);

    return bank[questionIndex];
}

function showQuestion(type, currentPosition, targetPosition) {
    currentQuestionType = type;
    currentQuestion = getRandomQuestion(type);

    questionCategory.textContent = `Casilla actual ${currentPosition} - ${typeTitles[type]}`;
    questionText.textContent = currentQuestion.question;
    questionFeedback.textContent = "";
    answerOptions.innerHTML = "";

    currentQuestion.options.forEach(function (option) {
        const button = document.createElement("button");
        button.textContent = option;

        button.addEventListener("click", function () {
            checkAnswer(option);
        });

        answerOptions.appendChild(button);
    });

    questionModal.classList.remove("hidden");
}

function checkAnswer(selectedAnswer) {
    const buttons = answerOptions.querySelectorAll("button");

    if (selectedAnswer === currentQuestion.answer) {
        playSound("correct");

        buttons.forEach(function (button) {
            button.disabled = true;
        });

        questionFeedback.style.color = "#2f7d32";
        questionFeedback.textContent = "¡Correcto! Avanzas.";

        if (currentQuestionType === "bonus") {
            score += 15;
        } else if (currentQuestionType === "challenge") {
            score += 20;
        } else if (currentQuestionType === "goal") {
            score += 25;
        } else {
            score += 10;
        }

        updateGameInfo();

        setTimeout(function () {
            questionModal.classList.add("hidden");
            movePlayerStepByStep(pendingPosition);
        }, 900);

    } else {
        playSound("wrong");

        score -= 5;

        if (score < 0) {
            score = 0;
        }

        questionFeedback.style.color = "#b22222";
        questionFeedback.textContent = "Incorrecto. Pierdes 5 puntos. Intenta otra respuesta.";

        updateGameInfo();

        buttons.forEach(function (button) {
            if (button.textContent === selectedAnswer) {
                button.disabled = true;
                button.classList.add("wrong-answer");
            }
        });
    }
}

function resetUsedQuestions() {
    usedQuestions = {
        math: [],
        spanish: [],
        science: [],
        bonus: [],
        challenge: [],
        goal: []
    };
}

async function completeLevel() {
    score += 50;
    updateGameInfo();
    rollDiceButton.disabled = true;

    await saveScore();
    await renderLeaderboard();

    if (currentLevel < maxLevel) {
        levelModalTitle.textContent = `¡Nivel ${currentLevel} completado!`;
        levelModalText.textContent = `${playerName}, terminaste el nivel ${currentLevel} con ${score} puntos. Tu puntaje fue guardado en este dispositivo. Puedes pasar al nivel ${currentLevel + 1} o volver al inicio.`;

        nextLevelButton.style.display = "inline-block";
        restartGameButton.textContent = "Jugar otra vez";
        backHomeButton.style.display = "inline-block";
    } else {
        levelModalTitle.textContent = "¡Juego terminado!";
        levelModalText.textContent = `${playerName}, completaste todos los niveles con ${score} puntos. Tu puntaje final fue guardado en este dispositivo.`;

        nextLevelButton.style.display = "none";
        restartGameButton.textContent = "Jugar otra vez";
        backHomeButton.style.display = "inline-block";
    }

    levelModal.classList.remove("hidden");
}

function startNextLevel() {
    currentLevel++;
    playerPosition = 1;
    pendingPosition = 1;
    pendingDice = 0;

    diceResult.textContent = "Dado: -";
    rollDiceButton.disabled = false;

    resetUsedQuestions();
    updateLevelDesign();
    updateGameInfo();
    placePlayerToken(playerPosition);

    levelModal.classList.add("hidden");
}

function restartGame() {
    currentLevel = 1;
    playerPosition = 1;
    score = 0;
    pendingPosition = 1;
    pendingDice = 0;

    diceResult.textContent = "Dado: -";
    rollDiceButton.disabled = false;

    resetUsedQuestions();
    updateLevelDesign();
    updateGameInfo();
    placePlayerToken(playerPosition);

    questionModal.classList.add("hidden");
    levelModal.classList.add("hidden");
}

function returnToStartScreen() {
    currentLevel = 1;
    playerPosition = 1;
    score = 0;
    pendingPosition = 1;
    pendingDice = 0;

    playerName = "";
    selectedCharacter = "";
    selectedPlayer = "";
    selectedImage = "";

    playerNameInput.value = "";
    diceResult.textContent = "Dado: -";

    characterCards.forEach(function (card) {
        card.classList.remove("selected");
    });

    questionModal.classList.add("hidden");
    levelModal.classList.add("hidden");
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    resetUsedQuestions();
    renderLeaderboard();
}

function updateLevelDesign() {
    levelTitle.textContent = `Nivel ${currentLevel}: ${levelNames[currentLevel]}`;

    board.classList.remove("level-1");
    board.classList.remove("level-2");

    board.classList.add(`level-${currentLevel}`);
}

/* =========================
   PUNTAJES CON LOCALSTORAGE
========================= */

async function saveScore() {
    const scoreData = {
        jugador: playerName,
        personaje: selectedCharacter,
        icono: selectedPlayer,
        puntaje: score,
        nivel: currentLevel,
        fecha: new Date().toLocaleString("es-MX")
    };

    let scores = JSON.parse(localStorage.getItem(LOCAL_SCORES_KEY)) || [];

    scores.push(scoreData);

    scores.sort(function (a, b) {
        return b.puntaje - a.puntaje;
    });

    scores = scores.slice(0, 5);

    localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(scores));
}

async function renderLeaderboard() {
    if (!leaderboardList) {
        return;
    }

    const scores = JSON.parse(localStorage.getItem(LOCAL_SCORES_KEY)) || [];

    if (scores.length === 0) {
        leaderboardList.innerHTML = `
            <p class="empty-scores">Aún no hay puntajes registrados.</p>
        `;
        return;
    }

    let tableHTML = `
        <table class="score-table">
            <thead>
                <tr>
                    <th>Lugar</th>
                    <th>Jugador</th>
                    <th>Personaje</th>
                    <th>Puntaje</th>
                    <th>Nivel</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
    `;

    scores.forEach(function (item, index) {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.jugador}</td>
                <td>${getScoreCharacterHTML(item)}</td>
                <td>${item.puntaje}</td>
                <td>${item.nivel}</td>
                <td>${item.fecha}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    leaderboardList.innerHTML = tableHTML;
}

function getScoreCharacterHTML(item) {
    let playerKey = item.icono;

    if (playerKey !== "haku" && playerKey !== "samael") {
        if (item.personaje === "Haku") {
            playerKey = "haku";
        } else if (item.personaje === "Samael") {
            playerKey = "samael";
        }
    }

    if (playerKey === "haku" || playerKey === "samael") {
        return `
            <span class="score-character">
                <img src="${characterSprites[playerKey].idle}" alt="${item.personaje}">
                ${item.personaje}
            </span>
        `;
    }

    return item.personaje;
}

async function clearScores() {
    const confirmDelete = confirm("¿Seguro que quieres borrar todos los puntajes? Esta acción no se puede deshacer.");

    if (!confirmDelete) {
        return;
    }

    localStorage.removeItem(LOCAL_SCORES_KEY);

    playSound("correct");
    await renderLeaderboard();

    alert("Puntajes borrados correctamente.");
}

renderLeaderboard();