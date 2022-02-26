const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')
const jwtt=require('express-jwt')
const config= require('../config')
const auth = async (req, res, next) => {
    try {
        // console.log(req)
        const token = req.header("Authorization")

        if(!token) return res.status(400).json({msg: "Invalid Authentication."})
        
        let decoded = await jwtt.verify(token,jwtSecret)
        
        // console.log(decoded)
        // if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

       
        
        req.user = decoded
        console.log(req.user)
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth