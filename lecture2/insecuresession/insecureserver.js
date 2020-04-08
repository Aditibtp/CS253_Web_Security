const express = require('express')
const cookieParser = require('cookie-parser')
const {createReadStream} = require('fs')
const bodyParser = require('body-parser')

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))

//super cool database
const USERS = {alice: 'pass1', bob: 'pass2'}
const BALANCES = {alice: 500, bob: 100}

app.get('/', (req, res) => {
    const username = req.cookies.username
    if(username) {
        res.send(`Hi ${username}. Your have ${BALANCES[username]}$$`)
    }else{
        createReadStream('index.html').pipe(res)
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]
    if(password === req.body.password){
        res.cookie('username', username)
        res.redirect('/')
    }else{
        res.send('fail!!')
    }
})

app.listen(4000)

//here we can edit the cookies in the browser dev-tools