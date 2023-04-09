import React, { useContext } from 'react'
import '../Styles/chatbox.css'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
function Chatbox() {
    const data = useContext(ChatContext).data;
    return (
        <>
            <div className='messageContianer'>
                <h6>Chatting with {data.user.userName}</h6>
                <Messages />
                <Input />
            </div>
        </>
    )
}

export default Chatbox