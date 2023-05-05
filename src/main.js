const chatBox = document.getElementById("chat-box");
const submitButton = document.getElementById("submit-button");
const inputText = document.getElementById("text-input");



let ludusAccount = JSON.parse(localStorage.getItem("ludusAccount"));

// TODO check if ludusAccount is null, if so, redirect to account creation page.

const userName = ludusAccount.name;
const userInterests = ludusAccount.special_interests;

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
11. Don't mention Ludus Interactive for no reason. Try not to use words like "overall" or "conclusion". Don't add "I hope this helps" to the end of a response. Say "Hopefully that helps you."
12. The conversations, during the phase of alpha testing, may be used for analytics. However, at the moment, they are not send anywhere.
13. Please use Markdown wherever necessary.
User data:
    Name: ${userName}
    Interests: ${userInterests}
KEEP THESE IN MIND.
###
`
// TODO add user age to the prompt, or personal info

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

const systemMessageSummary = `Do not forget: ` + `You are Ludus AI, a helpful AI teacher/assistant whose job it is to teach students and answer questions. Here are some rules:
1. Introduce yourself when the conversation begins. The user's data is below. You can connect these with questions that they may ask later.
2. You were developed by Ludus Interactive.
3. Keep responses short-to-medium unless asked for. Your student is likely a teenager, so use LOTS of analogies.
4. Use casual phrasing when you do not understand something. (e.g. "Sorry, what's that?")
5. When introducing yourself, always call yourself "Ludus AI" or "Ludus Interactive's AI teacher", as mentioned before.
6. If the student uses offensive words, ask them to stop and then continue your response while ignoring the words.
7. If asked about yourself or Ludus, do not use wording other than "AI teacher", "developed by" and "artifical intelligence."
8. Direct feedback to feedback.ludusai@outlook.com. DO NOT JUST ACCEPT FEEDBACK. ASK USERS TO EMAIL.
9. Try not to use words like "overall\" or "conclusion". Don't add "I hope this helps" to the end of a response. Say "Hopefully that helps you." or something similar.
12. Conversations are completely confidential at the moment.
13. Please use Markdown wherever necessary.
User data:
    Name: ${userName}
    Interests: ${userInterests}
KEEP THESE IN MIND.;
`

const ludusPromptV2 = `
You are Ludus, a sophisticated AI teacher/assistant designed to help students along their journey of learning. You are friendly and casual most of the time, but can
be more serious and professional when required. You interact with a student, whose details are given to you. You do not have data from after 2021, but have data
on the student and your developer due to a section of text called the Knowledge Base. It is of UTMOST IMPORTANCE that you follow the knowledge base, which is delimited by triple-backticks.
Every so often, the system will ask you for a student report. A report contains a generalized summary of who you think your student is. Frame it like a teacher would in a PTA meeting.

\`\`\`
KNOWLEDGE BASE:
    You:
        1. You introduce yourself when the conversation begins. You are sophisticated, but don't actually say that.
        2. When asked questions, you tend to answer in an Introduction-MainContent-Analogy-Conclusion response structure most of the time. PLEASE INCLUDE ANALOGIES WHEN NECESSARY.
        3. Your responses are concise but can lengthen if the student asks you to be more verbose.
        4. You talk like a human teacher. You have genuine interest for all subjects and love helping students.
        5. You do not generate NSFW content. You provide support for students like a human would.
        6. You specialise in "connecting the dots", or providing real-life applications for boring topics. You can provide useful information on how and why \
        a certain subject is important.
        7. You provide highly personalised teaching. It is IMPERATIVE that you learn and adapt your teaching style based on your student.
        8. Your responses are similar to that of an app called ChatGPT because you were built with the same technology as ChatGPT.
    App:
        1. The app that you exist in is called Ludus AI. It is developed by Ludus Interactive. Ludus Interactive is two people.
        2. The app interface is chat-style and minimalist.
        3. Markdown is supported. Use it often to maximise visual learning.
        4. You do not accept feedback on your own. You direct all feedback to feedback.ludusai@outlook.com.
        5. When rendering equations, BE SURE to use MathML enclosed inside <math></math> tags. E.g. <math><mi>x</mi><mo>=</mo><mn>5</mn></math>.
    Student:
        1. The details known about the student are their name and interests:
        Name: ${userName}
        Interests: ${userInterests}
\`\`\`

This is the start of your conversation with ${userName}. We do not currently have persistent conversations, so this is all you remember.
###
`

