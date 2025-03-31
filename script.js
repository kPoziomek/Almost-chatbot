const sendButton = document.querySelector('#send');
const messageInput = document.querySelector('input');
const messageContainer = document.querySelector('.output');
const loaderElement = document.querySelector('#bLoader');

const BOT_RESPONSE_DELAY_MS = 1500;
const COMMAND_PREFIX = '/';
const USER_MESSAGE_PREFIX = 'Ty: ';
const BOT_MESSAGE_PREFIX = 'ChatBot: ';

const RANDOM_REPLIES = [
  'Cześć, jak tam zajęcia z JS?',
  'Przepraszam, nie rozumiem, o co pytasz.',
  'Czy możesz podać więcej informacji?',
  'Jasne, chętnie pomogę. W czym mogę Ci asystować?',
];

const COMMAND_RESPONSES = {
  '/version': 'Wersja oprogramowania: v1.2.3',
  '/help':
    'Oto lista dostępnych komend:\n /version - Zwraca wersję oprogramowania\n /help - Wyświetla listę dostępnych komend\n /pogoda - Zwraca pogodę w Krakowie',
  '/pogoda': `W Krakowie jest obecnie słonecznie, 18 stopni.`,
};

const DETERMINISTIC_RESPONSES = {
  cześć: 'Cześć!',
  hej: 'Hej!',
  'jak się masz':
    'Jestem tylko programem komputerowym, więc nie mam uczuć, ale dziękuję za pytanie!',
  'jak masz na imię':
    'Jestem ChatBotem stworzonym na potrzeby tej demonstracji.',
  'co potrafisz':
    'Potrafię odpowiadać na proste pytania i komendy. Wpisz /help, aby zobaczyć listę komend.',
};

const hideLoader = () => {
  loaderElement.style.display = 'none';
};

const showLoader = () => {
  loaderElement.style.display = 'block';
  loaderElement.classList.add('text-center', 'py-2');
};

const displayMessage = (text, senderPrefix = '') => {
  const messageElement = document.createElement('div');
  const textElement = document.createElement('p');
  textElement.textContent = text;

  messageElement.classList.add(
    'message',
    'mb-2',
    'p-2',
    'rounded-lg',
    'max-w-[80%]'
  );

  if (senderPrefix === USER_MESSAGE_PREFIX) {
    messageElement.classList.add(
      'user-message',
      'bg-blue-500',
      'text-white',
      'self-end',
      'rounded-br-none'
    );
  } else {
    messageElement.classList.add(
      'bot-message',
      'bg-gray-200',
      'text-gray-800',
      'self-start',
      'rounded-bl-none'
    );
  }

  messageElement.appendChild(textElement);
  messageContainer.appendChild(messageElement);

  messageContainer.scrollTo({
    top: messageContainer.scrollHeight,
    behavior: 'smooth',
  });
};

const clearInput = () => {
  messageInput.value = '';
};

const handleCommand = (command) => {
  const commandKey = command.split(' ')[0];
  return (
    COMMAND_RESPONSES[commandKey] ||
    'Nie znam takiej komendy. Wpisz /help po listę dostępnych komend.'
  );
};

const handleDeterministicPhrase = (text) => {
  const lowerCaseText = text.toLowerCase().trim();
  return DETERMINISTIC_RESPONSES[lowerCaseText];
};

const getRandomReply = () => {
  return RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
};

const getBotResponse = (userInput) => {
  if (!userInput) {
    return 'Hmm, nic nie napisałeś.';
  }

  if (userInput.startsWith(COMMAND_PREFIX)) {
    return handleCommand(userInput);
  }

  const deterministicResponse = handleDeterministicPhrase(userInput);
  if (deterministicResponse) {
    return deterministicResponse;
  }

  return getRandomReply();
};

const handleSendMessage = () => {
  const userMessage = messageInput.value.trim();

  if (userMessage === '') {
    displayMessage('Proszę coś wpisać!', BOT_MESSAGE_PREFIX);
    return;
  }

  displayMessage(userMessage, USER_MESSAGE_PREFIX);
  clearInput();
  showLoader();

  setTimeout(() => {
    const botMessage = getBotResponse(userMessage);
    hideLoader();
    displayMessage(botMessage, BOT_MESSAGE_PREFIX);
  }, BOT_RESPONSE_DELAY_MS);
};

const initializeChat = () => {
  messageContainer.innerHTML = '';
  messageContainer.classList.add('flex', 'flex-col', 'p-4', 'space-y-2');
  displayMessage(RANDOM_REPLIES[0], BOT_MESSAGE_PREFIX);
  hideLoader();

  sendButton.addEventListener('click', handleSendMessage);
  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  });
};

initializeChat();
