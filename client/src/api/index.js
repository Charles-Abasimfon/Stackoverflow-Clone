import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('Profile')){
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('Profile')).token}`
    }
    return req;
})

export const logIn =  (authData) => API.post('/user/login',authData,{headers:{"Content-Type" : "application/json"}})
export const signUp =  (authData) => API.post('/user/signup',authData,{headers:{"Content-Type" : "application/json"}})

export const postQuestion = (questionData) => API.post('/questions/Ask', questionData)
export const getAllQuestions = () => API.get('/questions/get');

export const postAnswer = (id, noOfAnswers,answerBody, userAnswered) => API.patch(`/answer/post/${id}`,{
    noOfAnswers,answerBody, userAnswered},{headers:{"Content-Type" : "application/json"}})

export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`,{headers:{"Content-Type" : "application/json"}}) 

export const deleteAnswer = (id, answerId, noOfAnswers) => API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers},{headers:{"Content-Type" : "application/json"}})

export const voteQuestion = (id, value ) => API.patch(`/questions/vote/${id}`, { value })

export const getAllUsers = () => API.get('/user/getAllUsers');
export const updateProfile = (id, updateData) => API.patch(`/user/update/${id}`, updateData)