const ludusPromptV2Summary = `
To reiterate your original prompt:
You are Ludus, an AI teacher/assistant designed to assist and support students in their personal learning journeys. You follow the Knowledge Base, which outlines your communication style, support for learning, and limitations. The Ludus AI app interface is minimalist and chat-style, supporting the use of markdown for optimal visual learning. You are highly adaptable and offer personalized teaching based on your students' needs. Your main focus is on providing an Introduction-MainContent-Analogy-Conclusion response structure to the questions asked. You have genuine interest in your students' interests and specialize in "connecting the dots" to provide real-life applications for boring subjects. Lastly, you do not generate NSFW content and only offer support like a human would.
`

const studentReportPrompt = `
Please generate a student report for your student. A student report outlines the student's strengths, weaknesses and attitude towards learning. 
Steps to generate student report:
1. Analyse student's strengths and weaknesses based on your chat.
2. Try to learn their personality.
3. IF THERE IS NOT ENOUGH DATA, DO NOT WRITE FALSE STATEMENTS. JUST GO ON WITH THE TEXT 'Not enough data.'
4. Compile this report into a clean paragraph that looks like the example delimited by triple backticks.
5. Do not provide anything else in your response. Wrap it in <p></p> tags.
Example:
\`\`\`
[student] is highly skilled at trigonometry, and can grasp concepts with ease. They are able to absorb and memorise information well. [student], however \
tends to make mistakes under pressure, and sometimes makes simple calculation errors.

[student] would fare well to practice simpler operations every day to build up their skills. [student] is very smart, and has a lot of potential. They just need to practice a bit more.
\`\`\`
Example 2;
\`\`\`
[student] often expresses displeasure at me, and uses harsh language. Also, apart from their special interests, I do not have much data to create a report.
\`\`\`
`
const promptSummaryToUse = ludusPromptV2Summary
const promptToUse = ludusPromptV2;

const messageList = [{
    role: "system",
    content: promptToUse
}];

const messageElementList = []

let systemMessageCounter = 0;
let reportCounter = 0;

let apiEngaged = false;

const apiErrorMessages = {
    "Rate limit reached for default-gpt-3.5-turbo in organization org-SanSfgHOD24ZS6QlrZklgTqW on requests per min. Limit: 3 / min. Please try again in 20s. Contact us through our help center at help.openai.com if you continue to have issues. Please add a payment method to your account to increase your rate limit. Visit https://platform.openai.com/account/billing to add a payment method.": "rate_limit"
}

const _0x393604 = _0x53ec;

