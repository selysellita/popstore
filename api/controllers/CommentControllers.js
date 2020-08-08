const {db}=require('../connections/mysql')

module.exports={
    allComments:(req,res)=>{
        const {idproduct}=req.query
        var sql=`select c.*, u.username from comments c join users u on c.iduser=u.iduser join products p on c.idproduct = p.idproduct where c.idproduct=${idproduct}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    addNewComment:(req,res)=>{
        const {comment,iduser}=req.body
        const {idproduct}=req.params
        var newcomment={
            comment,
            iduser,
            idproduct
        }
        console.log(comment)
        console.log(iduser);
        console.log(newcomment);
        
        var sql=`insert into comments set ?`
        db.query(sql,newcomment,(err,result)=>{
            
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    }
}