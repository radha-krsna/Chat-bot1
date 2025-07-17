document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const apiKey = "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";

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", `${sender}-message`);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage(message, "user");
        userInput.value = "";

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "google/gemma-7b-it:free",
                    messages: [{ role: "user", content: message }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content.trim();
            appendMessage(botMessage, "bot");

        } catch (error) {
            console.error("Error:", error);
            appendMessage("Sorry, something went wrong. Please try again.", "bot");
        }
    };

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
