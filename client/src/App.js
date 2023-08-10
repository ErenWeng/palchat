import './App.css';
import io from 'socket.io-client'
import { useState } from 'react'
import Chat from './Chat'

const socket = io.connect('http://localhost:3001')

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (formValid()) {
      socket.emit('join_room', room)
      setShowChat(true)
    }
  }

  const formValid = () => {
    if (!username) {
      alert('Name is required')
      return false
    } else if (!room) {
      alert('Room ID is required') 
      return false
    } else {
      return true
    }
  }

  return (
    <div className='App'>
      {!showChat ?
      (
        <div className='joinChatContainer'>
          <h3>Join A Chat</h3>
          <div className='joinInput'>
            <span>Name:</span>
            <input
              type='text'
              onChange={event => {
                setUsername(event.target.value)
              }}
            />
          </div>
          <div className='joinInput'>
            <span>Room ID:</span>
            <input
              type='text'
              onChange={event => {
                setRoom(event.target.value)
              }}
            />
          </div>
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
