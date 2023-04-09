import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatbox from '../components/Chatbox'
import '../Styles/home.css'

function Home() {
    return (
        <div className='container mainFrame'>

            <div className='chatWindow m-2'>
                <Sidebar username={"Link"} />
                <Chatbox />
            </div>
        </div>
    )
}

export default Home