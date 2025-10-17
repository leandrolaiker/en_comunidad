import { UserRepository } from '../repositories/UserRepository.js';
import { SolicitudesRepository } from '../repositories/SolicitudesRepository.js';
import { PostsRepository } from '../repositories/PostsRepository.js';

const userRepository = new UserRepository();
const solicitudRepository = new SolicitudesRepository();
const postRepository = new PostsRepository();

export class PostService {
    guardarPost(post){
        if(this.usuarioPuedePublicar(post.usuarioId, post.fecha)){
            postRepository.guardarPost(post);
        }else{
            throw new Error("El usuario alcanzó el máximo de publicaciones diarias");
        }
    }

    usuarioPuedePublicar(id, fecha){
        const posts = postRepository.obtenerPosts();
        const postsUsuarioHoy = posts.filter((post) => post.usuarioId == id && post.fecha == fecha);
        return postsUsuarioHoy.length < 5;
    }

    obtenerPostsPorUsuario(id){
        const postsDelUsuario = postRepository.obtenerPosts();
        return postsDelUsuario.filter((post) => post.usuarioId == id);
    }

    obtenerPostPorId(id){
        const posts = postRepository.obtenerPosts();

        return posts.filter((post) => post.id == id);
    }

    obtenerUsuariosActivos(fecha){
        const posts = postRepository.obtenerPosts();
        const postsDelDia = posts.filter((post) => post.fecha == fecha);
        const idsActivas = postsDelDia.map((post) => post.usuarioId);

        const idsUsuariosActivos = Object.entries(
        idsActivas.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {})
        )
        .filter(([_, count]) => count > 3)
        .map(([id]) => Number(id));

        return idsUsuariosActivos;
    }

    obtenerUsuariosInactivos(){
        const posts = postRepository.obtenerPosts();
        const hoy = new Date();
        const semanaActual = this.obtenerSemana(hoy);
        const ultimasSemanas = [semanaActual, semanaActual -1, semanaActual -2, semanaActual -3];

        const postsRecientes = posts.filter((post) => ultimasSemanas.includes(this.obtenerSemana(post.fecha)));

        const postsPorUsuario = {};

        postsRecientes.forEach(post => {
            const usuario = post.usuarioId;
            const semana = this.obtenerSemana(post.fecha);

            if (!postsPorUsuario[usuario]){
                postsPorUsuario[usuario] = {};
            }
            postsPorUsuario[usuario][semana] = (postsPorUsuario[usuario][semana] || 0) + 1;
        });

        const usuariosPocoActivos = Object.keys(postsPorUsuario)
        .filter(usuario =>
            Object.values(postsPorUsuario[usuario]).every(cant => cant <= 1)
        )
        .map(Number);

        return usuariosPocoActivos;
    }

    obtenerSemana(fecha) {
        const fechaDate = new Date(fecha);
        const inicioAnio = new Date(fechaDate.getFullYear(), 0, 1);
        const diasTranscurridos = (fechaDate - inicioAnio) / 86400000;
        return Math.ceil((diasTranscurridos + inicioAnio.getDay() + 1) / 7);
    }

    obtenerEscritoresLargos(){
        const posts = postRepository.obtenerPosts();

        const postsPorUsuario = {};

        posts.forEach(post => {

            const usuario = post.usuarioId;

            postsPorUsuario[usuario] = postsPorUsuario[usuario] || [];

            postsPorUsuario[usuario].push(post);

        });

        console.log(postsPorUsuario);

        const usuariosQueEscribenMucho = Object.entries(postsPorUsuario)
            .filter(([usuario, postsUsuario]) => {
                const totalPosts = postsUsuario.length;

                const postsLargos = postsUsuario.filter(post => post.cuerpo.length >= 2700).length;

                return postsLargos / totalPosts >= 0.7;
            })
            .map(([usuario]) => Number(usuario));

        console.log(usuariosQueEscribenMucho);
        
        return usuariosQueEscribenMucho;
    }

    registrarLike(postId, usuarioId){
        const likes = postRepository.obtenerLikes();

        if(likes.length <= 0){
            throw new Error("El post no existe");
        }

        const post = likes.find((post) => post.id == postId);

        if(post.likes.includes(usuarioId)){
            throw new Error("El ususario ya ha likeado este post")
        }

        postRepository.agregarLike(postId, usuarioId);
    }

    obtenerLikes(postId){
        return postRepository.obtenerLikesPost(postId);
    }

    registrarComentario(postId, usuarioId, cuerpo){
        if(cuerpo.length > 1000){
            throw new Error ("El comentario es demasiado largo");
        }

        postRepository.registrarComentario(postId, usuarioId, cuerpo);
    }

    obtenerComentarios(postId){
        return postRepository.obtenerComentariosPost(postId);
    }

    postMasLikeado(fecha){
        const posts = postRepository.obtenerPosts();

        const postsDia = posts.filter((post) => post.fecha == fecha);

        postsDia.sort((a, b) => b.likes.length - a.likes.length);

        return {post: postsDia[0], cantidadLikes: postsDia[0].likes.length}    
    }

    postMasComentado(fecha){
        const posts = postRepository.obtenerPosts();

        const postsDia = posts.filter((post) => post.fecha == fecha);

        postsDia.sort((a, b) => b.comentarios.length - a.comentarios.length);

        return {post: postsDia[0], cantidadComentarios: postsDia[0].comentarios.length}    
    }

    postConXLikes(cantidad){
        const posts = postRepository.obtenerPosts();

        const postsConXLikes = posts.filter((post) => post.likes.length >= cantidad)

        return{ posts: postsConXLikes.map(post => ({
            post: post,
            likes: post.likes.length
        })),}

    }

    postConXComentarios(cantidad){
        const posts = postRepository.obtenerPosts();

        const postsConXComentarios = posts.filter((post) => post.comentarios.length >= cantidad)

        return{ posts: postsConXComentarios.map(post => ({
            post: post,
            comentarios: post.comentarios.length
        })),}

    }
}
