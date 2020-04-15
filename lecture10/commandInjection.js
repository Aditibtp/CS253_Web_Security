const childProcess = require('child_process')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send(`
        <h1> File viewer </h1>
        <form method='GET' action='/view'>
            <input name='filename' />
            <input type='submit' value='Submit' />
        </form>
    `)
})

app.get('/view', (req, res) => {
    const { filename } = req.query
    //const stdout = childProcess.execSync(`cat ${filename}`)
    //escaped user input spawnSync
    //https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
    //error shown -- cat: 'some.txt; ls': No such file or directory
    //This is still unsafe because user can move directories and access files eg. ../lecture9/somefile.js
    const child = childProcess.spawnSync('cat', [filename])
    if(child.status !== 0){
        res.send(child.stderr.toString())
    }else{
        res.send(child.stdout.toString())
    }
    
})

app.listen(4000, '127.0.0.1')

// inject a command as node commandInjection.js  some.txt; ls