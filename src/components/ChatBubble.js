import React from 'react'
import '../Styles/chatbubble.css'



function ChatBubble({ friend, chat, img }) {

    let color1 = "#2E4F4F"
    let color2 = "#0E8388"
    let style1 = { backgroundColor: color1, textAlign: "start" }
    let style2 = { backgroundColor: color2, textAlign: "end" }
    let class1 = "row justify-content-end";
    let class2 = "row justify-content-start"



    return (
        <div className={friend ? class2 : class1} style={{}}>

            <div className='col-1 ms-4 me-4 mt-3 chatBubble  mb-2' style={friend ? style1 : style2} >
                <div style={{ display: 'flex', flexDirection: "column" }}>
                    {img ? <img src={img} style={{ width: "150px", maxHeight: "200px", objectFit: 'cover' }} /> : ""}
                    {chat}
                </div>
            </div>

        </div>
    )
}

export default ChatBubble