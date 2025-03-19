// DOM elements
const chatList = document.getElementById('chat-list');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const currentChatName = document.getElementById('current-chat-name');
const currentChatAvatar = document.getElementById('current-chat-avatar');
const logoutBtn = document.getElementById('logout-btn');

// Globals
let currentChat = null;
var chats = null;
var user = null;

// Fetch /chat/user with cookie and connect.sid
// Returns profile data and old chats
// Populate profile pic and name
// Populate old chats
// Connect to ws route and wait
async function init() {
    const response = await fetch("http://localhost:80/chats");
    const data = await response.json();
    chats = data["chats"];
    user = data["user"];

    document.getElementById("user-name").innerHTML = data["user"];
    document.getElementById("user-short").innerHTML = data["initial"];

    chatList.innerHTML = "";
    for (let chat of data["chats"]) {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${currentChat && chat.id === currentChat.id ? 'active' : ''}`;
        chatItem.innerHTML = `
            <div class="chat-avatar" style="background-color: green">${chat["name"].charAt(0)}</div>
            <div class="chat-info">
                <div class="chat-name">${chat["name"]}</div>
                <div class="chat-preview">Preview TODO</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${chat["time"]}</div>
            </div>`;
        //TODO: unread badge: ${chat.unread > 0 ? `<div class="chat-badge">${chat.unread}</div>` : ''}
        chatItem.addEventListener('click', () => selectChat(chat));
        chatList.appendChild(chatItem);
    }

    //Establish ws connection
    const ws = new WebSocket("ws://localhost:80/chat");
    ws.addEventListener("open", (event) => {
        console.log(`Connected to ws: ${ws.url}`);
      });
}

// Select a chat
function selectChat(chat) {
    currentChat = chat;
    currentChatName.textContent = chat["name"];
    currentChatAvatar.textContent = chat["name"].charAt(0);
    currentChatAvatar.style.backgroundColor = "blue";
    // Mark as read
    //chat.unread = 0;
    
    // Render messages
    renderMessages();
    
    // Update chat list to show active chat
    //renderChatList();
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// Render messages for current chat
function renderMessages() {
    if (!currentChat) return;
    
    chatMessages.innerHTML = '';
    for (let msg of currentChat["messages"]) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${ user == msg["user"] ? 'sent' : 'received'}`;
        messageEl.innerHTML = `
            <div class="message-content">${msg["message"]}</div>
            <div class="message-time">${msg["time"]}</div>
        `;
        chatMessages.appendChild(messageEl);
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/*
// Send a message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChat) return;
    
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    // Add message to current chat
    currentChat.messages.push({
        text: text,
        sender: 'me',
        time: 'Just now'
    });
    
    // Update last message
    currentChat.lastMessage = 'You: ' + text;
    currentChat.time = 'Just now';
    
    // Render updated messages
    renderMessages();
    //renderChatList();
    
    // Clear input
    messageInput.value = '';
    
    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) { // 70% chance of reply
        const replyDelay = 1000 + Math.random() * 2000;
        setTimeout(() => {
            simulateReply();
        }, replyDelay);
    }
} */

// Event listeners
//sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

logoutBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        const res = await fetch("http://localhost:80/logout", { method: "POST"});
        if (res.status == 200) window.location.href = "http://localhost:80/"; // Redirect to index page
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
});


// Initialize
//renderChatList();
init().then(() => {
    // Select first chat by default
    if (chats.length > 0) {
        selectChat(chats[0]);
    }
});

