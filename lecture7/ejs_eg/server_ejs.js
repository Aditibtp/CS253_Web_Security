const express = require('express')
const ejs = require('ejs')

const app = express()

//here if by mistake we change <%= to <%- the ejs escaping does not work
app.get('/', (req, res) => {
    const name = req.query.name || 'some name'
    const template = `
    <h1>Hi, <%= name %>. </h1>
    `
    const html = ejs.render(template, {name})

    res.send(html)
})

app.listen(4000)