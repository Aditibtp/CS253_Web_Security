const express = require('express')
const { exec } = require('child_process')

const COMMAND = 'calc.exe'

const app = express()

app.get('/', (req, res) =>{
    exec(COMMAND, err =>{
        if(err) res.status(500).send(err.stack)
        else res.status(200).send('Success')
    })
})

app.listen(4000, '127.0.0.1')

//making a request from browser launches the calculator fro just a get request
//another webpage(different origin) if knows about the port on which the local server is
//running can also make the same request to the local server.