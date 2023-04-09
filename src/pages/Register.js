import React from 'react'
import bear from '../images/bear.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';


function Register() {

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const userName = event.target[0].value;
        const email = event.target[1].value;
        const pass = event.target[2].value;
        const file = event.target[3].files[0];
        console.log(userName);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass)
            console.log(res);

            const storageRef = ref(storage, email);

            const uploadTask = uploadBytesResumable(storageRef, file);


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

                        await updateProfile(res.user, {
                            displayName: userName,
                            photoURL: downloadURL
                        })
                        console.log('File available at', downloadURL);
                        console.log(res.user)
                        await setDoc(doc(db, "Users", res.user.uid), {
                            uid: res.user.uid,
                            userName,
                            email,
                            photoURL: downloadURL
                        })


                    });
                }
            );

            await setDoc(doc(db, "UserChats", res.user.uid), {})
            navigate("/");



        } catch (e) {
            alert(e.message)
            console.log(e.message);
        }
    }

    return (
        <>
            <div className='contianer registerContainer'>
                <h1 className='display-3 mb-3'>Register Yourself</h1>
                <div className='container-sm registerForm'>
                    <form onSubmit={handleSubmit}>
                        <div className='photo'>
                            <label htmlFor='photo' className='form-label'>
                                <img className='ms-2' style={{ cursor: "pointer" }} src={bear} alt="bear" width={100} />
                            </label>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='userName' className='form-label'>
                                Username
                            </label>
                            <input type='text' className='form-control' id='userName'>
                            </input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>
                                Email Address
                            </label>
                            <input type='email' className='form-control' id='email'>
                            </input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='pass' className='form-label'>
                                Enter Password
                            </label>
                            <input type='password' className='form-control' id='pass'>
                            </input>
                        </div>
                        <div>
                            <input style={{ display: "none" }} type='file' className='form-control' id='photo'>
                            </input>
                        </div>
                        <div className='registerButton'>
                            <button className='btn btn-primary'>Register Me</button>
                        </div>
                    </form>
                </div>
                <Link to="/login" className='mt-2 link-underline link-underline-opacity-0'>I already have account let me signIn!</Link>
            </div>
        </>
    )
}

export default Register