export class PostsRepository {
    constructor() {
        this.posts = [];
    }

    guardarPost(post) {
        if(this.posts.length > 0) {
            const idsPosts = this.posts.map((post) => post.id);
            post.id = Math.max(...idsPosts) + 1;
        } else {
            post.id = 1;
        }

        this.posts.push(post);
    }

    obtenerPosts(){
        return this.posts;
    }

    obtenerLikes(){
        return this.posts.map((post) => ({id: post.id, likes: post.likes}))
    }

    agregarLike(postId, usuarioId){
        const post = this.obtenerPost(postId);

        post.likes.push(usuarioId);
    }

    obtenerLikesPost(postId){
        const post = this.obtenerPost(postId);

        if(post == null){
            throw new Error("El post no existe");
        }

        return post.likes
    }

    registrarComentario(postId, usuarioId, cuerpo){

        const post = this.obtenerPost(postId);

        if(post == null){
            throw new Error("El post no existe");
        }

        post.comentarios.push({usuarioId: usuarioId, cuerpo: cuerpo});

    }

    obtenerComentariosPost(postId){

        const post = this.obtenerPost(postId);

        if(post == null){
            throw new Error("El post no existe");
        }

        return post.comentarios
        
    }

    obtenerPost(postId){
        return this.posts.find((post) => post.id == postId)
    }

    
}