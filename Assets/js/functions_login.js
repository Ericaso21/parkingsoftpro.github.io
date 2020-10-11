$('.login-content [data-toggle="flip"]').click(function() {
    $('.login-box').toggleClass('flipped');
    return false;
});

document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelector("#formLogin")){

        let formLogin = document.querySelector("#formLogin");
        formLogin.onsubmit = function(e){
            e.preventDefault();

            let strEmail = document.querySelector('#txtEmail').value;
            let strPassword = document.querySelector('#txtPassword').value;

            if(strEmail == "" || strPassword == "")
            {
                swal("Por favor", "Escribe usuario y contraseña", "error")
                return false;
            }else{
                var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                var ajaxUrl = base_url+'/Login/loginUser';
                var formData = new FormData(formLogin);
                request.open("POST",ajaxUrl,true);
                request.send(formData);

                request.onreadystatechange = function(){

                    if(request.readyState != 4)return;
                    if(request.status == 200){
                        var objData = JSON.parse(request.responseText);
                        if(objData.status)
                        {
                            window.location = 'https://ericaso21.github.io/parkingsoftpro.github.io/dashboard.html';
                        }else{
                            swal("Atencion", objData.msg, "error");
                                document.querySelector('#txtPassword').value = "";
                        }
                    }else{
                            swal("Atencion","Error en el proceso", "error");
                    }
                    
                    return false;
            }
        }
        }
    }

//Nuevo usuario
var formRegistrar = document.querySelector("#formRegistrar");
formRegistrar.onsubmit = function(e) {
    e.preventDefault();
    
    var strNom1 = document.querySelector('#txtNombre1').value;
    var strNom2 = document.querySelector('#txtNombre2').value;
    var strApel1 = document.querySelector('#txtApel1').value;
    var strApel2 = document.querySelector('#txtApel2').value;
    var strNumDocumento = document.querySelector('#txtNumDocumento').value;
    var intTpDoc = document.querySelector('#intTpdocumento').value;
    var intGenero = document.querySelector('#intGenero').value;
    var strNomUs = document.querySelector('#txtNomUsuario').value;
    var strEmailUs = document.querySelector('#txtEmailUs').value;
    var strPasswordUs = document.querySelector('#txtPasswordUs').value;
    if(strNumDocumento == "" || strEmailUs == "")
    {
        swal("Atención", "Todos los campos son obligatios." , "error");
        return false;
    }

    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Login/setUsuario';
    var formData = new FormData(formRegistrar);
    request.open("POST",ajaxUrl,true);
    request.send(formData);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){

            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#modalFormRegistrar').modal("hide");
                formVehiculo.reset();
                swal("Registro Exitoso", objData.msg ,"success");
            } else {
                swal("Error", objData.msg , "error" );
            }
        }
    }
}
}, false);

function openModalRegistrar(){

    $('#modalFormRegistrar').modal('show');
}





