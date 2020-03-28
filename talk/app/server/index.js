(function(){
    if(client[user_id].log!="admin"){
        return `[ser-err]please login as admin`;
    }
    function save(){
        console.log("[ser-sav]");
        fs.writeFileSync("./app_data.json",JSON.stringify(app_data),function(err){
            if(err){
                console.log(`[ser-err]:${err}`);
            }
        })
        fs.writeFileSync("./user_data.json",JSON.stringify(data),function(err){
            if(err){
                console.log(`[ser-err]:${err}`);
            }
        })
        return "[ser-mes]saved";
    }
    if(args[1]=="save"){
        save();
    }
    if(args[1]=="stop"){
        save();
        process.exit();
    }
    if(args[1]=="kill"){
        process.exit();
    }
})(this)