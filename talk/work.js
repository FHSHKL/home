const ws = require('ws');
const fhs = require('fhs');
const fs = require('fs');
const net = require('net');
const WebSocketServer = ws.Server;

var app={},log={},data={},app_data={};
var client=[];

app_data=JSON.parse((fhs.get_file(`${fhs.config.dir}/talk/app_data.json`)||"{}").toString());
data=JSON.parse((fhs.get_file(`${fhs.config.dir}/talk/user_data.json`)||"{}").toString());

function check_message(user,user_id){
    if(log[user]!=undefined){
        var message=data[user].message||[];
        for(var i=0;i<message.length;i++){
            client[log[user]].fhs_send(message[i]);
        }
        data[user].message=[];
    }
}

function get_user(str){
    var res=str.match(/[a-z|0-9]+/ig);
    var user={
        "name":res[0],
        "psw":res[1]
    };
    return user;
}

function send(a,user_id){
    var user=get_user(a);
    var mes=a.replace(/[a-z|0-9]+ /i,'');
    if(data[user.name]){
        data[user.name].message.push(`${client[user_id].log}-pri:${mes}`);
        check_message(user.name);
        return `[ser-mes]send successful`;
    }
    else{
        return `[ser-err]unknown user`;
    }
}

function work_command(a,user_id){
    var args=a.match(/[^ ]+/ig);
    const app_name=args[0];
    if(args[0]!="/re"){
        args[0]=client[user_id].log;
    }
    app[app_name]=app[app_name]||fhs.get_file(`./app${app_name}/index.js`);
    if(!app[app_name]){
        return `[ser-err]unknown command`;
    }
    try{
        return eval(`(function(){${app[app_name]}})(this)`);
    }
    catch(err){
        console.log(err);
        return `[app-err]${app_name}`;
    }
}

function work_message(a,user_id){
    console.log(`uid:${user_id} mes:${a}`);
    if(!client[user_id].log&&a.slice(0,4)!="/re "){
        client[user_id].fhs_send("please login first!");
        return;
    }
    if(a[0]=='/'){
        var res=work_command(a,user_id);
        if(res){
            client[user_id].fhs_send(res);
        }
    }
    else{
        client.forEach((cli)=>{
            if(!cli||!cli.log){
                return;
            }
            cli.fhs_send(`${client[user_id].log}:${a}`);
        })
    }
}

function server_run(){
    const ter_server=net.createServer();
    const web_server=new WebSocketServer({
        port:6803
    })
    var trash_point=[];

    console.log(data);
    console.log(app_data);

    function get_user_list(){
        var usl=[];
        for(var i=0;i<client.length;i++){
            if(client[i].log){
                usl.push(client[i].log);
            }
        }
        return usl;
    }

    function get_point(){
        return trash_point.length?trash_point.pop():client.length;
    }

    function remove_point(user_id){
        if(client[user_id].log){
            delete log[client[user_id].log];
        }
        if(user_id==client.length-1){
            client.pop();
            return;
        }
        if(client[user_id].log){
            delete log[client[user_id].log];
        }
        client[user_id]=null;
        trash_point.push(user_id);
    }

    ter_server.on('connection',(cli)=>{
        cli.setEncoding('utf8');
        cli.id=get_point();
        cli.fhs_send=cli.write;
        client[cli.id]=cli;
        cli.on('data',(mes)=>{
            work_message(mes,cli.id);
        })
        cli.on('close',(err)=>{
            remove_point(cli.id);
        })
        cli.on('error',(err)=>{
            remove_point(cli.id);
        })
    })
    web_server.on('connection',(cli)=>{
        cli.id=get_point();
        var too=`/web user ${get_user_list()}`;
        cli.send(too);
        cli.fhs_send=cli.send;
        client[cli.id]=cli;
        cli.on('message',(mes)=>{
            work_message(mes,cli.id);
        })
        cli.on('close',(err)=>{
            remove_point(cli.id);
        })
        cli.on('error',(err)=>{
            remove_point(cli.id);
        })
    })

    ter_server.listen(6804);
}

server_run();