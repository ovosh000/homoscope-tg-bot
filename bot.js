const TelegramBot = require("node-telegram-bot-api");
const needle = require("needle");
const cheerio = require("cheerio");
const express = require('express');
const path = require('path');
const TOKEN = process.env.TELEGRAM_TOKEN || '//';

const token = '//';//токен

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

var options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'овен', callback_data: 'овен' }, { text: 'телец', callback_data: 'телец' }, { text: 'близнецы', callback_data: 'близнецы' }],
            [{ text: 'рак', callback_data: 'рак' }, { text: 'лев', callback_data: 'лев' }, { text: 'дева', callback_data: 'дева' }],
            [{ text: 'весы', callback_data: 'весы' }, { text: 'скорпион', callback_data: 'скорпион' }, { text: 'стрелец', callback_data: 'стрелец' }],
            [{ text: 'козерог', callback_data: 'козерог' }, { text: 'воделей', callback_data: 'воделей' }, { text: 'рыбы', callback_data: 'рыбы' }]
        ]
    })
};

bot.onText(/horoscope(@.+){0,1}/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Выберите знак зодиака:', options);
});

bot.on('callback_query', (znak) => {
    let chatId = znak.message.chat.id;
    function getHoroscope() {
        needle.get(url, function (err, res) {
            if (err) throw (err);
            let $ = cheerio.load(res.body);
            bot.sendMessage(chatId, znak+": " + $(".text-link").text());
        });
    }
    function deleteMSG(){
        bot.deleteMessage(znak.message.chat.id, znak.message.message_id);
    };
    switch (znak.data) {
        case 'овен':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=1';
            getHoroscope();
            deleteMSG();
            break;
        case 'телец':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=2';
            getHoroscope();
            deleteMSG();
            break;
        case 'близнецы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=3';
            getHoroscope();
            deleteMSG();
            break;
        case 'рак':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=4';
            getHoroscope();
            deleteMSG();
            break;
        case 'лев':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=5';
            getHoroscope();
            deleteMSG();
            break;
        case 'дева':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=6';
            getHoroscope();
            deleteMSG();
            break;
        case 'весы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=7';
            getHoroscope();
            deleteMSG();
            break;
        case 'скорпион':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=8';
            getHoroscope();
            deleteMSG();
            break;
        case 'стрелец':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=9';
            getHoroscope();
            deleteMSG();
            break;
        case 'козерог':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=10';
            getHoroscope();
            deleteMSG();
            break;
        case 'водолей':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=11';
            getHoroscope();
            deleteMSG();
            break;
        case 'рыбы':
            url = 'https://www.predskazanie.ru/daily_horoscope/?day=&s=12';
            getHoroscope();
            deleteMSG();
            break;
        default:
            bot.sendMessage(userId, "Нет таких значений");
    }
})
