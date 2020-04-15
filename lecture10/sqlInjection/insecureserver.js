const express = require('express')
const cookieParser = require('cookie-parser')
const {createReadStream} = require('fs')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')
const htmlEscape = require('html-escape')

const {Database} = require('sqlite3').verbose()

const db = new Database('db')

db.on('trace', console.log)
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, balance INT, UNIQUE(username))')
    db.run('INSERT OR IGNORE INTO users VALUES ("alice", "pass1", 500), ("bob", "hunter2", 100), ("charlie", "this-is-a-bad-good-password-12457545", 100000)')
    db.run('CREATE TABLE IF NOT EXISTS logs (log TEXT)')
})

process.on('SIGINT', () => {
    db.close(() => process.exit())
})

const COOKIE_SECERT = 'supersecret'

const app = express()
app.use(cookieParser(COOKIE_SECERT))
app.use(bodyParser.urlencoded({extended: false}))

//super cool database
const USERS = {alice: 'pass1', bob: 'pass2'}
const BALANCES = {alice: 500, bob: 100, charlie: 1000000}

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
    const {username, password} = req.body
    
    //db.exec(`INSERT INTO logs VALUES ("Login attemp from ${username}")`)
    
    const query = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`
    
    // db.get returns only one item even if multiple items are returned
    db.get(query, (err, row) => {
        if(err || !row) {
            res.send('fail!')
            return
        }
        //send cookie to client
        const nextSessionId = randomBytes(16).toString('base64')
        SESSIONS[nextSessionId] = row.username
        res.cookie('sessionId', nextSessionId, {
            // secure: true //cant do here because we are on localhost
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 30*24*60*60*1000 // 30days
        })
        res.redirect('/')
    })
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


//1. If username is given as bob" -- 
//the query becomes SELECT * FROM users WHERE username = "bob" --" AND password = ""
//so query ends at SELECT * FROM users WHERE username = "bob" and rest just becomes a comment

//2. If username is given as "OR 1=1  this selects all the users but because we are using db.get
// it returns the first user. So we get logged in as first user
//SELECT * FROM users WHERE username = ""OR 1=1 --" AND password = ""

//3. cannot tac on multiple queries using the username because db.get does not support multiple
// queries. However other apis from sqlite like db.exec do allow multiple queries to get executed
// with db.exec if username is given as "); UPDATE users SET password = "root" WHERE username = "bob" --
//both queries 1 from db.exec and another from sql injection are executed
//INSERT INTO logs VALUES ("Login attemp from ");
//UPDATE users SET password = "root" WHERE username = "bob" --")