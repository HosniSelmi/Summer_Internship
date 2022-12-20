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
        index : 'logs',
        body : {
            url : req.url,
            method : req.method,
        }
    })
    .then(res=>{
        console.log('logs indexed')
    })
    .catch(err=>{
        console.log(err)
    })
    next();
});

router.post("/candidats",verify,(req,res)=>{
       elasticClient.index({
        index : 'candidats',
        body : req.body
    })
     .then(resp=>{
         return res.status(200).json({
             msg :'candidat indexed'
         });
     })
     .catch(err=>{
         return res.status(500).json({
             msg :'ERROR',
             err
         });
     })
});

router.delete("/candidats/:id",verify,(req,res)=>{
     elasticClient.delete({
        index : 'candidats',
        id : req.params.id
    })
    .then(resp=>{
        return res.status(200).json({
            msg :'candidat deleted'
        });
    })
    .catch(err=>{
        return res.status(500).json({
            msg :'ERROR',
            err
        });
    })
});

router.get("/candidats", verify, (req, res) => {
     elasticClient.search({
      index: "candidats",
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

router.get("/candidats/:id",  verify,(req, res) => {
    elasticClient.get({
     index: "candidats",
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

router.put("/candidats/:id", verify, (req,res)=>{
    elasticClient.update({
       index : 'candidats',
       id : req.params.id,
       body:{
        doc : req.body
       }
   })
   .then(resp=>{
       return res.status(200).json({
           msg :'candidat updated'
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
