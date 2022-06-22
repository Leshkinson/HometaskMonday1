import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {bloggersRouter} from "./routers/bloggers-router";
import {postsRouter} from "./routers/posts-router";


const app = express();
const port = process.env.PORT || 7777;

app.use(cors());
app.use(bodyParser.json())

app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

app.listen(port,() => {
    console.log(`Example App listening on port ${port}`)
})

