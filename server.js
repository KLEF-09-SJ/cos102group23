const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(__dirname));

const votes = {
    "JavaScript": 0,
    "Python": 0,
    "Java": 0,
    "C++": 0
};

// Track users who have voted (keyed by socket.id)
const voters = new Set();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send current totals to the newly connected client
    socket.emit("updateVotes", votes);

    // Handle vote event
    socket.on("vote", (option) => {
        console.log("Vote received:", option);

        // Ignore unknown options (basic validation)
        if (!Object.prototype.hasOwnProperty.call(votes, option)) {
            return;
        }

        if (voters.has(socket.id)) {
            socket.emit("alreadyVoted");
            return;
        }

        votes[option]++;
        voters.add(socket.id);

    
        socket.emit("voteConfirmed", option);

     
        io.emit("updateVotes", votes);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    
    import("open")
        .then(({ default: open }) => open(`http://localhost:${PORT}`))
        .catch((err) => console.log("Could not auto-open browser:", err.message));
});
