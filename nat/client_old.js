const net=require('net');
const server=new net.Socket();
const port=6804;
const hostname="huokulou.tk";
server.setEncoding('utf-8');

console.log(process.argv);
const client={
    "type":process.argv[2],
    "name":process.argv[3]
};
if(client.type!="server"&&client.type!="client"){
    console.log("argv error");
}
console.log(client);

var servers;

server.connect(port,hostname,function(){
    console.log(`[cli-ifo]server connected`);
    server.on('data',function(mes){
        console.log(`[ser-mes]${mes}`);
        mes=JSON.parse(mes);
        if(mes.opt=="con"){
            if(client.type=="server"){
                if(servers){
                    return;
                }
                servers=new net.createServer();
                servers.listen(server.localPort);
                servers.on('connection',function(clients){
                    console.log(`[p2p-ifo]connected`);
                    clients.write(`start`);
                    clients.on('data',function(mes){
                        console.log(`[p2p-mes]${mes}`);
                        setTimeout(function(){
                            clients.write(`server->client`);
                        },1000);
                    })
                })
            }
            else{
                servers=new net.Socket();
                servers.setEncoding('utf-8');
                servers.connect(mes.port,mes.ip,function(){
                    console.log(`[p2p-ifo]connected`);
                    servers.on('data',function(mes){
                        console.log(`[p2p-mes]${mes}`);
                        setTimeout(function(){
                            servers.write(`client->server`);
                        },1000);
                    })
                })
            }
        }
    })
    server.on('error',function(err){
        console.log(`[ser-err]${err}`);
    })
    server.on('close',function(){
        console.log(`[ser-ifo]server closed`);
    })
    server.write(JSON.stringify(client));
    /*
    setInterval(function(){
        
    },1000);*/
})