import React, { useEffect, useState } from 'react'
import './Chat.css'

const Chat = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        id: socket.id,
        room,
        username,
        currentMessage,
        time: Date.now(),
      }
      await socket.emit('send_message', messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage('')
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  const timeFormat = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(timestamp)
  }

  return (
    <div className="chatWindow">
      <div className='chat-header'>
        <p>Room: { room }</p>
      </div>
      <div className='chat-body'>
        {messageList.map((messageData) => {
          return (
            <div
              key={messageData.id + messageData.time}
              className={`message ${username === messageData.username ? 'me' : 'other'}`}
            >
              <div className='message-content'>
                <span>{messageData.username}: </span>
                <span>{messageData.currentMessage}</span>
              </div>
              <div className='message-time'>
                <span>{ timeFormat(messageData.time) }</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='Hey...'
          onChange={event => {
            setCurrentMessage(event.target.value)
          }}
          onKeyPress={event => {
            event.key === 'Enter' && sendMessage()
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
