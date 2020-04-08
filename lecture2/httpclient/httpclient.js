const dns = require('dns')
const net = require('net')

//https://nodejs.org/api/dns.html#dns_dns_lookup_hostname_options_callback
dns.lookup('example.com', (err, address) => {
    if(err) throw err

    //opens a socket on address:port
    const socket = net.createConnection({
        host: address,
        port: 80
    })

    const request = `
GET / HTTP/1.1
Host: example.com

`.slice(1)
    console.log(address) //print dns resolved address
    socket.write(request) //Sends data on the socket.
    socket.pipe(process.stdout)
    //socket.destroy()
})
//the terminal does not exit because socket was not closed.

//if the host is removed from the request we might get a HTTP-400 (bad request) because it 
//is pausible that one ip address could host many domains. So a specific host is needed,
//especially here, since we do a dns lookup and get an ip-address