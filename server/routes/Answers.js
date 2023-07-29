import express from 'express';
import {postAnswer, deleteAnswer} from '../controllers/Answers.js'
import auth from '../middleware/auth.js'

const router = express.Router();
router.patch('/post/:id', auth, postAnswer)
router.patch('/delete/:id', auth, deleteAnswer)

// router.patch('/post/:id', (req, res)=>{
//     const {id: _id} = req.params;
//     console.log(`Id is: ${_id}`)
//     console.log("Request data:");
//     console.log(req.body);
// })

// router.get('/post/:id', (req, res)=>{
//     const {id: _id} = req.params;
//     console.log("Request data:");
//     console.log(req.body);
//     console.log(`Id is: ${_id}`)
//     res.status(200).send("Check terminal fro response");
// })

export default router;