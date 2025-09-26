document.addEventListener('DOMContentLoaded', function() {
    var socket = io.connect('http://localhost:4000');
    var persona = document.getElementById('persona');
    var appChat = document.getElementById('app-chat');
    var panelBienvenida = document.getElementById('panel-bienvenida');
    var usuario = document.getElementById('usuario');
    var mensaje = document.getElementById('mensaje');
    var botonEnviar = document.getElementById('enviar');
    var escribiendoMensaje = document.getElementById('escribiendo-mensaje');
    var output = document.getElementById('output');
    // Sonidos
    var sonidoEnviar = document.getElementById('sonido-enviar');
    var sonidoRecibir = document.getElementById('sonido-recibir');

    botonEnviar.addEventListener('click', function(){
        if(mensaje.value.trim() != ""){
            socket.emit('chat', {
                mensaje: mensaje.value,
                usuario: usuario.value
            });
            if (sonidoEnviar) sonidoEnviar.play();
        }
        mensaje.value = "";
    });

    mensaje.addEventListener('keyup', function(e){
        if(usuario.value != ""){
            socket.emit('typing',{
                nombre : usuario.value,
                texto: mensaje.value
            });
        }
        // Permitir enviar con Enter
        if(e.key === "Enter" && mensaje.value.trim() != ""){
            socket.emit('chat', {
                mensaje: mensaje.value,
                usuario: usuario.value
            });
            if (sonidoEnviar) sonidoEnviar.play();
            mensaje.value = "";
        }
    });

    socket.on('chat', function(data){
    escribiendoMensaje.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.usuario + ': </strong>' + data.mensaje + '</p>';
    if (sonidoRecibir) {
        setTimeout(function() {
            sonidoRecibir.play();
        }, 1500); 
    }
});

    socket.on('typing', function(data){
        if(data.texto){
            escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
        } else {
            escribiendoMensaje.innerHTML = "";
        }  
    });

    window.ingresarAlChat = function(){
        var nombre = persona.value.trim();
        if(nombre === ""){
            alert("Por favor, ingresa un nombre válido para entrar al chat.");
            persona.focus();
            return;
        }
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        usuario.value = nombre;
        usuario.readOnly = true;
    }
});