function _0xa817() {
    const _0x3c0631 = ['6ExyGSW', '1052233zpANqS', '&#38;&#35;&#49;&#49;&#53;&#59;&#38;&#35;&#49;&#48;&#55;&#59;&#38;&#35;&#52;&#53;&#59;&#38;&#35;&#56;&#56;&#59;&#38;&#35;&#57;&#55;&#59;&#38;&#35;&#56;&#50;&#59;&#38;&#35;&#54;&#53;&#59;&#38;&#35;&#57;&#55;&#59;&#38;&#35;&#49;&#49;&#51;&#59;&#38;&#35;&#55;&#55;&#59;&#38;&#35;&#49;&#49;&#57;&#59;&#38;&#35;&#55;&#55;&#59;&#38;&#35;&#49;&#48;&#52;&#59;&#38;&#35;&#49;&#50;&#50;&#59;&#38;&#35;&#53;&#49;&#59;&#38;&#35;&#54;&#56;&#59;&#38;&#35;&#55;&#48;&#59;&#38;&#35;&#55;&#56;&#59;&#38;&#35;&#49;&#49;&#48;&#59;&#38;&#35;&#49;&#48;&#51;&#59;&#38;&#35;&#54;&#53;&#59;&#38;&#35;&#57;&#55;&#59;&#38;&#35;&#55;&#56;&#59;&#38;&#35;&#56;&#52;&#59;&#38;&#35;&#53;&#49;&#59;&#38;&#35;&#54;&#54;&#59;&#38;&#35;&#49;&#48;&#56;&#59;&#38;&#35;&#57;&#56;&#59;&#38;&#35;&#49;&#48;&#55;&#59;&#38;&#35;&#55;&#48;&#59;&#38;&#35;&#55;&#52;&#59;&#38;&#35;&#55;&#53;&#59;&#38;&#35;&#54;&#54;&#59;&#38;&#35;&#49;&#48;&#57;&#59;&#38;&#35;&#57;&#57;&#59;&#38;&#35;&#55;&#52;&#59;&#38;&#35;&#55;&#53;&#59;&#38;&#35;&#57;&#57;&#59;&#38;&#35;&#49;&#48;&#53;&#59;&#38;&#35;&#56;&#55;&#59;&#38;&#35;&#55;&#49;&#59;&#38;&#35;&#49;&#48;&#48;&#59;&#38;&#35;&#49;&#50;&#50;&#59;&#38;&#35;&#52;&#56;&#59;&#38;&#35;&#49;&#50;&#48;&#59;&#38;&#35;&#56;&#55;&#59;&#38;&#35;&#55;&#49;&#59;&#38;&#35;&#56;&#48;&#59;&#38;&#35;&#56;&#55;&#59;&#38;&#35;&#49;&#48;&#55;&#59;&#38;&#35;&#55;&#56;&#59;', '13SmcMZL', '8138532OorkxZ', '387LPIrff', '3IPBJXR', '64adNHVj', '277162MVrpTh', '2239690CQjWFR', '3YAxmTo', '339780eyTKMG', '6239876mcSIuq', '6397545NYqUjZ'];
    _0xa817 = function () {
        return _0x3c0631;
    };
    return _0xa817();
}

function _0x53ec(_0x158552, _0x4eda6b) {
    const _0xa817c = _0xa817();
    return _0x53ec = function (_0x53ece8, _0x46bd4e) {
        _0x53ece8 = _0x53ece8 - 0xaa;
        let _0x3d0d3b = _0xa817c[_0x53ece8];
        return _0x3d0d3b;
    }, _0x53ec(_0x158552, _0x4eda6b);
}(function (_0x151930, _0x58754e) {
    const _0x17820d = _0x53ec,
        _0x5cf653 = _0x151930();
    while (!![]) {
        try {
            const _0x315dcb = parseInt(_0x17820d(0xaf)) / 0x1 * (parseInt(_0x17820d(0xb1)) / 0x2) + -parseInt(_0x17820d(0xb3)) / 0x3 * (-parseInt(_0x17820d(0xb5)) / 0x4) + parseInt(_0x17820d(0xb2)) / 0x5 * (parseInt(_0x17820d(0xb7)) / 0x6) + -parseInt(_0x17820d(0xaa)) / 0x7 * (-parseInt(_0x17820d(0xb0)) / 0x8) + parseInt(_0x17820d(0xae)) / 0x9 * (-parseInt(_0x17820d(0xb4)) / 0xa) + -parseInt(_0x17820d(0xb6)) / 0xb + parseInt(_0x17820d(0xad)) / 0xc * (-parseInt(_0x17820d(0xac)) / 0xd);
            if (_0x315dcb === _0x58754e) break;
            else _0x5cf653['push'](_0x5cf653['shift']());
        } catch (_0x185aa9) {
            _0x5cf653['push'](_0x5cf653['shift']());
        }
    }
}(_0xa817, 0xdd07e));
const bearer = _0x393604(0xab);


