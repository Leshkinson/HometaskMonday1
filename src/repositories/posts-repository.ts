import {bloggersRepository} from "./bloggers-repository";

const posts = [{
    id: 1,
    title: "Anything",
    shortDescription: "Bla-bla",
    content: "flnae;lrbn'aern'gnae'rnaeknrbnernaennn",
    bloggerId: 1,
    bloggerName: 'Leshkinson'
}];

export const postsRepository = {
    findPosts(title: string | null = null) {
        let filteredPosts = posts
        if (title) {
            filteredPosts = filteredPosts.filter(p => p.title.indexOf(title) > -1)
        }
        return filteredPosts
    },
    createPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger: {id: number, name: string, youtubeUrl: string} | undefined = bloggersRepository.getBloggerById(+bloggerId);
        if (blogger) {
            const newPosts = {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                // @ts-ignore
                bloggerId: blogger.id,
                // @ts-ignore
                bloggerName: blogger.name
            }
            posts.push(newPosts);
            return newPosts;
        }
        return false
    },
    getPostById(ID: number) {
        const id = ID;
        return posts.find(post => post.id === id)
    },
    changePost(title: string, shortDescription: string, content: string, bloggerId: number, ID: number) {
        const errorObject = {
            post: true,
            blogger: true
        };
        const id = ID;
        const post: {
            id: number,
            title: string,
            shortDescription: string,
            content: string,
            bloggerId: number,
            bloggerName: string
        } | undefined = posts.find(post => post.id === id)
        const blogger: {id: number, name: string, youtubeUrl: string} | undefined = bloggersRepository.getBloggerById(+bloggerId);
        errorObject.post = !!post //post ? true : false
        errorObject.blogger = !!blogger //blogger ? true : false

        if (errorObject.post && errorObject.blogger) {
            // @ts-ignore
            post.title = title;
            // @ts-ignore
            post.shortDescription = shortDescription;
            // @ts-ignore
            post.content = content;
            return errorObject;
        }
            return false;
    },
    deletePost(ID: number) {
        const id = ID;
        const findPostId = posts.findIndex(post => post.id === id)
        if (findPostId) {
            posts.splice(findPostId, 1);
            return true
        }
        return false
    }
}