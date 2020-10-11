
var tableUsuarios;

document.addEventListener('DOMContentLoaded', function(){

    tableUsuarios = $('#tableUsuarios').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/Usuarios/getUsuarios",
            "dataSrc":""
        },
        "columns":[ 
            {"data": "num_documento"},
            {"data": "acronimo_td"},
            {"data": "acronimo"},
            {"data": "prim_nom"},
            {"data": "prim_apellido"},
            {"data": "nom_usuario"},
            {"data": "correo_electronico"},
            {"data": "nombre_rol"},
            {"data": "estado"},
            {"data": "options"}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"asc"]]
        
    });

    //Nuevo usuario
    var formUsuario = document.querySelector("#formUsuario");
    formUsuario.onsubmit = function(e) {
        e.preventDefault();
        
        var strIdUsuario = document.querySelector('#idUsuario').value;
        var strNombre1 = document.querySelector('#txtNombre1').value;
        var strNombre2 = document.querySelector('#txtNombre2').value;
        var strApellido1 = document.querySelector('#txtApellido1').value;
        var strApellido2 = document.querySelector('#txtApellido2').value;
        var strDocumento = document.querySelector('#txtDocumento').value;
        var intTpDocumento = document.querySelector('#intTpdocumento').value;
        var strUsuario = document.querySelector('#txtUsuario').value;
        var strEmail = document.querySelector('#txtEmail').value;
        var strPassword = document.querySelector('#txtPassword').value;
        var intGenero = document.querySelector('txtGenero');
        var intRol = document.querySelector('#intRol').value;
        var intEstado = document.querySelector('#estadoUs').value;

        if(strDocumento == '' || strEmail == '')
        {
            swal("Atención", "Todos los campos son obligatios." , "error");
            return false;
        }

        var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        var ajaxUrl = base_url+'/Usuarios/setUsuarios';
        var formData = new FormData(formUsuario);
        request.open("POST",ajaxUrl,true);
        request.send(formData);
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200){

                var objData = JSON.parse(request.responseText);
                if (objData.status) {
                    $('#modalFormUsuario').modal("hide");
                    formUsuario.reset();
                    swal("Nuevos usuarios", objData.msg ,"success");
                    tableUsuarios.api().ajax.reload(function(){
                        ftnEditUsuario();
                    });
                } else {
                    swal("Error", objData.msg , "error" );
                }
            }
        }
    }
});

$('#tableUsuarios').DataTable();

function openModal(){

    document.querySelector('#idUsuario').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector('#formUsuario').reset();

    $('#modalFormUsuario').modal('show');
}

window.addEventListener('load', function() {
    ftnEditUsuario();
    fntDelUsuario();
}, false);

function ftnEditUsuario() {
    var btnEditUsuario = document.querySelectorAll(".btnEditUsuario");
    btnEditUsuario.forEach(function(btnEditUsuario) {
        btnEditUsuario.addEventListener('click', function() {
            
            document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            
            var idUsuario = this.getAttribute("rl");
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/Usuarios/getUsuario/'+idUsuario;
            request.open("GET",ajaxUrl,true);
            request.send();

            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200){
                    
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        document.querySelector('#idUsuario').value = objData.data.num_documento;
                        document.querySelector('#txtNombre1').value = objData.data.prim_nom;
                        document.querySelector('#txtNombre2').value = objData.data.seg_nombre;
                        document.querySelector('#txtApellido1').value = objData.data.prim_apellido;
                        document.querySelector('#txtApellido2').value = objData.data.seg_apellido;
                        document.querySelector('#txtDocumento').value = objData.data.num_documento;
                        //Tipo de documento
                        if(objData.data.pk_fk_id_tp_documento == 1){
                            var optionSelect = '<option value="1" selected class="notBlock">Cedula Ciudadania</option>';
                        }else if(objData.data.pk_fk_id_tp_documento == 2){
                            var optionSelect = '<option value="2" selected class="notBlock">Cedula extranjeria</option>';
                        }else if(objData.data.pk_fk_id_tp_documento == 3){
                            var optionSelect = '<option value="3" selected class="notBlock">Tarjeta de identidad</option>';
                        }else{
                            var optionSelect = '<option value="4" selected class="notBlock">Pasaporte</option>';
                        }

                        var htmlSelect = `${optionSelect}
                                            <option value="1">Cedula Ciudadania</option>
                                            <option value="2">Cedula Extranjeria</option>
                                            <option value="3">Tarjeta de identidad</option>
                                            <option value="4">Pasaporte</option>
                        `;
                        document.querySelector('#intTpdocumento').innerHTML = htmlSelect;
                        document.querySelector('#txtUsuario').value = objData.data.nom_usuario;
                        document.querySelector('#txtEmail').value = objData.data.correo_electronico;
                        //Rol
                        if (objData.data.pk_fk_id_rol == 1) {
                            var optionSelectR = '<option value="1" selected class="notBlock">Administrador</option>';
                        } else if (objData.data.pk_fk_id_rol  == 2) {
                            var optionSelectR = '<option value="2" selected class="notBlock">Empleado</option>';
                        }else{
                            var optionSelectR = '<option value="3" selected class="notBlock">Cliente</option>';
                        }
                        var htmlSelectR = `${optionSelectR}
                                            <option value="1">Administrador</option>
                                            <option value="2">Empleado</option>
                                            <option value="3">Cliente</option>
                        `;
                        document.querySelector('#intRol').innerHTML = htmlSelectR;
                        //estado
                        if (objData.data.estado == 0){ 
                            var optionSelectE = '<option value="0" selected class="notBlock">Activo</option>'; 
                        }else{
                            var optionSelectE = '<option value="1" selected class="notBlock">Inactivo</option>';
                        }
                        var htmlSelectU = `${optionSelectE}
                                            <option value="0">Activo</option>
                                            <option value="1">Inactivo</option>
                        `;
                        document.querySelector('#estadoUs').innerHTML = htmlSelectU;
                        
                        //se abre el modal
                        $('#modalFormUsuario').modal('show');
                    }
                    else{
                        swal("Error", objData.msg ,"error");
                    }
                }
            }
    
        });
    });
}

function fntDelUsuario() {
    var btnDelUsuario = document.querySelectorAll(".btnDelUsuario");
    btnDelUsuario.forEach(function(btnDelUsuario) {
        btnDelUsuario.addEventListener('click', function() {
            var idUsuario = this.getAttribute("rl");
            
            swal({
                title: "Eliminar Usuario",
                text: "¿Realmete quieres eliminar a el Usuario?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Eliminar",
                cancelButtonText: "No, Cancelar",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {
                
                if(isConfirm)
                {
                    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    var ajaxUrl = base_url+'/Usuarios/delUsuario/';
                    var strData = "idUsuario="+idUsuario;
                    request.open("POST",ajaxUrl,true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    request.send(strData);
                    request.onreadystatechange = function() {
                        if(request.readyState == 4 && request.status == 200){
                            var objData = JSON.parse(request.responseText);
                            if(objData.status)
                            {
                                swal("Eliminar!", objData.msg ,"success");
                                tableUsuarios.api().ajax.reload(function() {
                                    ftnEditUsuario();
                                    fntDelUsuario();
                                });
                            }else{
                                swal("Atencion!", objData.msg ,"Error");
                            }
                        }
                    }
                }
            });
        });
    });
}