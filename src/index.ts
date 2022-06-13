import express,{Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {body, validationResult, CustomValidator} from 'express-validator';
const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
})
const isURLPattern: CustomValidator = value => {
    const patternURL = new RegExp(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
    if (!patternURL.test(value)) {
        throw new Error()
    }
    return true;
}

const nameValidation = body('name').trim()
    .isLength({max: 15})
    .withMessage("Name has incorrect length")
    .notEmpty()
    .withMessage("Name has incorrect length")
    .isString()
    .withMessage("Name has incorrect value");
const URLValidation = body('youtubeUrl').trim()
    .isLength({max: 100})
    .withMessage("YoutubeUrl has incorrect length")
    .isString()
    .withMessage("Name has incorrect value")
    .custom(isURLPattern)
    .withMessage("YoutubeUrl has incorrect value");
const titleValidation = body('title').trim()
    .isLength({max: 30})
    .withMessage("Title has incorrect length")
    .notEmpty()
    .withMessage("Title has incorrect length")
    .isString()
    .withMessage("Title has incorrect value");
const shortDescriptionValidation = body('shortDescription').trim()
    .isLength({max: 100})
    .withMessage("ShortDescription has incorrect length")
    .notEmpty()
    .withMessage("ShortDescription has incorrect length")
    .isString()
    .withMessage("ShortDescription has incorrect value");
const contentDescriptionValidation = body('content').trim()
    .isLength({max: 1000})
    .withMessage("Content has incorrect length")
    .notEmpty()
    .withMessage("Content has incorrect length")
    .isString()
    .withMessage("Content has incorrect value");
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

app.post('/bloggers', nameValidation, URLValidation, (req: Request, res: Response) => {
        const errors = myValidationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
        }
        const newBlogger = {
            id: +(new Date()),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl //newYoutubeUrl
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

app.put('/bloggers/:ID', nameValidation, URLValidation, (req: Request, res: Response) => {
    const id = +req.params.ID;

    // const newName = req.body.name;
    // const newYoutubeUrl = req.body.youtubeUrl;
    // const patternURL = new RegExp(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
    const blogger = bloggers.find(blogger => blogger.id === id)
    if (!blogger) {
        res.sendStatus(404)
        return;
    }
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
    }
    // if(!newName || newName.length > 15) {
    //     res.status(400).send({
    //         errorsMessages: [
    //             {
    //                 message: "Name has incorrect length",
    //                 field: "name"
    //             }
    //         ]
    //     })
    //     return;
    // }
    // if (typeof newName !== 'string') {
    //     res.status(400).send({
    //         errorsMessages: [
    //             {
    //                 message: "Name has incorrect value",
    //                 field: "name"
    //             }
    //         ]
    //     })
    //     return;
    // }
    // if (!newYoutubeUrl || newYoutubeUrl.length > 100 || !patternURL.test(newYoutubeUrl)) {
    //     res.status(400).send({
    //         errorsMessages: [
    //             {
    //                 message: "YoutubeUrl has incorrect length",
    //                 field: "youtubeUrl"
    //             }
    //         ]
    //     })
    //     return;
    // }
    // if (typeof newYoutubeUrl !== 'string') {
    //     res.status(400).send({
    //         errorsMessages: [
    //             {
    //                 message: "YoutubeUrl has incorrect value",
    //                 field: "youtubeUrl"
    //             }
    //         ]
    //     })
    //     return;
    // }
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

app.post('/posts', titleValidation, shortDescriptionValidation, contentDescriptionValidation, (req: Request, res: Response) => {
    const newBloggersID = req.body.bloggerId;
    const blogger: {id: number, name: string, youtubeUrl: string} | undefined = bloggers.find(blogger => blogger.id === newBloggersID)
    if (!blogger) {
        res.status(400).send({
            errorsMessages: [
                        {
                            message: "BloggerId not found",
                            field: "bloggerId"
                        }
                    ]
                })
                return;
    }
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
    }
    const newPosts = {
        id: +(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
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

app.put('/posts/:ID', titleValidation, shortDescriptionValidation, contentDescriptionValidation, (req: Request, res: Response) => {
    const id = +req.params.ID;
    const newBloggersID = req.body.bloggerId;
    const post: {
        id: number,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number,
        bloggerName: string
    } | undefined = posts.find(post => post.id === id)
    const blogger: {id: number, name: string, youtubeUrl: string} | undefined = bloggers.find(blogger => blogger.id === newBloggersID)
    if (!blogger) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "BloggerId not found",
                    field: "bloggerId"
                }
            ]
        })
        return;
    }
    if (!post) {
        res.sendStatus(404)
    }
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
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

