import express from 'express'
import db_connection from './DB/db.connection.js';
import './DB/models/models.associations.js'
import usercontrollor from './modules/Users/users.controllor.js'
import postcontrollor from './modules/Posts/posts.controllor.js'
import commentcontrollor from './modules/Comments/comments.controllor.js'
import helmet from 'helmet'
import env from 'dotenv'
const app=express();
app.use(helmet())
env.config()
const port=process.env.PORT ||3000


app.use(express.json())


app.use('/users',usercontrollor)
app.use('/posts',postcontrollor)
app.use('/comments',commentcontrollor)

 await db_connection()

app.use((err, req, res, next) => {
  res.status(500).send(`something wrong: ${err.message}`);
});

app.listen(port,()=>{
    console.log(`port ${port} is running....`)
})