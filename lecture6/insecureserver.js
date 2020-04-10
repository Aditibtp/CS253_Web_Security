const express = require('express')
const cookieParser = require('cookie-parser')
const {createReadStream} = require('fs')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')

/************** HTML ESCAPE ***************/
const htmlEscape = require('html-escape')
/************** HTML ESCAPE ***************/

const COOKIE_SECERT = 'supersecret'

const app = express()
app.use(cookieParser(COOKIE_SECERT))
app.use(bodyParser.urlencoded({extended: false}))

//super cool database
const USERS = {alice: 'pass1', bob: 'pass2'}
const BALANCES = {alice: 500, bob: 100}

const SESSIONS = {} //sessionId -> username to sessionId

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    //not using htmlEscape causes source param to get executed
    const source = htmlEscape(req.query.source)
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
        res.send(
            `<h1>
                ${source ? `Hi ${source} reader!` : ''} 
                Login to your bank account:
            </h1>
            <form method='POST' action='/login'>
                Username:
                    <input name='username' />
                Password:
                    <input name='password' type='password' />
                    <input type='submit' value='Login' />
            </form>
            `
        )
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]
    if(password === req.body.password){
        //send cookie to client
        const nextSessionId = randomBytes(16).toString('base64')
        res.cookie('sessionId', nextSessionId, {
            // secure: true //cant do here because we are on localhost
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 30*24*60*60*1000 // 30days
        })
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
    res.clearCookie('sessionId', {
        httpOnly: true,
        sameSite: 'lax'
    })
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

//Here in the source query param if a <script> tag is given then it will 
//get executed by the browser in the bank's window context. 
//html-escape npm module fixes this issue -- by using this the <script> tag just ends up
//rendering as it is instead of getting executed in the browser window. 
//The left angle brackets get replaced by  less then html entiteis &lt; 
//which neutralises the script.

