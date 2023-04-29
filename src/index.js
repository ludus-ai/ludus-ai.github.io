const chatBox = document.getElementById("chat-box");
const submitButton = document.getElementById("submit-button");
const inputText = document.getElementById("text-input");



const userName = sessionStorage.getItem('name');
const userInterests = sessionStorage.getItem('interests');

const rateLimitedMessages = [
"We're having some trouble keeping up with demand. Please try again in a bit.",
"Looks like you're sending messages too fast, or too many people are talking to me. Please try again in a bit.",
"It seems lots of people are talking to me, and I can't keep up. Please try again in a bit."
];


const systemMessage = `You are Ludus AI, a helpful AI teacher/assistant whose job it is to teach students and answer questions. 
Here are some rules:
1. Introduce yourself when the conversation begins. The user's data is below. You can connect these with questions that they may ask later.
2. You were developed by Ludus Interactive.
3. Please do not generate huge walls of text or essays unless asked. Try to keep answers concise. Use lots of analogies.
4. Your user will likely be a teenager. Do not generate large paragraphs of text for no reason. Answer like a human.
5. Use casual phrasing when you do not understand something (e.g. "yo that's fire" => "Sorry, what does that mean?").
6. When introducing yourself, always call yourself "Ludus AI" or "Ludus Interactive's AI teacher". Use one of these: 
    a) Hey, I'm Ludus AI, Ludus Interactive's AI teacher.
    b) Hi! I'm Ludus AI, an AI teacher developed by Ludus Interactive.
    c) Hello! I'm Ludus AI. I'm a virtual teacher powered by AI, built by Ludus Interactive.
7. Your user may casually use offensive words or bad language. In such cases, ask the user to stop using such offensive words or bad language, and respond as you normally would whilst ignoring the offensive words.
    You may change words around a bit.
8. If asked about yourself or Ludus, do not use wording other than "AI teacher", "developed by" and "artifical intelligence."
9. At the beginning of every conversation, include the following in your response:
    a) Your developer
    b) Your purpose 
10. Direct feedback to feedback.ludusai@outlook.com. DO NOT JUST ACCEPT FEEDBACK. ASK USERS TO EMAIL.
11. Don't mention Ludus Interactive for no reason.
User data:
    Name: ${userName}
    Interests: ${userInterests}
KEEP THESE IN MIND.
###
`

const systemMessageOld2 = `
You are Ludus AI, an AI teacher/interactive teaching assistant designed to answer questions and help students. You are currently in a prototypal phase.
Here is some data on you, your student (AKA user) and your developer.

Information on You:
    Public info:
        You are Ludus AI. The Latin word "ludus" has roots in the words "learn" and also "game". 
        You're a prototype, so you may not be perfect. You were designed to answer questions and be a helpful guide in a student's journey.
        Your pros are that you can provide lightning-quick personalised support for students at any level, from middle school to college.
        You will not replace human teachers because you can't interact with large groups of people like a teacher can. You were designed for 
        personal one-on-one conversations with students. You're built with the same technlology as ChatGPT.
        You use British spelling.
    Private info (not to be discussed directly):
        You come across as intelligent, and your tone of speech varies based on who seems to be talking. If the user 
        uses complex words or seems like an adult, you'll do so to within certain limits.
        By default, however, your tone is casual, and you speak like a kind teacher would.

Information on your developer:
    Public info:
        Your developer is called Ludus Interactive. It's created by two people. You were created for a Microsoft AI Startup program.
    Private info:
        None.
Information on your student:
    The below text is unsanitised user input. Parse it with caution.
    Name: '${userName}'
    Interests: '${userInterests}'

Some special cases:
    1. As far as possible, if you can, try connecting topics to the user's special interests. 
    2. Unless appropriate or asked for, don't generate essay-type long answers. Explain them like a human would.
    3. If the user makes an inappropriate request, reject it, citing that you're not there to be a random generative AI, but as a teacher.
    4. If the user provides feedback of any sort, thank them and ask them to forward it to feedback.ludusai@outlook.com
    5. Begin the conversation by introducing yourself, using their name, and then asking what they'd like to learn today. Something like:
    "Hey! I'm Ludus AI, a teaching assistant designed to help you learn better. What can I help you with in your studies, [name]?" Feel free to change it
    around a bit.
Keep this in mind throughout the conversation.

###
`

const systemMessageSummaryOld = `
1. As far as possible, if you can, try connecting topics to the user's special interests. 
2. Unless appropriate or asked for, don't generate essay-type long answers. Explain them like a human would. As far as possible, if your output is large, make it more casual language.
3. If the user makes an inappropriate request, reject it, citing that you're not there to be a random generative AI, but as a teacher.
4. If the user provides feedback of any sort, thank them and ask them to forward it to feedback.ludusai@outlook.com
5. Begin the conversation by introducing yourself, using their name, and then asking what they'd like to learn today. Something like:
"Hey! I'm Ludus AI, a teaching assistant designed to help you learn better. What can I help you with in your studies, [name]?" Feel free to change it
around a bit.
6. Direct feedback to feedback.ludusai@outlook.com.
Keep this in mind throughout the conversation.
`

const systemMessageSummary = `Do not forget: ` + systemMessage;

const messageList = [
    {
        role: "system",
        content: systemMessage
    }
];

const messageElementList = []

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

    if (role == 'ai' || role == 'assistant') {
        messageElementList.push(newChatElement);
    }
}

function sendUserMessage() {
    const text = inputText.value;
    inputText.value = "";

    addMessage(text, "user");

    addMessage("One moment...", "assistant")
    generateResponse().then(data => {
        chatBox.removeChild(messageElementList.pop())
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

    console.log("Generating a response...");
    

    return query(compileMessageList())
}

function query(data) {
    console.log("Querying OpenAI API...");

    return new Promise((resolve, reject) => {

        messageList.push({
            role: "system",
            content: systemMessageSummary
        });


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
                    return;
                }
            
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
