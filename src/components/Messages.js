import React, { useContext, useEffect, useState, useRef } from 'react'
import '../Styles/messages.css'
import ChatBubble from './ChatBubble'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { CharContextProvider, ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

function Messages() {



    const [messages, setMessages] = useState([]);
    const currentUser = useContext(AuthContext).currentUser
    const [chats, setChats] = useState([])
    const data = useContext(ChatContext).data;

    const ref = useRef()

    useEffect(() => {

        ref.current.scrollTop = ref.current.scrollHeight;

    }, [messages])


    useEffect(() => {
        const onsub = onSnapshot(doc(db, "chats", data.chatid), (doc) => {
            if (doc.exists()) {
                let temp = doc.data().messages
                setMessages(temp)
            }
        })



        return () => {
            onsub();
        }
    }, [data.chatid])

    console.log(messages);
    console.log(currentUser.uid)



    return (
        <div ref={ref} className='cotainer messages'>

            {messages.length == 0 ? <ChatBubble friend={true} chat="select friend to chat with" /> : messages.map((message) => {
                console.log("message " + message.message)
                return <ChatBubble friend={currentUser.uid !== message.sender} chat={message.message} img={message.img} />

            })}
        </div>
    )
}

export default Messages