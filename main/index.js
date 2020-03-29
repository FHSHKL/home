const fs = require('fs');
const http = require('http');
const https = require('https');
const fhs = require('fhs');
const mime = require('mime');

function get_file(file) {try {return fs.readFileSync(file);}catch (err){return undefined;}}
function save_file(dir,file){return fs.writeFileSync(dir,file);}
function check_file(dir){return fs.existsSync(dir)}
function append_file(dir,file){return fs.appendFileSync(dir,file);}

var html=http.createServer();
var htmls=https.createServer({
    key: fs.readFileSync(`${fhs.config.dir}/main/fhs.key`),
    cert: fs.readFileSync(`${fhs.config.dir}/main/fhs.crt`)
});

function work_message(request,responce,ser_type,post_data){
    var url=decodeURIComponent(request.url);
    if(url[url.length-1]=='/'){
        url+="index";
    }
    var ask=(url.match(/\?[\s|\S]+/g)||[undefined])[0];
    if(ask){
        url=url.replace(/\?[\s|\S]+/g,'');
        ask=ask.slice(1);
    }
    console.log(`[ser-web]url:${url} ask:${ask} post:${JSON.stringify(post_data)}`);
    var web_cli=get_file(`${fhs.config.dir}/main${url}`);
    if(!web_cli){
        responce.writeHead(404);
        responce.end();
        return;
    }
    var res_head=[200,{
        "content-type":mime.getType(url)||"text/html",
        "charset":"utf-8"
    }];
    if(res_head[1]["content-type"].match(/application|text/i)){
        web_cli=web_cli.toString('utf-8');
        for(var i=0;i<web_cli.length;i++){
            if(web_cli.slice(i-1,i+1)=="<?"){
                var ta=i+1;
                while(ta<web_cli.length-1&&(web_cli[ta]!='?'||web_cli[ta+1]!='>'))ta++;
                i=web_cli.length-i;
                var bef=web_cli.slice(0,web_cli.length-i-2+1);
                var aft=web_cli.slice(ta+2,web_cli.length+1);
                var mid;
                try{
                    mid=eval(`(function(){${web_cli.slice(web_cli.length-i+1,ta-1+1)}})(this)`)||"";
                }
                catch(err){
                    mid="\"server-err\"";
                    console.log(err);
                }
                web_cli=bef+mid+aft;
                i=web_cli.length-i;
            }
        }
        web_cli=web_cli.replace(/  |\t|\n/ig,'');
    }
    responce.writeHead(res_head[0],res_head[1]);
    responce.write(web_cli);
    responce.end();
}

htmls.on("request",function(request,responce){
    if(request.method=="POST"){
        var post='';
        request.on('data', function(chunk){    
            post += chunk;
        });
        request.on('end', function(){    
            post = JSON.parse(post);
            work_message(request,responce,"https",post);
        });
        return;
    }
    work_message(request,responce,"https");
})
html.on("request",function(request,responce){
    if(request.method=="POST"){
        var post='';
        request.on('data', function(chunk){    
            post += chunk;
        });
        request.on('end', function(){    
            post = JSON.parse(post);
            work_message(request,responce,"http",post);
        });
        return;
    }
    work_message(request,responce,"http");
})
html.listen(6801);
htmls.listen(6800);
