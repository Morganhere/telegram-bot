const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '<YOUR_BOT_TOKEN>';
const channelUsername = '@your_channel_username'; // Ganti dengan username channel Anda

// Inisialisasi bot
const bot = new TelegramBot(botToken);
bot.setWebHook(`https://your-server.com/bot${botToken}`);

// Inisialisasi server Express
const app = express();
const port = 3000; // Ganti sesuai kebutuhan

// Middleware untuk parsing body dari pesan
app.use(bodyParser.json());

// Endpoint untuk menerima pembaruan dari Telegram
app.post(`/bot${botToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle pesan yang diterima oleh bot
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Cek apakah pesan mengandung tanda #talkboy atau #talkgirl
  if (messageText.includes('!talkboy') || messageText.includes('!talkgirl')) {
    // Kirim pesan ke channel dengan menyembunyikan identitas pengirim
    bot.forwardMessage(channelUsername, chatId, msg.message_id);
  }
});

// Handle pesan yang diterima oleh bot
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.caption || msg.text; // Periksa caption, jika tidak ada gunakan teks pesan
  const photo = msg.photo; // Informasi gambar jika tersedia

  // Cek apakah pesan mengandung kata kunci !pictboy atau !pictgirl
  if (messageText && (messageText.includes('!pictboy') || messageText.includes('!pictgirl'))) {
    // Kirim pesan ke channel dengan menyertakan caption dan gambar jika ada
    bot.sendPhoto(channelUsername, photo[0].file_id, {
      caption: messageText,
    });
  }
});


// Handle pesan yang diteruskan ke channel
bot.on('channel_post', (msg) => {
  // Lakukan sesuatu dengan pesan yang diteruskan ke channel, jika diperlukan
  console.log('Pesan diteruskan ke channel:', msg.text);
});

// Mulai server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
