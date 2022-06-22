const bloggers = [{
    id: 1,
    name: 'Leshkinson',
    youtubeUrl: 'https://www.youtube.com/c/Leshkinson'
}];

export const bloggersRepository = {
    findBloggers(name: string | null | undefined) {
        if (name) {
            return bloggers.filter(b => b.name.indexOf(name))
        }
        return bloggers
    },
    createBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl //newYoutubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger
    },
    getBloggerById(ID: number) {
        const id = ID;
        return bloggers.find(blogger => blogger.id === id)
    },
    changeBlogger(ID: number, name: string, youtubeUrl: string ) {
        const id = ID;
        const blogger = bloggers.find(blogger => blogger.id === id);
        if (blogger) {
            blogger.name = name;
            blogger.youtubeUrl = youtubeUrl;
            return true;
        }
        return false;
    },
    deleteBlogger(ID: number) {
        const id = ID;
        const findBloggerId = bloggers.findIndex(blogger => blogger.id === id)
        if (findBloggerId === -1) {
            return false;
        } else {
            bloggers.splice(findBloggerId, 1);
            return true
        }
    }
}