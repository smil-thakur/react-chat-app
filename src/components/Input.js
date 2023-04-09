import React, { useContext } from 'react'
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from '../firebase';


function Input() {


    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [isloading, setIsloading] = useState(false)

    const currentUser = useContext(AuthContext).currentUser
    const data = useContext(ChatContext).data

    async function sendMessage() {

        setIsloading(true)

        if (image) {
            //send image and text
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, image);

            try {
                uploadTask.on('state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                    },
                    () => {

                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                            await updateDoc(doc(db, "chats", data.chatid), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    message: text,
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL
                                })
                            })


                        });
                    }
                );

            } catch (err) {
                alert(err.message)
            }

        }
        else {
            //send only text
            await updateDoc(doc(db, "chats", data.chatid), {
                messages: arrayUnion({
                    id: uuid(),
                    message: text,
                    sender: currentUser.uid,
                    date: Timestamp.now()
                })
            })

        }

        await updateDoc(doc(db, "userchats", currentUser.uid), {
            [data.chatid + ".latestMessage"]: {
                text
            },
            [data.chatid + ".date"]: serverTimestamp()

        })
        await updateDoc(doc(db, "userchats", data.user.uid), {
            [data.chatid + ".latestMessage"]: {
                text
            },
            [data.chatid + ".date"]: serverTimestamp()

        })

        setIsloading(false)
        setText("")
        setImage(null)

    }

    return (
        <div className='input-group m-2' style={{ width: "fit-content" }}>
            {isloading ? "sending message wait..." :
                <>
                    <input value={text} onChange={(event) => { setText(event.target.value) }} type="text" className="form-control" placeholder="write your message" aria-label="Recipient's username" aria-describedby="button-addon2" />
                    <button onClick={() => { sendMessage() }} className="btn btn-primary" type="button" id="button-addon2">Send</button>
                    <input onChange={(e) => { setImage(e.target.files[0]) }} style={{ display: 'none' }} type='file' id='photo'></input>
                    <label htmlFor='photo' className="btn btn-danger" type="button" id="button-addon2">file</label>
                </>
            }
        </div>
    )
}

export default Input