import express from "express"
import elastic from "elasticsearch"
import bodyParser from 'body-parser'
import verify from "../middlewares.js"
const router = express.Router()

const elasticClient = elastic.Client({
    host : 'localhost:9200', 
});

router.use((req,res,next)=>{
    elasticClient.index({
        index : 'logs1',
        body : {
            url : req.url,
            method : req.method,
        }
    })
    .then(res=>{
        console.log('logs1 indexed')
    })
    .catch(err=>{
        console.log(err)
    })
    next();
});

router.post("/postes",(req,res)=>{
       elasticClient.index({
        index : 'postes',
        body : req.body
    })
     .then(resp=>{
         return res.status(200).json({
             msg :'poste indexed'
         });
     })
     .catch(err=>{
         return res.status(500).json({
             msg :'ERROR',
             err
         });
     })
});

router.delete("/postes/:id",(req,res)=>{
     elasticClient.delete({
        index : 'postes',
        id : req.params.id
    })
    .then(resp=>{
        return res.status(200).json({
            msg :'post deleted'
        });
    })
    .catch(err=>{
        return res.status(500).json({
            msg :'ERROR',
            err
        });
    })
});

router.get("/postes",  (req, res) => {
     elasticClient.search({
      index: "postes",
      body :{"query": { "match_all" : {} }},
    })
    .then(resp=>{
        return res.send(resp.hits.hits);
              
        })
    .catch(err=>{
        return res.status(500).json({
            msg :'ERROR',
            err
        });
    })
});   

router.get("/postes/:id",  (req, res) => {
    elasticClient.get({
     index: "postes",
     id : req.params.id
   })
   .then(resp=>{
       return res.status(200).json({
        resp
    });
       })
   .catch(err=>{
       return res.status(500).json({
           msg :'ERROR',
           err
       });
   })
});   

router.put("/postes/:id",(req,res)=>{
    console.log(req.body)
    elasticClient.update({
       index : 'postes',
       refresh:"wait_for",
       id : req.params.id,
       body:{
        doc : req.body
       }
   })
   .then(resp=>{
       return res.status(200).json({
           msg :'post updated'
       });
   })
   .catch(err=>{
       return res.status(500).json({
           msg :'ERROR',
           err
       });
   })
});


export default router;
