export class Posts {
    constructor(titulo, cuerpo, fecha, usuarioId) {

        if(!titulo || !cuerpo){
            throw new Error("Faltan datos obligatorios");
        }
        if(cuerpo.length > 3000){
            throw new Error("El cuerpo es demasiado extenso");
        }

        this.id = null;
        this.titulo = titulo;
        this.cuerpo = cuerpo;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
        this.likes = [];
        this.comentarios = [];
    }
}