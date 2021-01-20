const TelegramBot = require("node-telegram-bot-api");
const needle = require("needle");
const cheerio = require("cheerio");
const express = require('express');
const path = require('path');
const TOKEN = process.env.TELEGRAM_TOKEN || '//';
const gameName = process.env.TELEGRAM_GAMENAME || 'pingponggame';
let url = process.env.URL || '<http://localhost:8080>';
const port = process.env.PORT || 8080;

const token = '***REMOVED***';//токен

const bot = new TelegramBot(token, {polling: true});

bot.onText(/start/, (msg) => {
    let userId = msg.from.id;
    bot.sendMessage(userId, 'Я пока ещё жив')
});

var notes = [];
bot.onText(/remind (.+) в (.+)/, (msg, value) => {

    let userId = msg.from.id; //получение id от конкретного пользователя
    let text = value[1];
    let time = value[2];

    notes.push({'uid': userId, 'time': time, 'text': text});
    bot.sendMessage(userId, 'Хорошо. Напомню');

});

setInterval(function () {
    for (let i = 0; i < notes.length; i++) {
        const curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if (notes[i]['time'] === curDate) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю: ' + notes[i]['text'] + ' сейчас.');
            notes.splice(i, 1);
        }
    }
}, 1000);
bot.onText(/horoscope (.+)/, (msg, value) => {
    let znak = value[1];
    let userId = msg.from.id;

    function getHoroscope() {
        needle.get(url, function (err, res) {
            if (err) throw(err);
            let $ = cheerio.load(res.body);
            bot.sendMessage(userId, $(".text-link").text());
        });
    }

    switch (znak) {
        case 'овен':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=1';
            getHoroscope();
            break;
        case 'телец':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=2';
            getHoroscope();
            break;
        case 'близнецы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=3';
            getHoroscope();
            break;
        case 'рак':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=4';
            getHoroscope();
            break;
        case 'лев':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=5';
            getHoroscope();
            break;
        case 'дева':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=6';
            getHoroscope();
            break;
        case 'весы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=7';
            getHoroscope();
            break;
        case 'скорпион':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=8';
            getHoroscope();
            break;
        case 'стрелец':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=9';
            getHoroscope();
            break;
        case 'козерог':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=10';
            getHoroscope();
            break;
        case 'водолей':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=11';
            getHoroscope();
            break;
        case 'рыбы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=12';
            getHoroscope();
            break;
        default:
            bot.sendMessage(userId, "Нет таких значений");
    }
});

const app = express();

// Basic configurations
app.set('view engine', 'ejs');

// Tunnel to localhost.
// This is just for demo purposes.
// In your application, you will be using a static URL, probably that
// you paid for. :)
if (url === '0') {
    const ngrok = require('ngrok');
    ngrok.connect(port, function onConnect(error, u) {
        if (error) throw error;
        url = u;
        console.log(`Game tunneled at ${url}`);
    });
}

// ссылка на игру в сети интернет
let url = 'http://siteWithGame.com'

// название игры (то, что указывали в BotFather)
const gameName = "pingponggame"

// Matches /start
bot.onText(/\/game/, function onPhotoText(msg) {
    bot.sendGame(msg.chat.id, gameName);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    bot.answerCallbackQuery(callbackQuery.id, { url });
});