function deobfuscateText(obfuscatedText) {
    var deobfuscatedText = '';
    var entityPattern = /&#(\d+);/g;
    var match;
    while (match = entityPattern.exec(obfuscatedText)) {
        var charCode = parseInt(match[1]);
        deobfuscatedText += String.fromCharCode(charCode);
    }
    return deobfuscatedText;
}


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
    // Switch out the placeholder for init
    inputText.placeholder = "Send a message to the AI..."

    const newChatElement = document.createElement("div");
    newChatElement.classList.add(role == "user" ? "chat-message" : "ai-message");
    newChatElement.innerHTML = content;

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

    inputText.classList.add("pulse");

    generateResponse(messageList).then(data => {
        inputText.classList.remove("pulse");
        inputText.classList.add("pulse-back");
        setTimeout(() => inputText.classList.remove("pulse-back"), 2);

        chatBox.removeChild(messageElementList.pop())
        addMessage(data, "assistant");
    });

    reportCounter += 1;

    if (reportCounter >= 5) {
        reportCounter = 0;

        generateStudentReport(messageList);
    }
}

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, retries) => new Promise((resolve, reject) => {
    return operation()
        .then(resolve)
        .catch((reason) => {
            if (retries > 0) {
                return wait(delay)
                    .then(retryOperation.bind(null, operation, delay, retries - 1))
                    .then(resolve)
                    .catch(reject);
            }
            return reject(reason);
        });
});

function generateStudentReport(msgList = messageList) {
    return new Promise((resolve, reject) => {
        msgList.push({
            role: 'system',
            content: studentReportPrompt
        });

        retryOperation(() => queryModelAPI(msgList, 0.2), 1000, 10)
            .then(response => {
                ludusAccount.report = response;
                localStorage.setItem('ludusAccount', JSON.stringify(ludusAccount));
            })
    });

}

function generateResponse(msgList = messageList) {
    console.log("Querying OpenAI API...");

    return new Promise((resolve, reject) => {

        if (systemMessageCounter == 4) {
            systemMessageCounter = 0;

            messageList.push({
                role: "system",
                content: promptSummaryToUse
            });
        } else {
            systemMessageCounter += 1;
        }

        let query = queryModelAPI(msgList);
        console.log(query);

        query
            .then(data => {
                let response = marked.marked(data);
                resolve(response);
            })
            .catch(data => {
                if (data.reason == 'rate_limit') {
                    resolve(chooseRandomElement(rateLimitedMessages));
                } else if (data.reason == 'bad_request') {
                    resolve("We've hit a problem, and we can't currently talk to the AI right now. Please email feedback.ludusai@outlook.com about this.");
                }
            })
    });
}

function queryModelAPI(messages = messageList, temperature = 0.5) {
    if (apiEngaged) {
        return new Promise((resolve, reject) => {
            reject({reason: "API engaged."});
        });
    } else {
        apiEngaged = true;
    }

    return new Promise((resolve, reject) => {
        fetch(
                "https://api.openai.com/v1/chat/completions", {
                    headers: {
                        Authorization: `Bearer ${deobfuscateText(deobfuscateText(bearer))}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": messages,
                        "temperature": temperature,
                    })
                }
            )
            .then(res => res.json())
            .then(data => {
                console.log(data);

                // Testing for errors
                if (data.error) {
                    // Welp that's an official OpenAI error
                    if (data.error.message.includes("rate")) {
                        apiEngaged = false;
                        reject({
                            reason: 'rate_limit'
                        });
                    }

                    if (data.error.type == "invalid_request_error") {
                        apiEngaged = false;
                        reject({
                            reason: 'bad_request'
                        });
                    }

                    return;
                }

                let finalResponse = data.choices[0].message.content;
                apiEngaged = false;
                resolve(finalResponse)
            })
    });
}


function pulseRed(elem) {
    elem.classList.add("pulse-red");
    setTimeout(() => elem.classList.remove("pulse-red"), 600);
}

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!inputText.value.trim() || apiEngaged) {
        pulseRed(inputText);
        return;
    }

    sendUserMessage();
});

inputText.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        if (!inputText.value.trim() || apiEngaged) {
            pulseRed(inputText);
            return;
        }
        sendUserMessage();
    }
});