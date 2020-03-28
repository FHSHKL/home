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
    server[i]=exec(`node ${fhs.config.dir}/${server_list[i]}/index.js`,function(err,sto){
        console.log(err,sto);
        if(err){
            console.log(`[ser-err]name:${server_list[i]} id:${i} err:${err}`);
        }
        if(sto){
            console.log(`[ser-ifo]name:${server_list[i]} id:${i} err:${err}`);
        }
    })
}