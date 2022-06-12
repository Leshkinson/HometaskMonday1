import express,{Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

const app = express();
const port = process.env.PORT || 7777;
const bloggers = [{id: 1, name: 'Leshkinson', youtubeUrl: 'https://www.youtube.com/c/Leshkinson'}];
const posts = [{
    id: 1,
    title: "Anything",
    shortDescription: "Bla-bla",
    content: "flnae;lrbn'aern'gnae'rnaeknrbnernaennn",
    bloggerId: 1,
    bloggerName: 'Leshkinson'
}]

app.use(cors());
app.use(bodyParser.json())

app.get('/bloggers', (req: Request, res: Response) => {
    res.send(bloggers)
});

app.post('/bloggers',(req: Request, res: Response) => {
    const newName = req.body.name;
    const newYoutubeUrl = req.body.youtubeUrl;
    const patternURL = new RegExp(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
    if(!newName || newName.length > 15) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Name has incorrect length",
                    field: "name"
                }
            ]
        })
        return;
    }
    if (typeof newName !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Name has incorrect value",
                    field: "name"
                }
            ]
        })
        return;
    }
    if (!newYoutubeUrl || newYoutubeUrl.length > 100 || !patternURL.test(newYoutubeUrl)) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "YoutubeUrl has incorrect length",
                    field: "youtubeUrl"
                }
            ]
        })
        return;
    }
    if (typeof newYoutubeUrl !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "YoutubeUrl has incorrect value",
                    field: "youtubeUrl"
                }
            ]
        })
        return;
    }
        const newBlogger = {
            id: +(new Date()),
            name: newName,
            youtubeUrl: newYoutubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
});

app.get('/bloggers/:ID', (req: Request, res: Response) => {
    const id = +req.params.ID;
    const blogger = bloggers.find(blogger => blogger.id === id)
    if (!blogger) {
        res.sendStatus(404)
    } else {
        res.json(blogger)
        res.sendStatus(200)
    }
});

app.put('/bloggers/:ID',(req: Request, res: Response) => {
    const id = +req.params.ID;
    const newName = req.body.name;
    const newYoutubeUrl = req.body.youtubeUrl;
    const patternURL = new RegExp(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
    const blogger = bloggers.find(blogger => blogger.id === id)
    if (!blogger) {
        res.sendStatus(404)
        return;
    }
    if(!newName || newName.length > 15) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Name has incorrect length",
                    field: "name"
                }
            ]
        })
        return;
    }
    if (typeof newName !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Name has incorrect value",
                    field: "name"
                }
            ]
        })
        return;
    }
    if (!newYoutubeUrl || newYoutubeUrl.length > 100 || !patternURL.test(newYoutubeUrl)) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "YoutubeUrl has incorrect length",
                    field: "youtubeUrl"
                }
            ]
        })
        return;
    }
    if (typeof newYoutubeUrl !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "YoutubeUrl has incorrect value",
                    field: "youtubeUrl"
                }
            ]
        })
        return;
    }
    blogger.name = req.body.name;
    blogger.youtubeUrl = req.body.youtubeUrl
    res.sendStatus(204)
})

app.delete('/bloggers/:ID',(req: Request, res: Response) => {
    const id = +req.params.ID;
    const findBloggerId = bloggers.findIndex(blogger => blogger.id === id)
    if (findBloggerId === -1) {
        res.sendStatus(404)
    }
    bloggers.splice(findBloggerId, 1);
    res.sendStatus(204);
})


app.get('/posts', (req: Request, res: Response) => {
    res.send(posts);
})

app.post('/posts',(req: Request, res: Response) => {
    const newTitlePost = req.body.title;
    const newShortDescPost = req.body.shortDescription;
    const newContentPost = req.body.content;
    const newBloggersID = req.body.bloggerId;
    const blogger: {id: number, name: string, youtubeUrl: string} | undefined = bloggers.find(blogger => blogger.id === newBloggersID)
    if (!newTitlePost || newTitlePost.length > 30) {
        res.status(400).send({
            errorsMessages: [
            {
                message: "Title has incorrect length",
                field: "title"
            }
        ]
        })
        return;
    }
    if (typeof newTitlePost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Title has incorrect value",
                    field: "title"
                }
            ]
        })
        return;
    }
    if (!newShortDescPost || newShortDescPost.length > 100) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "ShortDescription has incorrect length",
                    field: "shortDescription"
                }
            ]
        })
        return;
    }
    if (typeof newShortDescPost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "ShortDescription has incorrect value",
                    field: "shortDescription"
                }
            ]
        })
        return;
    }
    if(!newContentPost || newContentPost.length > 1000) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Content has incorrect length",
                    field: "content"
                }
            ]
        })
        return;
    }
    if (typeof newContentPost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Content has incorrect value",
                    field: "content"
                }
            ]
        })
        return;
    }
    if (!blogger) {
        res.sendStatus(404)
    }
    const newPosts = {
        id: +(new Date()),
        title: newTitlePost,
        shortDescription: newShortDescPost,
        content: newContentPost,
        // @ts-ignore
        bloggerId: blogger.id,
        // @ts-ignore
        bloggerName: blogger.name
    }
    posts.push(newPosts);
    res.status(201).send(newPosts)

})

app.get('/posts/:ID', (req: Request, res: Response) => {
    const id = +req.params.ID;
    const post = posts.find(post => post.id === id)
    if (!post) {
        res.sendStatus(404)
    } else {
        res.json(post)
        res.sendStatus(200)
    }

}) // status 400???

app.put('/posts/:ID',(req: Request, res: Response) => {
    const id = +req.params.ID;
    const newTitlePost = req.body.title;
    const newShortDescPost = req.body.shortDescription;
    const newContentPost = req.body.content;
    const post: {
        id: number,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number,
        bloggerName: string
    } | undefined = posts.find(post => post.id === id)
    if (!newTitlePost || newTitlePost.length > 30) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Title has incorrect length",
                    field: "title"
                }
            ]
        })
        return;
    }
    if (typeof newTitlePost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Title has incorrect value",
                    field: "title"
                }
            ]
        })
        return;
    }
    if (!newShortDescPost || newShortDescPost.length > 100) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "ShortDescription has incorrect length",
                    field: "shortDescription"
                }
            ]
        })
        return;
    }
    if (typeof newShortDescPost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "ShortDescription has incorrect value",
                    field: "shortDescription"
                }
            ]
        })
        return;
    }
    if(!newContentPost || newContentPost.length > 1000) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Content has incorrect length",
                    field: "content"
                }
            ]
        })
        return;
    }
    if (typeof newContentPost !== 'string') {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Content has incorrect value",
                    field: "content"
                }
            ]
        })
        return;
    }
    if (!post) {
        res.sendStatus(404)
    }
    // @ts-ignore
    post.title = req.body.title;
    // @ts-ignore
    post.shortDescription = req.body.shortDescription;
    // @ts-ignore
    post.content = req.body.content;
    res.sendStatus(204)

})

app.delete('/posts/:ID',(req: Request, res: Response) => {
    const id = +req.params.ID;
    const findPostId = posts.findIndex(post => post.id === id)
    if (findPostId === -1) {
        res.sendStatus(404)
    }
    posts.splice(findPostId, 1);
    res.sendStatus(204);
})

app.listen(port,() => {
    console.log(`Example App listening on port ${port}`)
})

