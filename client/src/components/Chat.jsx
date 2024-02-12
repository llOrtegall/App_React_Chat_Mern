import { useContext, useEffect, useState } from 'react'
import { uniqBy } from 'lodash'
import { UserContext } from '../context/UserConterx'
import { SensIcon, ChatIcon } from './Icons'
import { Avatar } from './Avatar'

export function Chat () {
  const [ws, setWs] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { id } = useContext(UserContext)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3030')
    setWs(ws)
    ws.addEventListener('message', handleMessage)
  }, [])

  function ShowOnlinePeople (peopleArray) {
    const people = {}

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username
    })

    setOnlinePeople(people)
  }

  function handleMessage (event) {
    const messageData = JSON.parse(event.data)
    if ('online' in messageData) {
      ShowOnlinePeople(messageData.online)
    } else if ('text' in messageData) {
      setMessages(prev => ([...prev, { ...messageData }]))
    }
  }

  function sendMessage (e) {
    e.preventDefault()
    ws.send(
      JSON.stringify({
        message: {
          recipient: selectedUserId,
          text: newMessage
        }
      }))

    setNewMessage('')

    setMessages(prev => ([...prev, {
      text: newMessage,
      sender: id,
      recipient: selectedUserId,
      id: Date.now()
    }]))
  }

  const onlinePeopleExcluOurUser = { ...onlinePeople }
  delete onlinePeopleExcluOurUser[id]

  const messageWithoutDuper = uniqBy(messages, 'id')

  return (
    <section className="flex h-screen">

      <main className="w-1/3 bg-white flex flex-col">
        <h3 className='mx-auto text-blue-700 font-semibold text-lg py-2 flex'>
          <ChatIcon />
          Chat Gane Multired
        </h3>
        {
          Object.keys(onlinePeopleExcluOurUser).map(userId => (
            <section key={userId} onClick={() => setSelectedUserId(userId)}
              className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-50' : ''}`}>
              {userId === selectedUserId && (
                <div className='w-1 bg-blue-500 h-full rounded-r-md'></div>
              )}
              <div className='flex gap-2 items-center py-2 pl-2'>
                <Avatar username={onlinePeople[userId]} userId={userId} />
                <span className='text-gray-800'>{onlinePeople[userId]}</span>
              </div>

            </section>
          ))
        }
      </main>

      <div className="flex flex-col bg-blue-100 w-2/3 p-2">
        <section className='flex-grow'>
          {
            !selectedUserId && (
              <div className='flex h-full items-center justify-center'>
                <span className='text-gray-500'>&larr; Select a user to start chatting</span>
              </div>
            )
          }
          {
            !!selectedUserId && (
              <section className='relative h-full'>
                <div className='overflow-y-scroll absolute inset-0'>
                  {messageWithoutDuper.map((message, index) => (
                    <div key={index} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-2 my-2 rounded-md text-sm ${message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}>
                        sender:{message.sender}<br />
                        my id: {id}<br />
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }
        </section>

        {!!selectedUserId && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
            <input type="text" placeholder="Type your message" value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="bg-white border p-2 rounded-md flex-grow" />
            <button type='submit'
              className="bg-blue-500 p-2 text-white rounded-md">
              <SensIcon />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
