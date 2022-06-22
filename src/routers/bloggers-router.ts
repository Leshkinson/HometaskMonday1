import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {body, validationResult, CustomValidator} from 'express-validator';
import {basicAuthorization} from "../authorization/authorization";

export const bloggersRouter = Router({})

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
const nameValidation = body('name')
    .trim()
    .isLength({max: 15})
    .withMessage("Name has incorrect length. (Name has more than 15 characters)")
    .notEmpty()
    .withMessage("Name has incorrect length. (Name is empty)")
    .isString()
    .withMessage("Name has incorrect value. (Name isn't string)");
const URLValidation = body('youtubeUrl')
    .trim()
    .isLength({max: 100})
    .withMessage("YoutubeUrl has incorrect length. (YoutubeUrl has more than 100 characters)")
    .isString()
    .withMessage("YoutubeUrl has incorrect value. (YoutubeUrl is empty)")
    .custom(isURLPattern)
    .withMessage("YoutubeUrl has incorrect value. (YoutubeUrl doesn't match pattern)");

bloggersRouter.get('/', (req: Request, res: Response) => {
    const foundBloggers = bloggersRepository.findBloggers(req.query.name?.toString())
    res.send(foundBloggers)
});
bloggersRouter.post('/', nameValidation, URLValidation, basicAuthorization, (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
    }
    const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
    res.status(201).send(newBlogger)
});
bloggersRouter.get('/:ID', (req: Request, res: Response) => {
const findBlogger = bloggersRepository.getBloggerById(+req.params.ID)
    if (!findBlogger) {
        res.sendStatus(404)
    } else {
        res.json(findBlogger)
        res.sendStatus(200)
    }
});
bloggersRouter.put('/:ID',  nameValidation, URLValidation, basicAuthorization, (req: Request, res: Response) => {
const updateBlogger = bloggersRepository.changeBlogger(+req.params.ID, req.body.name, req.body.youtubeUrl)
    if (!updateBlogger) {
        res.sendStatus(404)
        return;
    }
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true})});
    }
    const blogger = bloggersRepository.getBloggerById(+req.body.ID);
    res.send(blogger);
    res.sendStatus(204);
})
bloggersRouter.delete('/:ID', basicAuthorization, (req: Request, res: Response) => {
    const isDeleted = bloggersRepository.deleteBlogger(+req.params.ID)
        if (isDeleted) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404)
})