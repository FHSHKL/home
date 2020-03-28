const net=require('net');
const port=6804;
const hostname='127.0.0.1';

var clients=[],gar=[];

var server={};

const nat_server=new net.createServer();

nat_server.on('connection',(client)=>{
    console.log(client.remoteAddress,client.remotePort);
    function get_point(){
        if(gar.length){
            return gar.pop();
        }
        else{
            return clients.length;
        }
    }
    function remove_client(id){
        if(id==clients.length-1){
            clients.pop();
        }
        else{
            gar.push(id);
            //clients[id]=null;
        }
    }
    client.data={
        "opt":"con",
        "port":client.remotePort,
        "ip":client.remoteAddress.match(/\d+.\d+.\d+.\d+/)[0]
    }
    client.data.id=get_point();
    clients[client.data.id]=client;
    client.on('data',function(mes){
        console.log(`[ser-mes]uid:${client.data.id} mes:${mes}`);
        console.log(server);
        mes=JSON.parse(mes);
        if(mes.type=="server"){
            server[mes.name]=client.data.id;
        }
        else if(mes.type=="client"){
            if(server[mes.name]!=undefined){
                clients[server[mes.name]].write("{\"opt\":\"con\"}")
                client.write(JSON.stringify(clients[server[mes.name]].data));
            }
        }
    })
    client.on('error',function(){
        console.log(`[cli-err]uid:${client.id}`);
        remove_client(client.id);
    })
    client.on('close',function(){
        console.log(`[cli-clo]uid:${client.id}`);
        remove_client(client.id);
    })
})
nat_server.listen(port,function(){
    console.log(`[ser-ifo]server is running`);
})