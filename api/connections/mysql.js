

// LOCALHOST
const mysql=require('mysql')
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'abcde12345',
    database:'finalproject-lastdayv1',
    port:'3306'
})


// DB4FREE
// const mysql=require('mysql')
// const db=mysql.createConnection({
//     host:'db4free.net',
//     user:'mde50526',
//     password:'leathershoes',
//     database:'indodatacamp',
//     port:'3306'
// })


db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('host: '+db.config.host)
        console.log('database '+db.config.database+' is connected')
    }
})

module.exports={db}