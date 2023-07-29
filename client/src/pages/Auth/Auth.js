import React, { useState /*, useEffect*/ } from 'react'
import './Auth.css'
import icon from '../../assets/icon.png'
import AboutAuth from './AboutAuth'

import { useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { signup, login } from '../../actions/auth'

const Auth = () => {

    const [isSignUp, setIsSignUp] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [userAuthDone, setUserAuthDone] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSwitch = () =>{
        setIsSignUp(!isSignUp)
    }

    // useEffect(() => {
    //     function checkUserData() {
    //       const item = localStorage.getItem('Profile')
      
    //       console.log(item);
    //       if (item) {
    //         setUserAuthDone(item)
    //         navigate('/')
    //       }
    //     }
      
    //     window.addEventListener('storage', checkUserData)
      
    //     return () => {
    //       window.removeEventListener('storage', checkUserData)
    //     }
    //   }, [navigate])

    const handleSubmit = (e) =>{
        e.preventDefault();
        // console.log({name, email, password})

        if(!email){
            alert("Please enter email");
            return false;
        }
        
        if(!password){
            alert("Please enter password");
            return false;
        }

        if(isSignUp){
            if(!name){
                alert("Please enter name");
                return false
            }

            dispatch(signup({name, email, password},navigate))

        }else{
            dispatch(login({email, password},navigate))
        }

        
    }

  return (
    <section className='auth-section'>
        {isSignUp && <AboutAuth/>}
        <div className='auth-container-2'>
            { !isSignUp && <img src={icon} alt="Stackoverflow Icon" className='login-logo' />}
            <form onSubmit={handleSubmit}>
                {
                    isSignUp && (
                        <label htmlFor='name'>
                            <h4>Display Name</h4>
                            <input type="text" name='name' id="name" onChange={(e)=> {setName(e.target.value)}} />
                        </label>
                    )
                }

                <label htmlFor='email'>
                    <h4>Email</h4>
                    <input type="email" name="email" id="email" onChange={(e)=> {setEmail(e.target.value)}}/>
                </label>
                <label htmlFor='password'>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <h4>Password</h4>
                        {!isSignUp && <p style={{color:"#007ac6",fontSize:"13px"}}>Forgot password</p>}
                    </div>
                    <input type="password" name="password" id="password" onChange={(e)=> {setPassword(e.target.value)}}/>
                    {isSignUp && <p style={{color:"#666767",fontSize:"13px"}}>Passwords must contain atleast eight<br/>characters, including atleast 1 number and 1<br/>letter</p>}
                </label>
                {
                    isSignUp && (
                        <label htmlFor='check'>
                            <input type="checkbox" name='check' id="check" />
                            <p style={{fontSize:"13px"}}>Opt-in to receive occasional<br/>product updates, user research invitations<br/>company announcements and digests</p>
                        </label>
                    )
                }
                <button type='submit' className='auth-btn'>{isSignUp? 'Sign Up': 'Log in'}</button>
                {
                    isSignUp && (
                        <p style={{color:"#666767",fontSize:"13px"}}>By clicking "Sign Up", you agree to our <span style={{color:"#007ac6"}}>terms of<br/>service</span>,<span style={{color:"#007ac6"}}>privacy policy</span> and <span style={{color:"#007ac6"}}>cookie policy</span></p>
                    )
                }
            </form>
            <p>
                {isSignUp?'Already an account?':"Don't have an account"}
                <button type="button" className='handle-switch-btn' onClick={handleSwitch}>{isSignUp?"Login":"Sign Up"}</button>
            </p>
        </div>
    </section>
  )
}

export default Auth