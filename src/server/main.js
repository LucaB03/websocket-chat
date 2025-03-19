const express = require("express");
const session = require("express-session");
const expressWs = require("express-ws");

const port = 80;
const sessionTimeout = 300;
const server = express();
expressWs(server);

//Middleware
server.use(session({
    resave: false,
    saveUninitialized:false,
    secret: "verysecret",
    cookie: { httpOnly: false, maxAge: sessionTimeout * 1000}
}));
server.use(express.static("C:/Users/Luca Manuel Blase/Documents/Repositories/websocket-chat/src/app"));

// Normal routes
server.get("/", (req, res) => {
    res.sendFile("C:/Users/Luca Manuel Blase/Documents/Repositories/websocket-chat/src/app/index.html");
});
server.get("/chat", (req, res) => {
    if (!req.session.user) {
        res.status(400).send("Unauthorized");
        return;
    }
    res.sendFile("C:/Users/Luca Manuel Blase/Documents/Repositories/websocket-chat/src/app/chat.html");
});

// WebSocket
server.ws("/chat", (ws, req) => {
    console.log(req.session);
    if (!req.session.user) {
        ws.close(1008, "Unauthorized");
        return;
    }
    console.log("Connected to websocket");
});

// REST API
server.post("/login", express.urlencoded({extended: false}), (req, res) => {
    console.log(req.body);
    if (req.body.user == "luca" && req.body.password == "12345") {
        req.session.user = "luca";
        res.status(200).send("Successfully logged in");
    }
    else res.status(400).send("Login unsuccessful");
});
server.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(200).send("Logged out");
    });
});
server.get("/chats", (req, res) => {
    if (!req.session.user) {
        res.status(400).send("Unauthorized");
        return;
    }
    const data = {
        "user": req.session.user,
        "initial": req.session.user.charAt(0),
        "chats": [
            { "name": "All", "messages": [
                { "user": "luca", "time": "10 AM", "message": "Hi"},
                { "user": "paige", "time": "10:30 AM", "message": "How are you?"},
                { "user": "pete", "time": "1 PM", "message": "Shut up cunt!"}
            ]}
        ]
    };
    res.status(200).json(data);
});




server.listen(port, () => {
    console.log(`Server listening on port ${port}\n`)
});
