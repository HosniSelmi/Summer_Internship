import express from "express"
import elastic from "elasticsearch"
import bodyParser from 'body-parser'
const router = express.Router()

const elasticClient = elastic.Client({
    host : 'localhost:9200', 
});


router.post("/tags",  (req, res) => {
    elasticClient.search({
     index: "candidats",
     body :{"query": { "match" : req.body  }},
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

export default router;