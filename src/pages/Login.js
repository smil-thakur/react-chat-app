import React from 'react'
import '../Styles/Login.css'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    async function loginButton(event) {
        event.preventDefault();
        const email = event.target[0].value;
        const pass = event.target[1].value;

        try {

            await signInWithEmailAndPassword(auth, email, pass);
            navigate("/");


        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <>
            <div className='contianer loginContainer'>
                <h1 className='display-3 mb-3'>login Yourself</h1>
                <div className='container-sm loginForm'>
                    <form onSubmit={loginButton}>
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
                        <div className='loginButton'>
                            <button className='btn btn-primary'>login</button>
                        </div>
                    </form>
                </div>
                <Link to='/register' className='mt-2 link-underline link-underline-opacity-0'>I don't have account let me Register!</Link>
            </div>
        </>
    )
}

export default Login