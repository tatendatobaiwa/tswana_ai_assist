import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onVoiceInputClick: () => void; // Placeholder for voice input
  isRecording: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onVoiceInputClick, isRecording }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '10px',
      padding: '10px',
      borderTop: '1px solid #eee',
      backgroundColor: '#f1f1f1',
      borderRadius: '0 0 8px 8px'
    }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message in Setswana..."
        style={{
          flexGrow: 1,
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 15px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#28a745',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
      <button
        type="button"
        onClick={onVoiceInputClick}
        style={{
          padding: '10px 15px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: isRecording ? '#dc3545' : '#007bff',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        {isRecording ? 'Stop Recording' : 'Voice Input'}
      </button>
    </form>
  );
};

export default MessageInput; 