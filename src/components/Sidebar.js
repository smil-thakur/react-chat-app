import React, { useContext, useState, useEffect } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import '../Styles/sidebar.css'
import { db } from '../firebase';
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import '../Styles/loading.css'
import bear from '../images/bear.png'
import { ChatContext } from '../context/ChatContext';

function Sidebar() {

    const currentUser = useContext(AuthContext).currentUser;
    const { dispatch } = useContext(ChatContext);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {

        const getFriends = () => {
            const unsub = onSnapshot(doc(db, "userchats", currentUser.uid), (doc) => {
                setFriends(doc.data());
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getFriends();

    }, [currentUser.uid])


    async function searchUser(event, username, btn) {

        if (event.code === "Enter" || btn == true) {
            setIsLoading(true);
            setUsers([]);
            //search for user
            console.log(username);
            const allUsers = collection(db, "Users");
            const user = query(allUsers, where("userName", "==", username));
            try {
                const querySnapshot = await getDocs(user);
                querySnapshot.forEach((doc) => {
                    if (doc.data().email !== currentUser.email) {
                        setUsers(users => [...users, doc.data()]);
                    }
                })
                console.log(users);
            }
            catch (err) {
                alert(err.message);
            }
            if (users.length === 0) {
                setMessage("No user found")
            }
            setIsLoading(false);
        }

    }

    function selectChatuser(user) {

        dispatch({ type: "CHANGE_USER", payload: user });

    }


    async function selectUser(user) {

        console.log(user.uid)
        //we will store chats by combining the email id of both the parties
        //check if there are already chatting or not
        //create new if it does not exists
        const chatID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        console.log("chatId " + chatID)
        try {
            const res = await getDoc(doc(db, "chats", chatID));
            console.log(res.exists());
            if (!res.exists()) {
                await setDoc(doc(db, "chats", chatID), { messages: [] });

                await setDoc(doc(db, "userchats", currentUser.uid), {})
                await updateDoc(doc(db, "userchats", currentUser.uid), {
                    [chatID + ".userInfo"]: {
                        uid: user.uid,
                        userName: user.userName,
                        photoURL: user.photoURL,

                    },
                    [chatID + ".date"]: serverTimestamp()
                });
                await setDoc(doc(db, "userchats", user.uid), {})
                await updateDoc(doc(db, "userchats", user.uid), {
                    [chatID + ".userInfo"]: {
                        uid: currentUser.uid,
                        userName: currentUser.displayName,
                        photoURL: currentUser.photoURL,

                    },
                    [chatID + ".date"]: serverTimestamp()
                })
            }
            setUsers([])
            setUsername("")
            console.log("lol" + username)
        }
        catch (err) {
            alert(err.message)
        }
    }

    function onCrossClicked() {
        setMessage(""); setUsername([]); setUsers([]);
    }

    return (
        <>
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div style={{ cursor: "pointer" }} data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                        <div style={{ display: 'flex', direction: "row", alignItems: "center" }}>
                            <img className='me-2' src={currentUser.photoURL} alt='your profile picture' height="50px" width="50px" style={{ borderRadius: "100%", objectFit: "cover" }} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h1>{currentUser.displayName}</h1>
                                <h6>{currentUser.email}</h6>
                            </div>
                        </div>
                        <p className='ms-2 mt-2'>view all contacts</p>
                    </div>
                    <div className='mt-2'>
                        <button onClick={() => signOut(auth)} className='btn btn-danger'>LogOut</button>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">Find a User</h5>
                    <button onClick={onCrossClicked} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">


                    <div>

                        <div className='input-group mb-3'>
                            <input value={username} id='searchuser' type="text" placeholder="Search user" name="text" className="form-control" onKeyDown={(e) => { searchUser(e, username, false) }} onChange={(e) => { setUsername(e.target.value) }} />
                            <button onClick={(e) => { searchUser(e, username, true) }} className='btn btn-primary'>search</button>
                        </div>

                        <ol class="list-group list-group-numbered" style={{ cursor: "pointer" }}>
                            {isLoading ?
                                <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div class="newtons-cradle">
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                    </div>
                                </div> : users.length == 0 ? message :
                                    users.map((user) => {
                                        return (
                                            <li data-bs-dismiss="offcanvas" key={user.email} onClick={() => { selectUser(user) }} class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">
                                                    <div class="fw-bold">{user.userName}</div>
                                                    {user.email}
                                                </div>
                                                <span class="">
                                                    <img src={user.photoURL} height="30px" width="30px" style={{ borderRadius: "100%", objectFit: "cover" }} />
                                                </span>
                                            </li>
                                        )
                                    })}
                        </ol>
                        <h2 className='mt-2'>Friends with</h2>
                        <ol class="list-group list-group-numbered" style={{ cursor: "pointer" }}>
                            {isLoading ?
                                <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div class="newtons-cradle">
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                        <div class="newtons-cradle__dot"></div>
                                    </div>
                                </div> : friends == null ? "No Friends" :
                                    Object.entries(friends).sort((a, b) => b[1].date - a[1].date).map((friend) => {
                                        return (
                                            <li data-bs-dismiss="offcanvas" key={friend[0]} onClick={() => { selectChatuser(friend[1].userInfo) }} class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">
                                                    <div class="fw-bold">{friend[1].userInfo.userName}</div>
                                                    {/* {friend[1].latestMessage.text} */}
                                                </div>
                                                <span class="">
                                                    <img src={friend[1].userInfo.photoURL} height="30px" width="30px" style={{ borderRadius: "100%", objectFit: "cover" }} />
                                                </span>
                                            </li>
                                        )
                                    })}
                        </ol>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar