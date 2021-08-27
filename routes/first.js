var express = require('express')
var router = express.Router() 
var pool = require('./pool')
const upload = require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/first',function(req,res){
    res.render('firstPage',{msg:" ",status:" ",view:" ",show:" ",cur:" "}) ;
})


router.get('/signup',function(req,res){
    res.render('signupPage') ;
})

router.get('/dashboard',function(req,res){
    try{
    var student  = localStorage.getItem('STUDENT');
    if(!student)
    {
        res.redirect('/first/first') ;
    }
    }catch(e)
    {
        res.redirect('/first/first') ;
    }
    res.render('dashboard',{stat:" "}) ;
})

router.get('/getInTouch',function(req,res){
    res.render('contact') ;
})

router.get('/studentsignup',function(req,res){
    res.render('student') ;
})

router.get('/facultysignup',function(req,res){
    res.render('faculty') ;
})
router.get('/newPassword',function(req,res){
    res.render('newPassword') ;
})
router.get('/adminDashboard',function(req,res){
  res.render('admin',{cur:"",msg:""})
})

router.get('/homeAdmin',function(req,res)
{
    try{
        var admin = localStorage.getItem('ADMIN');
        if(!admin){
    res.redirect('/first/adminDashboard')
        }else
        {
            res.render('adminEnter')
        }
    }catch(e)
    {
        res.redirect('/first/adminDashboard')
    }
})

router.get('/checkAdmin',function(req,res){
    pool.query('select * from admin where emailId=? and password=?',[req.query.emailid,req.query.password],function(error,result){
        if(error)
        { 
            res.render('admin',{cur:"Server Error"})
        }
        else{
            if(result.length==1){
            localStorage.setItem('ADMIN',result[0])  
            res.render('adminEnter',{result:result[0]});
            }else
            {
                res.render('admin',{cur:"Invalid Credentials"})
            }
        }
            });
})

router.get('/adminLogout',function(req,res)
{
    localStorage.clear() ;
    res.redirect('/first/adminDashboard')
})
// router.get('/updatePassword',function(req,res){
//     console.log(req.query.dob) ;
//     pool.query('select * from studentinfo where email = ? and dob =?',[req.query.mail,req.query.dob],function(error,result){
//         console.log(result)
//         if(error)
//         {
//             res.render('firstPage',{msg:" ",show:" ",status:" ",view:"New Password is not set.. Server ERROR"})
//         }
//         else{
//             if(result.length==1){
//                const newResult = JSON.stringify(result)
//                 console.log(newResult.studentId)
//                 pool.query('update studentinfo set password=? where studentId=?',[req.query.pswd,result.studentId],function(err,resut){
//                     if(err)
//                     {
//                         res.render('firstPage',{msg:" ",show:" ",status:" ",view:"Server Error..."})  
//                     }else
//                     {
//                         res.render('firstPage',{msg:" ",show:" ",status:" ",view:"Password Updates Successfully"}) 
//                     }
//                 })
//             }else
//             {
//                 res.render('firstPage',{msg:" ",show:" ",status:" ",view:"Invalid Credentials"}) 
//             }
//         }
//     })
// })

router.get('/chkStudent',function(req,res){
    pool.query('select * from studentinfo where email=? and password=?',[req.query.emailid,req.query.password],function(error,result){
        if(error)
        {
            res.render('firstPage',{msg:" ",show:" ",status:"Server Error",view:" "})
        }else
        {
           if(result.length==1)
           {
               localStorage.setItem('STUDENT',result[0])
               res.render('dashboard',{'result':result[0],'msg':null}) ;
           }else
           {
               res.render('firstPage',{msg:" ",show:" ",status:"Invalid Credentials",view:" "})
           } 
        }
    })
})

router.get('/studentLogout',function(req,res){
    localStorage.clear() ;
    res.render('firstPage',{msg:" ",show:" ",status:" ",view:" "})
})

router.get('/registerStudent',function(req,res){
    pool.query('insert into studentinfo (fname, mname, lname, gender, dob, address, institute, course, semester, roolNum, department, email, mobile, password, notes)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[req.query.fname,req.query.mname,req.query.lname,req.query.gender,req.query.dob,req.query.address,req.query.collg,req.query.course,req.query.sem,req.query.rollnum,req.query.dept,req.query.mail,req.query.mob,req.query.pswd,req.query.notes],function(error,result){
        console.log(error)
        if(error)
        {
            res.render('firstPage',{msg:"Server ERROR...",show:" ",status:" ",view:" "})
        }else
        {
            
            res.render('firstPage',{msg:"Account Created Successfully",show:" ",status:" ",view:" "})
        }
    })
    
})

router.get('/contactCustomer',function(req,res){
    pool.query('insert into msgdata (name, email, subject, message)values(?,?,?,?)',[req.query.name,req.query.mailid,req.query.sub,req.query.msg],function(error,result){
        if(error)
        {
            res.render('firstPage',{msg:" ",show:"Server Error..Message not Delivered",status:" ",view:" "})
        }else
        {
            res.render('firstPage',{msg:" ",show:"Message Delivered Successfully",status:" ",view:" "})
        }
    })
})

router.get('/addAssignment',function(req,res){
    res.render('uploadAssignment',{sit:" "})
})

router.post('/uploadassg',upload.single('resume'),function(req,res){
    pool.query('insert into adminuploadassg (institute, course, assignmentnumber, semester, subject, uploaddate, duedate, file,department,faculty)values(?,?,?,?,?,?,?,?,?,?)',[req.body.institute,req.body.course,req.body.assgnum,req.body.sem,req.body.subject,req.body.udate,req.body.ddate,req.body.myfilename,req.body.dept,req.body.faculty],function(error,result){
        console.log(error)
        if(error)
        {
            res.render('uploadAssignment',{sit:"Server Error"})
        }else
        {
            res.render('uploadAssignment',{sit:"Assignment Uploaded Successfully "})
        }
    })
})


router.get('/assgStudent',function(req,res){
    pool.query('select * from adminuploadassg where semester=? and department=?',[req.query.sem,req.query.dept],function(error,result){
        
        if(error)
        {
            res.render('dashboard',{stat:"Server Error"})
        }else
        {
            
            res.render('studentAssgPage',{data:result,dept:req.query.dept,rollnum:req.query.rollnum})
            
        }
    })
})

router.get('/stdAssg',function(req,res){
    pool.query('select * from studentAssignment',function(error,result){
        res.render('submittedAssignment',{data1:result}) ;
    })
})

router.post('/stdUpldAssgn',upload.single('file'),function(req,res)
{
    var d = new Date() ;
    
    pool.query('insert into studentAssignment ( subject, faculty, assignmentNumber, file,submittedDate,semester,department,rollnum) values(?,?,?,?,?,?,?,?)',[req.body.sname,req.body.fname,req.body.assign_no,req.body.myfilename,d,req.body.sem,req.body.dept,req.body.rollnum],function(error,result)
    {
        
        if(error)
        {
            res.render('submittedAssignment',{data:[]});
        }else
        {
            pool.query('select * from studentAssignment',function(error,result){
                // console.log(result)
                res.render('submittedAssignment',{data1:result}) ;
            })
            
        }
})
})

router.get('/viewAssgn',function(req,res){
    res.render('viewAssignment',{data:[],msg:'false'})
})

router.get('/viewassg',function(req,res){
   pool.query('select * from studentassignment where subject=? and department=? and semester=? ',[req.query.subject,req.query.dept,req.query.sem],function(error,result){
       console.log(result)
    if(error)
    {
        res.render('viewAssignment',{data:[],msg:null})
    }else
    {
        if(result.length>0)
        res.render('viewAssignment',{data:result,msg:'true'})
        else
        res.render('viewAssignment',{data:result,msg:'No Result Found'})
    }
   })
})

router.get('/editAssignment',function(req,res)
{
    res.render('editAssignment',{msg:null})
})
router.get('/showUplodedAssignment',function(req,res)
{
    pool.query('select * from adminuploadassg where subject=? and department=? and semester=? ',[req.query.subject,req.query.dept,req.query.sem],function(error,result){
       console.log(req.query.dept)
     if(error)
     {
       
     }else
     {
         if(result.length>0)
        res.render('editAssignment',{data:result,msg:'true'})
        else
        res.render('editAssignment',{data:result,msg:'No Result Found'})
     }
    })
})

router.get('/deleteAssignment',function(req,res){
    pool.query('delete from adminuploadassg where assignmentnumber=?',[req.query.assgnum],function(error,result){
        if(error)
        {
            res.redirect('/first/showUplodedAssignment')
        }else
    {
        res.redirect('/first/showUplodedAssignment',{})
    }
    })
})

module.exports = router;