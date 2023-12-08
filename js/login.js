function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    let caracteresmalos = comprobarPassword(password);
    if ( caracteresmalos == ''){
      let users = JSON.parse(localStorage.getItem("usuarios"));
      var authenticated = false;
  
      for (var i = 0; i < users.length; i++) {
        //    console.log ("tratando usuario : " + users[i].usuario + " con la contraseña: " + users[i].contraseña);
          if (users[i].usuario === username && users[i].contraseña === password) {
              authenticated = true;
              localStorage.setItem("logueado", JSON.stringify(users[i]));
              break;
          }
      }  
      if (authenticated) {
          console.log("Inicio de sesión exitoso");
          window.location.href='view/juego.html';
      } else {
        $(".alert").addClass('show');
        $('#texto-error').text('El usuario no está registrado');
      }
    } else {
      $('#texto-error').text('Se han utilizado caracteres no permitidos. Modifique los siguientes caracteres: ' + caracteresmalos);
      $(".alert").addClass('show');
    }   
}

function comprobarPassword (pass){
    let caracteresmalos='';
    if (/^([A-Za-z0-9 ]+)$/.test(pass)){
      console.log ("el formato de pass es correcto");
    } else {
      console.log("El formato de Pass es incorrecto");   
      for (let i = 0; i < pass.length; i++) {
        if  (/^([A-Za-z0-9 ]+)$/.test(pass.charAt(i))){
          console.log('El carácter en el índice ' + i + ' es ' + pass.charAt(i) + ' y es correcto.');
        }else{
          console.log('El carácter en el índice ' + i + ' es ' + pass.charAt(i) + ' y es INCORRECTO.');
          caracteresmalos += pass.charAt(i) + ' ';
        }
      }    
    }
    return caracteresmalos;
}
  
function cargarusuariosJSON () {    
    let path = 'model/usuarios.json';
    let request = new Request(path, {
        headers: new Headers({
        'Content-Type': 'text/json'
        }),
        method: 'GET'
    })

    fetch(request).then(response => {
        response.json().then(data => {        
            if (localStorage.getItem("usuarios")!=null){
                console.log( 'El localStorage ya está cargado, así que no lo recargamos para mantener los datos.' );                
            } else{
                console.log( 'El localStorage está vacío, así que lo cargamos con los datos del json.' ); 
                localStorage.setItem("usuarios", JSON.stringify(data));
                console.log('Datos', data);
            }
        })
    })    
}

  
$('#user-error').on('click', '.close', function(){
    $(".alert").removeClass('show');
});
  
  
$( document ).ready(function() {
    let usuarioLogueado = JSON.parse(localStorage.getItem("logueado"));
    if (usuarioLogueado != null){
        console.log("Ya se había logueado con el usuario " + usuarioLogueado.nombre);
        alert('Se ha logueado con anterioridad y será redirigido a la pantalla del juego');
        window.location.href='view/juego.html';
    } else{
        cargarusuariosJSON(); 
    }  
});