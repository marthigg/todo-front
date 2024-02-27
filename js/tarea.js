class Tarea{
    constructor(id,textoTarea,estado,contenedor){
        this.id = id;
        this.textoTarea = textoTarea;
        this.DOM = null; //Componente HTML
        this.editando = false;
        this.crearComponente(estado,contenedor);
    }

    crearComponente(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        // Creamos texto
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.textoTarea;

        // Creamos input
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type","text");
        inputTarea.value = this.textoTarea;

        // Creamos boton EDITAR
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("btn");
        botonEditar.innerText = "Editar";

        //Agregar evento al boton de EDITAR
        botonEditar.addEventListener("click", () => this.editarTarea());

        // Creamos boton BORRAR
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("btn");
        botonBorrar.innerText = "Borrar";

        //Agregar evento al boton de BORRAR
        botonBorrar.addEventListener("click", () => this.borrarTarea());

        // Creamos boton ESTADO
        let botonEstado = document.createElement("button");
        botonEstado.classList.add("estado", estado ? "terminada" : null);
        botonEstado.appendChild(document.createElement("span"));

        //Agregar evento al boton toggle de tarea terminada
        botonEstado.addEventListener("click", () => {
            this.toggleEstado().then(({resultado}) => {
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada");
                }
                console.log("...error al actualizar estado");
            });
        });


        //Insertamos el codigo creado con "crearComponente"
        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(inputTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);

        contenedor.appendChild(this.DOM);
    }

    //Funcion para BORRAR tarea
    borrarTarea(){
        fetch("http://localhost:3000/api-todo/borrar/" + this.id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado}) => {
            if(resultado == "ok"){
                return this.DOM.remove();
            }
            console.log("...error al borrar tarea");
        });
    }

    //Funcion para cambiar el ESTADO
    toggleEstado(){
        return fetch(`http://localhost:3000/api-todo/actualizar/${this.id}/2`, {
            method : "PUT"
        })
        .then(respuesta => respuesta.json());
        
    }

    //Funcion para editar el texto con el boton EDITAR
    async editarTarea(){
        if(this.editando){
            //guardar
            let textoTemporal = this.DOM.children[1].value;

            if(textoTemporal.trim() != "" && textoTemporal.trim() != this.textoTarea) {
                let {resultado} = await fetch(`http://localhost:3000/api-todo/actualizar/${this.id}/1`, {
                            method : "PUT",
                            body : JSON.stringify({ tarea : textoTemporal.trim() }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        })
                        .then(respuesta => respuesta.json());

            if(resultado == "ok"){
                return this.textoTarea = textoTemporal;
            }
        }

            this.DOM.children[0].innerText = this.textoTarea;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[2].innerText = "Editar";
            this.editando = false;
        }else{
            //editar
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.textoTarea;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "Guardar";
            this.editando = true;
        }
        
    }


}