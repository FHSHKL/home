const user={
    "name":args[2],
    "psw":args[3]
}
if(user.psw){
    user.psw=fhs.md5(user.psw);
}
if(args[1]=="login"){
    if(client[user_id].log){
        return `[ser-err]have loged`;
    }
    if(log[user.name]>-1){
        return `[ser-err]user have loged on another client!`;
    }
    if(!data[user.name]||data[user.name].psw!=user.psw){
        return `[ser-eer]wrong username or password`;
    }
    log[user.name]=user_id;
    client[user_id].log=user.name;
    client.forEach((cli)=>{
        if(cli.send){
            cli.send(`/web add_user ${user.name}`);
        }
    })
    return `[ser-mes]login successful`;
}
if(args[1]=="logon"){
    if(client[user_id].log){
        return `[ser-err]have loged`;
    }
    if(data[user.name]){
        return `[ser-err]please choose an unused user name`;
    }
    data[user.name]={
        "psw":user.psw,
        "message":[]
    };
    return `[ser-mes]logon successful`;
}
if(args[1]=="logout"){
    var name=client[user_id].log;
    delete log[client[user_id].log];
    delete client[user_id].log;
    client.forEach((cli)=>{
        if(cli&&cli.send){
            cli.send(`/web remove_user ${name}`);
        }
    })
    return `[ser-mes]logout successful`;
}
if(args[1]=="set"){
    if(user.name=="name_name"){
        if(data[user.psw]){
            return `[ser-err]please choose an unused user name`;
        }
        data[user.psw]=data[client[user_id].log];
        delete data[client[user_id].log];
        client[user_id].log=user.psw;
    }
    else{
        data[client[user_id].log].psw=user.psw;
    }
    return `${user.name} set successful!`;
}