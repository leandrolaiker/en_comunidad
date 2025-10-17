import express from 'express';
import { PostService } from '../services/PostServices.js';
import { UserService } from '../services/UserServices.js';
import { Posts } from '../classes/posts.js';


const router = express.Router();
const postService = new PostService();
const userService = new UserService();

router.post("/", (req, res) => {
    try{
        const postJson = req.body;

        postJson.fecha = postJson.fecha ?? new Date().toISOString().split("T")[0];
        postJson.usuarioId = postJson.usuarioId ?? null;
                
        const post = new Posts (postJson.titulo, postJson.cuerpo, postJson.fecha, postJson.usuarioId);
        postService.guardarPost(post);
        res.json({
                success: true,
                message: "¡Post creado con exito!"
            });
        }
        catch(error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }

});

router.get("/", (req, res) => {
    const usuarioId = req.query.usuarios;

    const postsUsuario = postService.obtenerPostsPorUsuario(usuarioId);

    res.json({
            success: true,
            posts: postsUsuario
    });
});

router.get("/inactivos", (req, res) => {  

    const idsUsuariosInactivos = postService.obtenerUsuariosInactivos();

    const usuariosInactivos = idsUsuariosInactivos.map((usuario) => userService.obtenerUsuarioPorID(usuario));

    res.json({
            success: true,
            usuarios: usuariosInactivos
    });
});

router.get("/escriben-mucho", (req, res) => {  

    const idsEscritoresLargos = postService.obtenerEscritoresLargos();

    const escritoresLargos = idsEscritoresLargos.map((usuario) => userService.obtenerUsuarioPorID(usuario));

    res.json({
            success: true,
            usuarios: escritoresLargos
    });
});

router.get("/likeados", (req, res) => {

        const fecha = req.body.fecha;

        const post = postService.postMasLikeado(fecha);

        res.json({
                success: true,
                post: post.post,
                cantidadDeLikes: post.cantidadLikes
            });
        
});

router.get("/comentados", (req, res) => {

        const fecha = req.body.fecha;

        const post = postService.postMasComentado(fecha);

        res.json({
                success: true,
                post: post.post,
                cantidadDeComentarios: post.cantidadComentarios
            });
        
});

router.get("/mayoresLikes", (req, res) => {

        const cantidad = req.body.cantidad;

        const posts = postService.postConXLikes(cantidad);

        res.json({
                success: true,
                posts: posts.posts,
            });
        
});

router.get("/mayoresComentarios", (req, res) => {

        const cantidad = req.body.cantidad;

        const posts = postService.postConXComentarios(cantidad);

        res.json({
                success: true,
                posts: posts.posts,
            });
        
});

router.get("/:id", (req, res) => {
    const id = req.params.id;

    const post = postService.obtenerPostPorId(id);

    res.json({
            success: true,
            posts: post
    });
});

router.get("/activos/:fecha", (req, res) => {
    const fecha = req.params.fecha;

    const idsUsuariosActivos = postService.obtenerUsuariosActivos(fecha);

    const usuariosActivos = idsUsuariosActivos.map((usuario) => userService.obtenerUsuarioPorID(usuario));

    res.json({
            success: true,
            usuarios: usuariosActivos
    });
});

router.post("/:id/like", (req, res) => {
    try{
        const postId = req.params.id;
        const usuarioId = req.body.usuarioId;

        postService.registrarLike(postId, usuarioId);

        res.json({
                success: true,
                message: "¡Post Likeado!"
            });
        }
        catch(error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }

});

router.get("/:id/likes", (req, res) => {
    try{
        const postId = req.params.id;

        const likes = postService.obtenerLikes(postId);

        const usuariosLikeadores = likes.map((like) => userService.obtenerUsuarioPorID(like));

        res.json({
                success: true,
                message: usuariosLikeadores
            });
        }
        catch(error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }

});

router.post("/:id/comentario", (req, res) => {
    try{
        const postId = req.params.id;
        const comentario = req.body;

        postService.registrarComentario(postId, comentario.usuarioId, comentario.cuerpo);

        res.json({
                success: true,
                message: "¡Post comentado!"
            });
        }
        catch(error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }

});

router.get("/:id/comentarios", (req, res) => {
    try{
        const postId = req.params.id;

        const comentarios = postService.obtenerComentarios(postId);

        res.json({
                success: true,
                message: comentarios
            });
        }
        catch(error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }

});


export {router as postRoutes};