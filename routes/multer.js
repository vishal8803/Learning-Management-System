var multer=require('multer');
var uniqid=require('uniqid');
var serverpath=multer.diskStorage({
    destination:(req,file,path)=>{
        path(null,'public/images')
    },
    filename:(req,file,path)=>{
        var name=uniqid()+file.originalname.substr(file.originalname.indexOf('.'))
        req.body['myfilename']=name
        path(null,name)
    }
})
var upload=multer({storage:serverpath})
module.exports=upload;