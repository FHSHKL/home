const drow_color=["white","red","yellow","blue","orange","purple","green","black"];
function client_main(){
    const drow_color=["white","red","yellow","blue","orange","purple","green","black"];
    var s=document.getElementById(`drow`);
    if(!s){
        var cls=document.createElement("style");
        cls.innerHTML=".drower{border-left:solid 1px #eee;border-top:solid 1px #eee;width:50px;height:50px;position:absolute;cursor:pointer;background:white;}";
        document.head.appendChild(cls);
        s=document.createElement("div");
        s.setAttribute("id",`drow`);
        s.setAttribute("class","mes");
        s.setAttribute("style",`width:487px;height:410px;position:relative;`);
        document.getElementById("content").appendChild(s);
        var can=document.createElement("canvas");
        can.setAttribute("id","drower");
        can.setAttribute("width",468);
        can.setAttribute("height",407);
        s.appendChild(can);
        var cxt=can.getContext("2d");
        for(var i=0;i<8;i++){
            drow_data[i]=drow_data[i]||[];
            for(var j=0;j<8;j++){
                cxt.fillStyle=drow_color[drow_data[i][j]||0];
                cxt.fillRect(51*i,51*j,50,50);
            }
        }
        for(var i=0;i<8;i++){
            cxt.fillStyle=drow_color[i];
            cxt.fillRect(51*8+10,51*i,50,50);
        }
        cxt.fillStyle=drow_color[ncol];
        can.onclick=function(e){
            var y=parseInt(e.offsetY/51);
            var x=parseInt(e.offsetX/51);
            if(e.offsetX<=408){
                client.send(`/drow ${x} ${y}`);
                return;
            }
            if(e.offsetX>=418){
                client.send(`/drow ${y}`);
                return;
            }
        };
    }
}
function build(){
    app_data[app_name]={
        "message":[],
        "debug":0
    };
}
if(args[1]=="build"){
    build();
    return;
}
app_data[app_name].message.push(args);
if(app_data[app_name].lock){
    return;
}
app_data[app_name].lock=true;
var data=app_data[app_name];
console.log(data);
while(data.message.length){
    var mess=data.message.pop();
    var user_name=mess[0];
    console.log("nmsl");
    if(data.debug){
        console.log(`[ser-deb]${app_name}:${data.toString()}`);
    }
    if(mess[1]=="init"){
        console.log(data[user_name]);
        if(!data[user_name]){
            data[user_name]={
                "data":[],
                "color":7
            }
        }
        var messs=`/web command var drow_data=${JSON.stringify(data[user_name].data)};var ncol=${data[user_name].color};${client_main.toString()}client_main()`;
        client[user_id].fhs_send(messs.replace(/\n/ig,''));
        continue;
    }
    if(mess[1]=="update"){
        delete app[app_name];
        continue;
    }
    if(mess[1]=="debug"){
        data.debug^=1;
        continue;
    }
    if(mess[1]=="data"){
        console.log((data[user_name].data));
        client[user_id].fhs_send(JSON.stringify(data[user_name].data));
        continue;
    }
    if(mess.length==2){
        data[user_name].color=mess[1];
        client[user_id].fhs_send(`/web command document.getElementById("drower").getContext("2d").fillStyle="${drow_color[mess[1]]}"`);
    }
    else if(mess.length==3){
        var x=mess[1];
        var y=mess[2];
        data[user_name].data[x]=data[user_name].data[x]||[];
        data[user_name].data[x][y]=data[user_name].color;
        client[user_id].fhs_send(`/web command document.getElementById("drower").getContext("2d").fillRect(${x*51},${y*51},50,50)`);
    }
}
delete data.lock;
app_data[app_name]=data;