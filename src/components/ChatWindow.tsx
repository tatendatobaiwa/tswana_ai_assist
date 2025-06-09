import React, { useEffect, useRef } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  audioUrl?: string; // Optional for AI responses or user voice input
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window" style={{
      flexGrow: 1,
      overflowY: 'auto',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9f9f9'
    }}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender}`}
          style={{
            marginBottom: '8px',
            padding: '8px 12px',
            borderRadius: '18px',
            maxWidth: '70%',
            wordWrap: 'break-word',
            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: message.sender === 'user' ? '#007bff' : '#e0e0e0',
            color: message.sender === 'user' ? 'white' : 'black',
          }}
        >
          {message.text}
          {message.audioUrl && (
            <audio controls src={message.audioUrl} style={{ width: '100%', marginTop: '5px' }} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow; 