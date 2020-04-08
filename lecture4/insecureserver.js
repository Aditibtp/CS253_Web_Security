const express = require('express')
const cookieParser = require('cookie-parser')
const {createReadStream} = require('fs')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')

const COOKIE_SECERT = 'supersecret'

const app = express()
app.use(cookieParser(COOKIE_SECERT))
app.use(bodyParser.urlencoded({extended: false}))

//super cool database
const USERS = {alice: 'pass1', bob: 'pass2'}
const BALANCES = {alice: 500, bob: 100}

const SESSIONS = {} //sessionId -> username to sessionId

app.get('/', (req, res) => {
    //const username = req.signedCookies.username
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    //check if cookie is already set on the client
    if(username) {
        res.send(` Hi ${username}. Your have ${BALANCES[username]}$$
                <form method='POST' action='/transfer'>
                    Send amount:
                        <input name='amount' />
                        To user:
                        <input name='to' />
                        <input type='submit' value='Send' />
                </form>
            `
        )
    }else{
        createReadStream('index.html').pipe(res)
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]
    if(password === req.body.password){
        //send cookie to client
        const nextSessionId = randomBytes(16).toString('base64')
        res.cookie('sessionId', nextSessionId)
        SESSIONS[nextSessionId] = username
        res.redirect('/')
    }else{
        res.send('fail!!')
    } 
})

app.get('/logout', (req, res) => {
    //cleared by setting a date in the past for expiration time on the cookie
    const sessionId = req.cookies.sessionId
    delete SESSIONS[sessionId]
    res.clearCookie('sessionId')
    res.redirect('/')
})

app.post('/transfer', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    console.log(username)

    if(!username){
        res.send('fail!!')
        return
    }

    const amount = Number(req.body.amount)
    const to = req.body.to
    BALANCES[username] -= amount
    BALANCES[to] += amount

    res.redirect('/')
})

app.listen(4000)

