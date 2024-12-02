import React, { useState, useRef, useEffect } from 'react';
import './Index.css';

export default function Index() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);  // State to track listening status
    const welcomeMessageShown = useRef(false);
    const chatboxRef = useRef(null);
    const speechSynthesisRef = useRef(window.speechSynthesis);
    const speechRecognitionRef = useRef(null);  // Ref for speech recognition

    const API_URL = 'http://localhost:5000/chatBotData';

    // Scroll to the bottom of chat
    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatboxRef.current) {
                chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
            }
        }, 100);
    };

    // Create chat li
    const createChatLi = (message, className) => {
        const newMessage = { message, className };
        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        scrollToBottom();
    };

    // Format response from the bot
    const formatResponse = (responseText) => {
        const lines = responseText.split('\n').map((line, index) => {
            const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
        });
        return lines;
    };

    // Send message to API
    const generateResponse = () => {
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        };

        fetch(API_URL, request)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response) {
                    const formattedResponse = formatResponse(data.response);
                    setChatHistory((prevHistory) =>
                        prevHistory.map((msg, index) =>
                            index === prevHistory.length - 1
                                ? { ...msg, message: formattedResponse }
                                : msg
                        )
                    );
                } else {
                    setChatHistory((prevHistory) =>
                        prevHistory.map((msg, index) =>
                            index === prevHistory.length - 1
                                ? { ...msg, message: 'Oops! Something went wrong, please try again.' }
                                : msg
                        )
                    );
                }
                setIsThinking(false);
            })
            .catch(() => {
                setChatHistory((prevHistory) =>
                    prevHistory.map((msg, index) =>
                        index === prevHistory.length - 1
                            ? { ...msg, message: 'Oops! Something went wrong, please try again.' }
                            : msg
                    )
                );
                setIsThinking(false);
            });
    };

    // Handle sending message
    const handleSendMessage = () => {
        if (!userMessage.trim()) return;

        createChatLi(userMessage, 'ChatOutgoing');
        setUserMessage('');
        setIsThinking(true);
        createChatLi('Thinking...', 'ChatIncoming');
        generateResponse();
    };

    // Handle speech recognition start
const handleStartListening = () => {
    if ('webkitSpeechRecognition' in window) {
        // Create a new speech recognition object
        speechRecognitionRef.current = new window.webkitSpeechRecognition();
        speechRecognitionRef.current.lang = 'en-US';
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.interimResults = false;

        speechRecognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
        };

        speechRecognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
        };

        speechRecognitionRef.current.onresult = (event) => {

            if (event.error === 'no-speech') {
                console.log('No speech detected. Keeping the microphone open.');
            }
            
            const transcript = event.results[0][0].transcript;
            setUserMessage(transcript); 
            
        };

        speechRecognitionRef.current.start(); 
    } else {
        alert('Speech Recognition API is not supported in your browser.');
    }
};


    // Handle stop listening
    const handleStopListening = () => {
        if (speechRecognitionRef.current) {
            speechRecognitionRef.current.stop();  // Stop the recognition process
        }
        handleSendMessage();  
    };

    // Read out loud latest response
    const handleReadOutLoud = () => {
        const latestResponse = chatHistory
            .filter((chat) => chat.className === 'ChatIncoming')
            .slice(-1)[0]?.message;
    
        if (latestResponse) {
            const textContent = Array.isArray(latestResponse)
                ? latestResponse.map((msg) => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = msg.props.dangerouslySetInnerHTML.__html;
                    return tempDiv.textContent || tempDiv.innerText || '';
                }).join(' ')
                : latestResponse;
    
            const utterance = new SpeechSynthesisUtterance(textContent);
            speechSynthesisRef.current.speak(utterance);
            setIsSpeaking(true);
    
            utterance.onend = () => {
                setIsSpeaking(false);
            };
        }
    };

    // Stop reading out loud
    const handleStopReading = () => {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
    };

    // Welcome message once on load
    useEffect(() => {
        if (!welcomeMessageShown.current) {
            createChatLi('Welcome to the chatbot! How can I assist you today?', 'ChatIncoming');
            welcomeMessageShown.current = true;
        }
    }, []);

    return (
        <div className="show-chatbot">
            <div className="chatbot">
                <header>
                    <h2>Personal Health Care Bot</h2>
                    <div className="controls">
                        <button
                            onClick={handleStartListening}
                            disabled={isListening || isSpeaking}
                            title="Start Listening">
                            <i className="bx bx-microphone"></i> 
                        </button>
                        <button
                            onClick={handleStopListening}
                            disabled={!isListening || isSpeaking}
                            title="Stop Listening">
                            <i className="bx bx-stop"></i> 
                        </button>
                        <button
                            onClick={handleReadOutLoud}
                            disabled={isSpeaking || chatHistory.length === 0}
                            title="Play">
                            <i className="bx bx-volume-full"></i>
                        </button>
                        <button
                            onClick={handleStopReading}
                            disabled={!isSpeaking}
                            title="Stop">
                            <i className="bx bx-stop"></i>
                        </button>
                    </div>
                </header>
                <ul className="chatbox" ref={chatboxRef}>
                    {chatHistory.map((chat, index) => (
                        <li key={index} className={chat.className}>
                            <div>{Array.isArray(chat.message) ? chat.message : <p>{chat.message}</p>}</div>
                        </li>
                    ))}
                </ul>
                <div className="chat_input">
                    <textarea
                        placeholder="Enter your message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        required
                    />
                    <span id="send_btn" onClick={handleSendMessage}>
                        <i className="bx bx-send"></i>
                    </span>
                </div>
            </div>
        </div>
    );
}
