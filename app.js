process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const dotenv = require( 'dotenv' );

dotenv.config( { 'path': '.env.example' } );
const token = process.env.TG_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});*/

bot.onText(/\/hi/, function onSayhiText(msg) {
  bot.sendMessage(msg.chat.id, 'H! ' + msg.from.first_name + ' ' + msg.from.last_name);
});

bot.onText(/\/love/, function onLoveText(msg) {
	const opts = {
		reply_to_message_id: msg.message_id,
		reply_markup: JSON.stringify({
			keyboard: [
				['Yes, you are the bot of my life ❤'],
				['No, sorry there is another one...']
			]
		})
  };
  bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});

bot.onText(/\/ean/, function onFindProductByEan(msg) {
	const ean = msg.text.replace( /^\D+/g, '');
	if(ean){
		getProductByEan(ean).then(function(r){
			let html = '<a href="http://deps.ua//components/com_jshopping/files/img_products/thumb_' + r.main_image + '"><b>' + r.title +  '</b></a>' + '\r\n';
			html = html + 'ean: ' + r.product_ean + '\r\n';
			html = html + 'цена: ' + r.price + '\r\n';
			if(typeof r.manufacturer_title != 'undefined'){
				html = html + 'производитель: ' + r.manufacturer_title + '\r\n';
			}
			html = html + 'в наличии: ' + r.product_quantity + '\r\n';
			
			const opts = {
				parse_mode: "HTML"
			};
			
			bot.sendMessage( msg.chat.id,  html, opts);
		});
	} else {
		bot.sendMessage( msg.chat.id,  'Не смог прочитать код товара =(');
	}
});

/*bot.onText(/\//, function onMenuText(msg) {
	const opts = {
		reply_to_message_id: msg.message_id,
		reply_markup: JSON.stringify({
			keyboard: [
				['/hi'],
				['/love']
			]
		})
  };
  bot.sendMessage(msg.chat.id, 'What do you want?', opts);
});*/

const getProductByEan =  (ean) => {
	return new Promise(function(resolve, reject) {
		axios.get( 'http://node.peak-systems.net:3000/product/ean/' + ean )
		.then(response => {
			resolve(response.data);
		})
		.catch(error => {
			console.log('getProductByEan error');
			reject();
		});
	});
}