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
        res.send(`Hi ${username}. Your have ${BALANCES[username]}$$`)
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

app.listen(4000)

//here anymalware that copies or steals this cookie can still login as the user
//to solve this problem session-ids come in play -- session-ids can keep track of every palce(active sessions)
//the user is logged in. So to remove an active session that session-id is removed from database
//Now if session ids are generated incrementally for each session login
//then these sessionId values are still small enough or easily generated for a hacker to guess other values
// So that wont work.. :(

//Setting cookies in DOM
// document.cookie = 'name=katy'
// document.cookie = 'food=apple; Path=/'   doing this does not overwrite previous cookies but adds new cookies
// document.cookie = 'name=; Expires=Thu, 01 Jan 1970 00:00:00 GMT'  --- Awesome way to remove cookie (sarcasm)
// only food cookie is left after this
// Securing through Path is not safe because it possible to embed an iframe into a subdomain on pages with similar
//domain and using the iframe the cookies and be stolen using iframe.contentDocument.cookie api
//Demo of above:
// On CS 106A site
//document.cookie = 'awesome=this; Path=/class/cs106a'

//On CS 253 site
//const iframe = document.createElement('iframe')
//iframe.src = 'https://web.stanford.edu/class/cs106a'
//document.body.appendChild(iframe)
//console.log(iframe.contentDocument.cookie)
