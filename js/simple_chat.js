var simpleChat;
var SimpleChat = function (){
  'use strict;'

  var chats = document.getElementById('chats'),
      list = document.getElementById('chatlist_containter'),
      sendtext = document.getElementById('message'),
      sendpanel = document.getElementById('sendpanel'),
      sendMessage, selected_id, tabs = [];

  var chatExist = function(id) {
    var children = chats.children,
        len = children.length;
    for(var i = 0; i < len; i++) {
      if(children[i].getAttribute('chat_id') == id) {
        return true;
      }
    }
    return false;
  },

  newTab = function({id, name}) {
    tabs.push({id, name});
    var item = document.createElement('item'),
        chat = document.createElement('div');
    item.onclick = () => simpleChat.ui.setActiveChat(id);
    item.innerHTML = name;
    chat.className = 'hide';
    chat.setAttribute('chat_id', id);
    list.appendChild(item);
    chats.appendChild(chat);
  },

  formatDate = function (d) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  },

  Message = function ({time, user, message, chat_id}) {
    var line = document.createElement('div'),
        time_ = document.createElement('span'),
        user_ = document.createElement('span'),
        message_ = document.createElement('span');

    line.className = 'line';
    time_.className = 'time';
    user_.className = 'user';
    message_.className = 'message';

    time_.innerHTML = '[' + formatDate(new Date(time)) + '] ';
    user_.innerHTML = '&lt;' + user + '&gt; ';
    message_.innerHTML = message;

    [time_, user_, message_].forEach(e => line.appendChild(e));

    return line;
  };

  return {
    ui: {
      setActiveChat: function (id) {
        var children = chats.children,
            len = children.length;
        for(var i = 0; i < len; i++) {
          if(children[i].getAttribute('chat_id') == id) {
            selected_id = id;
            children[i].className = 'chat';
            sendpanel.className = 'send';
            sendtext.addEventListener('keyup', e => {
              if (selected_id && e.keyCode == 13) {
                sendMessage({chat_id: selected_id, text: sendtext.value});
                sendtext.value = '';
              }
            });
          } else children[i].className = 'hide';
        }
      }
    },
    appendMessage: function({user, name, text, chat_id, time = Date.now()}) {
      if(!chatExist(chat_id)) newTab({id: chat_id, name});
      var children = chats.children,
          len = children.length;

      for(var i = 0; i < len; i++) {
        if(children[i].getAttribute('chat_id') == chat_id) {
          children[i].appendChild(new Message({time, message: text, user, chat_id}));
        }
      }
    },
    set onmessage (cb) {
      sendMessage = cb;
    },
    get onmessage () {
      return sendMessage;
    },
    set tabs (tabs) {
      tabs.forEach(tab => {
        if(!chatExist(tab.id)) newTab(tab);
      });
    },
    get tabs () {
      return tabs;
    }
  };
};

window.onload = function() {
  simpleChat = new SimpleChat();
  simpleChat.onmessage = msg => tg.api.sendMessage(msg);
  if (localStorage['chat_tabs']) {
    simpleChat.tabs = JSON.parse(localStorage['chat_tabs']);
  }
}
