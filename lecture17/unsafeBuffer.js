const _Buffer = require('buffer').Buffer
function Buffer (...args) {
    return typeof args[0] === 'number' ? _Buffer.allocUnsafe(...args) 
    : new _Buffer(...args)
}

const express = require('express')

const app = express()

// Visit /api/convert?data={"str" : "hello", "type": "hex"}
app.get('/api/convert', (req, res)=>{
    //if the arg is not valid json the parse function throws an exception
    const data = JSON.parse(req.query.data)
    if(!data.str){
        throw new Error('missing data.str')
    }
    if(data.type !== 'hex' && data.type !== 'base64' && data.type !== 'utf8'){
        throw new Error('data.type is invalid')
    }

    res.send(convert(data.str, data.type))
})

function convert(str, type) {
    //if(typeof str != 'string') str = String(str)
    // ***deprecated now***
    //one possible fix for unsafe Buffer API call
    //if(typeof str != 'string') str = String(str)
    return new Buffer(str).toString(type)
}

//listen is an unsafe api -- if an IP address is not passed as a second argument then it listens to any connections
// on port 4000-- passing the ip address says only let browsers on the same machine connect to port 4000
// and not listen to connections from outside
app.listen(4000, '127.0.0.1')

//if the data is changed to a type number the server starts returning raw server memory (comes from malloc) memory
//used by process earlier which could contain sensitive data -- kinda similar to heartbleed