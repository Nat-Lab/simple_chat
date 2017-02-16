var token = localStorage['bot_token'] ? localStorage['bot_token'] : prompt('Bot token: ');
localStorage['bot_token'] = token;
var tg = new TelegramBot({token});
var append = msg => {
  simpleChat.appendMessage({
    user: msg.from.username,
    name: msg.chat.title ? msg.chat.title : msg.chat.first_name + " " + msg.chat.last_name,
    text: msg.text,
    chat_id: msg.chat.id
  });
  localStorage['chat_tabs'] = JSON.stringify(simpleChat.tabs);
};
tg.onmessage = append;
tg.onapi = rslt => {
  if (rslt.ok) append(rslt.result);
};
tg.onerror = msg => console.log(msg);
tg.bot.start();
