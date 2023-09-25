const TelegramBot = require('node-telegram-bot-api');

const token = '6578221460:AAF2nvVzLDL4BBw9eAj0M3XsjZyAcHzbqG8';

const bot = new TelegramBot(token, { polling: true });

function findShortestAndLongestWords(text, maxResults = 1) {
  // Розбиваємо текст на слова
  const words = text.split(/\s+/);

  let shortestWords = [];
  let longestWords = [];
  let shortestLength = Infinity;
  let longestLength = 0;

  for (const word of words) {
    const cleanedWord = word.replace(/[^а-яА-ЯёЁa-zA-ZїЇіІєЄґҐ'ґ0-9]/g, '');

    if (cleanedWord) {
      const wordLength = cleanedWord.length;

      if (wordLength < shortestLength) {
        shortestWords = [cleanedWord];
        shortestLength = wordLength;
      } else if (wordLength === shortestLength) {
        shortestWords.push(cleanedWord);
      }

      if (wordLength > longestLength) {
        longestWords = [cleanedWord];
        longestLength = wordLength;
      } else if (wordLength === longestLength) {
        longestWords.push(cleanedWord);
      }
    }
  }

  return { shortestWords, longestWords };
}

function findDuplicateWords(text) {
  const words = text.split(/\s+/);
  const wordCounts = {};

  for (const word of words) {
    const cleanedWord = word.replace(/[^а-яА-ЯёЁa-zA-ZїЇіІєЄґҐ'ґ0-9\s]/g, '').toLowerCase();
    if (cleanedWord) {
      wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
    }
  }

  const duplicates = Object.entries(wordCounts).filter(([_, count]) => count > 1);
  return duplicates.map(([word, count]) => `${word}: ${count}`).join(', ');
}

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(chatId, 'Привіт! Я ваш Telegram бот. Щоб розпочати аналіз тексту, надішліть мені будь-який текст.');
  } else {
    const words = text.split(/\s+/).filter(word => isNaN(word) && /[а-яА-ЯёЁa-zA-ZїЇіІєЄґҐ'ґ]/.test(word));
    const { shortestWords, longestWords } = findShortestAndLongestWords(text);

    const shortestWordsString = shortestWords.join(' ');
    const longestWordsString = longestWords.join(' ');

    const wordCount = words.length;

    const cleanedTextWithPunctuation = text.replace(/[\s\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    const characterCountWithPunctuation = cleanedTextWithPunctuation.length;

    const cleanedText = text.replace(/\s/g, '');

    const characterCount = cleanedText.length;

    const duplicateWords = findDuplicateWords(text);

    const duplicateWordsMessage = duplicateWords ? `Повторюючіся слова: ${duplicateWords}` : 'В тексті немає повторюючихся слів';

    bot.sendMessage(
      chatId,
      `Загальна кількість символів: ${characterCount}\nЗагальна кількість символів (з урахуванням розділових знаків): ${characterCountWithPunctuation}\nЗагальна кількість слів: ${wordCount}\nНайкоротші слова: ${shortestWordsString}\nНайдовші слова: ${longestWordsString}\n${duplicateWordsMessage}`
    );
  }
});
