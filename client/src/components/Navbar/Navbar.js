import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import search from '../../assets/search-solid.svg'
import Avatar from '../../components/Avatar/Avatar'
// import Button from '../../components/Button'
import { useSelector, useDispatch } from 'react-redux'
import './Navbar.css'
import { setCurrentUser } from '../../actions/currentUser'
import decode from 'jwt-decode'

const Navbar = () => {
    const dispatch = useDispatch()
    const User = useSelector((state)=> state.currentUserReducer)
    const navigate = useNavigate();

    useEffect(()=>{
        const token = User?.token 
        if(token){
            const decodedToken = decode(token)
            // console.log("decoded token is: ", decodedToken)
            // console.log(`Token wil expire on: ${decodedToken.exp * 1000}`)
            // console.log(`Current time is ${new Date().getTime()}`)
            if(decodedToken.exp * 1000 < new Date().getTime()){
                // handleLogout()
                // react cribs about missing dependency of handleLogout
                // broke dry rule here
                dispatch({ type: 'LOGOUT'});
                navigate('/')
                dispatch(setCurrentUser(null))
            }
        }
        dispatch(setCurrentUser( JSON.parse(localStorage.getItem('Profile'))))
    },[User?.token,dispatch,navigate])

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT'});
        navigate('/')
        dispatch(setCurrentUser(null))
    }
    

  return (
    <nav className='main-nav'>
        <div className="navbar">
            <Link to='/' className='nav-item nav-logo'>
                <img src={logo} alt="Logo" />
            </Link>
            <Link to='/' className='nav-item nav-btn'>About</Link>
            <Link to='/' className='nav-item nav-btn'>Products</Link>
            <Link to='/' className='nav-item nav-btn'>For Teams</Link>
            <form>
                <input type="text" placeholder='Search..' name="" id="" />
                <img src={search} alt="Search Icon" width="18" className='search-icon' />
            </form>
            {User === null 
            ? 
            <Link to='/Auth' className='nav-item nav-links'>Log In</Link> 
            :
            <>
                
                    <Avatar backgroundColor='#009dff' px="5px" py="7px" borderRadius="50%" color="white">
                    <Link to={`/Users/${User?.result?._id}`} style={{color:"white", textDecoration:'none'}}>
                        {Array.from(User.result.name)[0].toUpperCase()}
                        </Link>
                    </Avatar>
                {/* <Button>Log out</Button> */}
                <button className='nav-item nav-links' onClick={handleLogout}>Log out</button>
            </>
            }
        </div>
    </nav>
  )
}

export default Navbar