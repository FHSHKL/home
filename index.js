const fhs=require('fhs');
const exec = require('child_process').exec;

const server_list=[
    "main"
];
const pre_server_list=[
    "nat","talk"
];

var server=[];

for(var i=0;i<server_list.length;i++){
    server[i]=exec(`node ${fhs.config.dir}/${server_list[i]}/index.js`,{});
    server[i].stdout.on('data',function(data){
        process.stdout.write(`[ser-ifo]name:\x1B[32m${server_list[i]}\x1B[39m id:\x1B[32m${i}\x1B[39m data:\n\x1B[32m${data}\x1B[39m`);
    })
}