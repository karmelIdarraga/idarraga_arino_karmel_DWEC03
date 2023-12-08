// ------------------- VARIABLES GLOBALES ------------------------

var palabraAdivinar = '';
// Palabra oculta
var oculta = [];

// Intentos restantes
var fallos_rest = 7;

//Marcador
var puntos = 0;

//Mejores puntuaciones
var topscores = new Array();

function cargarPalabrasJSON () {    
    let path = '/model/palabras.json';
    let request = new Request(path, {
        headers: new Headers({
        'Content-Type': 'text/json'
        }),
        method: 'GET'
    })

    fetch(request).then(response => {
        response.json().then(data => {        
            if (localStorage.getItem("palabras")!=null){
                console.log( 'El localStorage ya está cargado con palabras, así que no lo recargamos.' );                
            } else{
                console.log( 'El localStorage está vacío, así que lo cargamos con las palabras del json.' ); 
                localStorage.setItem("palabras", JSON.stringify(data));
                console.log('Datos', data);
            }
        })
    })    
}

function ajustarNivel(nivel){
    iniciar();
    // console.log('la palabra a adivinar es: ' + palabraAdivinar);

}

function seleccionarPalabra(nivel){
    let arrayCompleto = JSON.parse(localStorage.getItem("palabras"));
    let palabras = new Array();
    switch (nivel) {
        case '6':
            palabras = arrayCompleto.seis_letras;
            break;
        case '7':
            palabras = arrayCompleto.siete_letras;
            break;
        case '8':
            palabras = arrayCompleto.ocho_letras;
            break;
        case '9':
            palabras = arrayCompleto.nueve_letras;
            break;
        case '10':
            palabras = arrayCompleto.diez_letras;
            break;
    }
    // seleccionarmos una posicion
    var indice = Math.floor(Math.random() * palabras.length);
    // console.log('Escogeremos la palabra en la posición ' + indice);
    return palabras[indice].toUpperCase();
}

function crearTablero () {
    let tablero = document.getElementById("tablero");
    tablero.innerHTML = "";
    var i = 'a'.charCodeAt(0), j = 'z'.charCodeAt(0);
    var letra = "";
    for( ; i<=j; i++) {
      letra = String.fromCharCode(i).toUpperCase();
      tablero.innerHTML += "<button value='" + letra + "' class='letra m-1 p-2' id='"+letra+"'>" + letra + "</button>";
      if(i==110) {
        tablero.innerHTML += "<button value='Ñ' class='letra m-1 p-2' id='"+letra+"'>Ñ</button>";
      }
    }
    $('.letra').on('click', function(){
        let letra = this.value;
        this.disabled = true;
        if(palabraAdivinar.indexOf(letra) != -1) {
            var apariciones = 0;
            for(var i=0; i<palabraAdivinar.length; i++) {
                if(palabraAdivinar[i]==letra){
                    oculta[i] = letra;
                    apariciones++;
                } 
            }
            document.getElementById("adivina").innerHTML = oculta.join("");
            this.className += ' bg-success-subtle';
            actualizarMarcador(apariciones);
        }else{
            fallos_rest--;
            this.className += ' bg-danger-subtle'
            document.getElementById("image-ahorcado").src = "/img/ahorcado_" + fallos_rest+".png";
        }
        comprobarFinal();
    });
  }

function comprobarFinal(){
    if(  document.getElementById("adivina").innerHTML.indexOf("_") == -1 ) {
        // Ha acertado todas
        $('.modal-body').text('ZORIONAK!!! Has acertado la palabra!! ¿Quieres seguir jugando?')
        $('#staticBackdrop').modal('show'); 
      }else if( fallos_rest == 0 ) {
        // Se ha quedado sin fallos
        $('.modal-body').text('Lastima!!! Te has quedado sin fallos posibles ¿Quieres volvera jugar?')
        $('#staticBackdrop').modal('show'); 
      }
}

  function actualizarMarcador(apariciones){
    puntos += 100 * apariciones * $('#level').val();
    $('#puntos').text('Puntos: ' + puntos);

  }

function pintarHuecos(tamanyo){
    for (var i = 0; i < tamanyo; i++) {
        oculta[i] = "_";
    }
    $('#adivina').text(oculta.join(""));
}

$('.btn-primary').on('click', function(){
    //Quiere seguir jugando
    if( fallos_rest == 0 ) { 
        //Ha llegado aquí porque ha fallado todas
        guardarPuntuación();
        fallos_rest = 7;
        puntos = 0;
        document.getElementById("image-ahorcado").src = "/img/ahorcado_" + fallos_rest+".png";
       
    }
    iniciar();
});

function guardarPuntuación(){
    let usuarioLogueado = JSON.parse(localStorage.getItem("logueado"));
    if (topscores == null){
        topscores = new Array();
    }
    topscores.push(new Puntuacion(usuarioLogueado.usuario, puntos));
    topscores = topscores.sort((a,b) => b.puntos - a.puntos);
    localStorage.setItem("topscores", JSON.stringify(topscores));
}

function actualizarClasificacion(){
    $('#clasificacion').empty();
    if (topscores != null){
        topscores = topscores.sort((a,b) => b.puntos - a.puntos);
        for (i=0; i < topscores.length; i++) {
            $('#clasificacion').append('<li>' + topscores[i].usuario + ':     ' + topscores[i].puntos);
        }
    }    
}

$('.btn-secondary').on('click', function(){
    //Salir del juego
    guardarPuntuación();
    localStorage.removeItem("logueado");

});

function iniciar(){
    let nivel = $('#level').val();
    palabraAdivinar = seleccionarPalabra(nivel);
    pintarHuecos(palabraAdivinar.length);
    crearTablero();
    actualizarClasificacion();
}




$( document ).ready(function() {
    let usuarioLogueado = JSON.parse(localStorage.getItem("logueado"));
    if (usuarioLogueado != null){
        cargarPalabrasJSON();
        topscores = JSON.parse(localStorage.getItem("topscores"));
        $('#bienvenida').append(usuarioLogueado.nombre);
        iniciar();
    } else{        
        console.log("No hay ningún usuario logueado, vamos al login");
        alert('No se ha encontrado ningún usuario logueado, Redireccionamos al login');
        window.location.href='/index.html';
    }  
});