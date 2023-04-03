const express = require('express')
const http = require('http')
const socket = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();
const authRoute = require('./controller/auth/auth')
const messageRoute = require('./controller/messaging/messaging')
const connectDB = require('./db/connection/connection')
const socketAction = require('./utils/socket')
const path = require('path')
const app = express()
const server = http.Server(app)
const io = socket(server,{
    cors: {
      origin: '*',
    }
})
const port = process.env.PORT || 8000
app.use(express.static('build'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

connectDB().catch(err => console.log(err))
socketAction(io, () =>{
    console.log('[1] * Socket running...')
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use('/auth', authRoute)
app.use('/message', messageRoute) 

server.listen(port, () => {
    console.log('[2] * Server running...')
})