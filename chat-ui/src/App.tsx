import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }])
      setMessage('')

      // Placeholder AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: 'This is a placeholder response. The orchestrator will be connected later.',
          sender: 'ai'
        }])
      }, 500)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Healthcare AI Chat</h1>
        <p>CMPS 411 Capstone Project - Template v0.1</p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Welcome! This is a basic template.</p>
              <p>Try editing <code>src/App.tsx</code> and see changes instantly.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default App
