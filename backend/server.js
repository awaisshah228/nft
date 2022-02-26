require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')


const app = express()

app.use(cors())
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(app)


app.use(express.urlencoded({ extended: true }));
app.use(express.json());






// Routes
app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/users", require("./routes/userRouter"));



const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
    // if(process.env.NODE_ENV === 'production'){
        app.use(express.static(path.join(__dirname,'build')))
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname,'build','index.html'))
        })
    // }
    // console.log(path.join(__dirname,'..','frontend','build','index.html','dfjslj'))
    
    const port = process.env.PORT || 5000
    http.listen(PORT, () => {
        console.log('Server is running on port', PORT)
    })
})

