const socket = io();

let hasVoted = false;


function vote(option) {
    if (hasVoted) {
        document.getElementById("status").innerText = "⚠ You have already voted!";
        return;
    }
    socket.emit("vote", option);
}


socket.on("updateVotes", (data) => {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);

    for (const option in data) {
        const voteCount = data[option];
        const percentage = totalVotes === 0 ? 0 : ((voteCount / totalVotes) * 100).toFixed(1);

        const container = document.createElement("div");
        container.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = percentage + "%";
        bar.innerText = `${option} - ${voteCount} votes (${percentage}%)`;

        container.appendChild(bar);
        resultsDiv.appendChild(container);
    }
});


socket.on("voteConfirmed", (option) => {
    hasVoted = true;
    document.getElementById("status").innerText = `✅ Vote submitted for ${option}!`;
});


socket.on("alreadyVoted", () => {
    hasVoted = true;
    document.getElementById("status").innerText = "⚠ You have already voted!";
});
