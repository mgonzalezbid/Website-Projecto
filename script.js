/* ============================================
   EnglishCards - Lógica de la Aplicación
   ============================================ */

// Estado de la aplicación
const appState = {
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  correctCount: 0,
  incorrectCount: 0,
};

// Elementos del DOM
const elements = {
  card: document.getElementById('card'),
  englishText: document.getElementById('english-text'),
  spanishText: document.getElementById('spanish-text'),
  currentCard: document.getElementById('current-card'),
  totalCards: document.getElementById('total-cards'),
  progressFill: document.getElementById('progress-fill'),
  btnFlip: document.getElementById('btn-flip'),
  btnNext: document.getElementById('btn-next'),
  btnPrevious: document.getElementById('btn-previous'),
  btnCorrect: document.getElementById('btn-correct'),
  btnMissed: document.getElementById('btn-missed'),
  btnReset: document.getElementById('btn-reset'),
  correctCount: document.getElementById('correct-count'),
  incorrectCount: document.getElementById('incorrect-count'),
};

/**
 * Carga las tarjetas desde cards.json
 */
async function loadCards() {
  try {
    const response = await fetch('/api/cards');
    appState.cards = await response.json();
    elements.totalCards.textContent = appState.cards.length;
    initializeApp();
  } catch (error) {
    console.error('Error cargando tarjetas:', error);
    // Fallback: cargar tarjetas por defecto si la API falla
    loadDefaultCards();
  }
}

/**
 * Carga tarjetas por defecto (en caso de error)
 */
function loadDefaultCards() {
  appState.cards = [
    { english: 'The quick brown fox jumps over the lazy dog', spanish: 'El rápido zorro marrón salta sobre el perro perezoso' },
    { english: 'I have a dream', spanish: 'Tengo un sueño' },
    { english: 'To be or not to be', spanish: 'Ser o no ser' },
  ];
  elements.totalCards.textContent = appState.cards.length;
  initializeApp();
}

/**
 * Inicializa la aplicación
 */
function initializeApp() {
  displayCard();
  attachEventListeners();
  updateProgress();
}

/**
 * Muestra la tarjeta actual
 */
function displayCard() {
  if (appState.cards.length === 0) return;

  const currentCard = appState.cards[appState.currentIndex];
  elements.englishText.textContent = currentCard.english;
  elements.spanishText.textContent = currentCard.spanish;
  elements.currentCard.textContent = appState.currentIndex + 1;

  // Resetear el estado de volteo
  appState.isFlipped = false;
  elements.card.classList.remove('flipped', 'feedback');

  updateProgress();
  updateButtonStates();
}

/**
 * Voltea la tarjeta
 */
function flipCard() {
  appState.isFlipped = !appState.isFlipped;
  elements.card.classList.toggle('flipped');
}

/**
 * Ir a la siguiente tarjeta
 */
function nextCard() {
  if (appState.currentIndex < appState.cards.length - 1) {
    appState.currentIndex++;
    displayCard();
  }
}

/**
 * Ir a la tarjeta anterior
 */
function previousCard() {
  if (appState.currentIndex > 0) {
    appState.currentIndex--;
    displayCard();
  }
}

/**
 * Registrar respuesta correcta
 */
function markCorrect() {
  appState.correctCount++;
  elements.correctCount.textContent = appState.correctCount;
  showFeedback('correct');
  nextCard();
}

/**
 * Registrar respuesta incorrecta
 */
function markIncorrect() {
  appState.incorrectCount++;
  elements.incorrectCount.textContent = appState.incorrectCount;
  showFeedback('missed');
  nextCard();
}

/**
 * Mostrar feedback visual
 */
function showFeedback(type) {
  elements.card.classList.add('feedback');
  setTimeout(() => {
    elements.card.classList.remove('feedback');
  }, 300);
}

/**
 * Reiniciar la aplicación
 */
function resetApp() {
  appState.currentIndex = 0;
  appState.isFlipped = false;
  appState.correctCount = 0;
  appState.incorrectCount = 0;
  elements.correctCount.textContent = '0';
  elements.incorrectCount.textContent = '0';
  displayCard();
}

/**
 * Actualizar barra de progreso
 */
function updateProgress() {
  const percentage = ((appState.currentIndex + 1) / appState.cards.length) * 100;
  elements.progressFill.style.width = percentage + '%';
}

/**
 * Actualizar estado de los botones
 */
function updateButtonStates() {
  elements.btnPrevious.disabled = appState.currentIndex === 0;
  elements.btnNext.disabled = appState.currentIndex === appState.cards.length - 1;
}

/**
 * Adjuntar event listeners a los botones
 */
function attachEventListeners() {
  // Voltear tarjeta
  elements.card.addEventListener('click', flipCard);
  elements.btnFlip.addEventListener('click', flipCard);

  // Navegación
  elements.btnNext.addEventListener('click', nextCard);
  elements.btnPrevious.addEventListener('click', previousCard);

  // Feedback
  elements.btnCorrect.addEventListener('click', markCorrect);
  elements.btnMissed.addEventListener('click', markIncorrect);

  // Reset
  elements.btnReset.addEventListener('click', resetApp);

  // Soporte para teclado
  document.addEventListener('keydown', handleKeyPress);
}

/**
 * Manejar presiones de teclado
 */
function handleKeyPress(e) {
  switch (e.key) {
    case ' ':
      e.preventDefault();
      flipCard();
      break;
    case 'ArrowRight':
      if (!elements.btnNext.disabled) nextCard();
      break;
    case 'ArrowLeft':
      if (!elements.btnPrevious.disabled) previousCard();
      break;
    case 'y':
    case 'Y':
      markCorrect();
      break;
    case 'n':
    case 'N':
      markIncorrect();
      break;
  }
}

/**
 * Iniciar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', loadCards);
