import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body, validationResult} from 'express-validator';
import {basicAuthorization} from "../authorization/authorization";

export const postsRouter = Router({});
const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
})

const titleValidation = body('title')
    .trim()
    .isLength({max: 30})
    .withMessage("Title has incorrect length. (Title has more than 30 characters)")
    .notEmpty()
    .withMessage("Title has incorrect length. (Title is empty)")
    .isString()
    .withMessage("Title has incorrect value. (Title isn't string)");
const shortDescriptionValidation = body('shortDescription')
    .trim()
    .isLength({max: 100})
    .withMessage("ShortDescription has incorrect length. (ShortDescription has more than 100 characters)")
    .notEmpty()
    .withMessage("ShortDescription has incorrect length. (ShortDescription is empty)")
    .isString()
    .withMessage("ShortDescription has incorrect value. (ShortDescription isn't string)");
const contentDescriptionValidation = body('content')
    .trim()
    .isLength({max: 1000})
    .withMessage("Content has incorrect length. (Content has more than 1000 characters)")
    .notEmpty()
    .withMessage("Content has incorrect length. (Content is empty)")
    .isString()
    .withMessage("Content has incorrect value. (Content isn't string)");

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts = postsRepository.findPosts(req.body.title)
    res.send(foundPosts);
})

postsRouter.post('/',  titleValidation, shortDescriptionValidation, contentDescriptionValidation, basicAuthorization, (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
    }
    const newPosts = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
    if (!newPosts) {
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
    res.status(201).send(newPosts)

})

postsRouter.get('/:ID', (req: Request, res: Response) => {
    const post = postsRepository.getPostById(+req.params.ID);
    if (!post) {
        res.sendStatus(404)
    } else {
        res.json(post)
        res.sendStatus(200)
    }
}) // status 400???

postsRouter.put('/:ID',  titleValidation, shortDescriptionValidation, contentDescriptionValidation, basicAuthorization, (req: Request, res: Response) => {
    const updatePost = postsRepository.changePost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId, +req.params.ID)
    // if (!updatePost) {
    //     res.sendStatus(404)
    //     return;
    // }
    if (typeof updatePost !== "boolean" && updatePost?.blogger === false) {
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
    if (typeof updatePost !== "boolean" && updatePost?.post) {
        res.sendStatus(400).send({
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
    // const post = postsRepository.getPostById(+req.params.ID);
    // res.send(post)
    res.sendStatus(204)
})

postsRouter.delete('/:ID', basicAuthorization, (req: Request, res: Response) => {
    const isDeletePost = postsRepository.deletePost(+req.params.ID)
    if (isDeletePost) {
        res.sendStatus(204)
        return;
    }
    res.sendStatus(404);
})