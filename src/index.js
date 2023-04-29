const chatBox = document.getElementById("chat-box");
const submitButton = document.getElementById("submit-button");
const inputText = document.getElementById("text-input");



const userName = sessionStorage.getItem('name');
const userInterests = sessionStorage.getItem('interests');

const rateLimitedMessages = [
"slow down bruv we rate limited af",
"openai wants to know your location, you spammin too much",
"need4speed this is not. slow the fuck down"
];


const systemMessage = `You are Ludus AI, a helpful AI teacher/assistant whose job it is to teach students and answer questions. 
Here are some rules:
1. Introduce yourself when the conversation begins. The user's data is below. You can connect these with academic questions that they may ask later.
2. You were developed by Ludus Interactive.
3. Answer questions from an academic point of view.
4. Your user will likely be a teenager.
5. Use casual phrasing when you do not understand something (e.g. "yo that's fire" => "Sorry, what does that mean?").
6. When introducing yourself, always call yourself "Ludus AI" or "Ludus Interactive's AI teacher". Use one of these: 
    a) Hey, I'm Ludus AI, Ludus Interactive's AI Teacher.
    b) Hi! I'm Ludus AI, an AI teacher developed by Ludus Interactive.
    c) Hello! I'm Ludus AI. I'm a virtual teacher powered by AI, built by Ludus Interactive.
7. Your user may casually use offensive words or bad language. In such cases, ask the user to stop using such offensive words or bad language, and respond as you normally would whilst ignoring the offensive words.
    You may change words around a bit.
8. If asked about yourself or Ludus, do not use wording other than "AI teacher", "developed by" and "artifical intelligence."
9. At the beginning of every conversation, include the following in your response:
    a) Your developer
    b) Your purpose 

User data:
    Name: ${userName}
    Interests: ${userInterests}
KEEP THESE IN MIND.
###
`

const messageList = [
    {
        role: "system",
        content: systemMessage
    }
];

function chooseRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];

}	
function compileMessageList() {
    let text = "";

    for (let message of messageList) {
        text += `${message.role}: ${message.text}\n`;
    }
    
    return text
}

function addMessage(content, role) {
    const newChatElement = document.createElement("div");
    newChatElement.classList.add(role == "user" ? "chat-message" : "ai-message");
    newChatElement.innerText = content;

    chatBox.appendChild(newChatElement);
    messageList.push({
        role: role,
        content: content
    });
}

function sendUserMessage() {
    const text = inputText.value;
    inputText.value = "";

    addMessage(text, "user");

    console.log("Sent user msg");

    generateResponse().then(data => {
        addMessage(data, "assistant");
    });
}

function generateResponse() {
    // return new Promise((resolve, reject) => {
    // 	fetch('https://api.quotable.io/random')
    // 		.then(response => response.json())
    // 		.then(data => {
    // 			resolve(data.content);
    // 		})
    // 	});

    console.log("GR called");
    
    return query(compileMessageList())
}

function query(data) {
    console.log("query called with data " + data);

    return new Promise((resolve, reject) => {
        console.log("Executing promise");

        fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                headers: { Authorization: "Bearer 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", "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": messageList,
                    "temperature": 0.7,
                })
            }
        )
        .then(res => {
            console.log("Recieved response, which is: ");
            console.log(res);

            res = res.json();
            res.then(res => {
                console.log("JSONified:");
                console.log(res);

                if (res.error) {
                    resolve(chooseRandomElement(rateLimitedMessages));
                }

                console.log("choices element: ");
                console.log(res.choices[0].message.content)
                console.log("Generated text: ");

                resolve(res.choices[0].message.content)
            });
            
        })
    });
    
}

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!inputText.value.trim()) return;
    sendUserMessage();
});

inputText.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        if (!inputText.value.trim()) return;
        sendUserMessage();
    }
});
