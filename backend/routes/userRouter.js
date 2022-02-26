const router = require('express').Router()
const jwt=require('express-jwt')
// const { config } = require('dotenv')

const config=require('../config')
const userCtrl = require('../controllers/userCtrl')
const auth=require('../middlewares/auth')


// console.log("im jere")
router.get('/', userCtrl.find)
router.get('/:userId', userCtrl.get)
router.post('/', userCtrl.create)
router.patch('/:userId', userCtrl.patch)




module.exports = router