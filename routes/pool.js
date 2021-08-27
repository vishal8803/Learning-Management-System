var mysql=require ("mysql")
var pool =mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'123@1',
    database:'learningmanagement',
    connectionLimit:100,
    multipleStatements:true
})

module.exports=pool