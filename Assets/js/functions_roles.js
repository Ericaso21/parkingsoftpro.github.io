var tableRoles;

document.addEventListener('DOMContentLoaded', function(){

    tableRoles = $('#tableRoles').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/RolesUsuarios/getRoles",
            "dataSrc":""
        },
        "columns":[ 
            {"data": "id_rol"},
            {"data": "nombre_rol"},
            {"data": "descripcion"},
            {"data": "estado"},
            {"data": "options"}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"asc"]]
        
    });

//Nuevo tipo de rol
var formRoles = document.querySelector("#formRoles");
formRoles.onsubmit = function(e) {
    e.preventDefault();

    var strNombre = document.querySelector('#txtNombre').value;
    var strDescripcion = document.querySelector('#txtDescripcion').value;
    var intStatus = document.querySelector('#listStatus').value;

    if(strNombre == '' || strDescripcion == '' || intStatus == '')
    {
        swal("Atención", "Todos los campos son obligatios." , "error");
        return false;
    }

    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/RolesUsuarios/setRolesUsuario';
    var formData = new FormData(formRoles);
    request.open("POST",ajaxUrl,true);
    request.send(formData);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){

            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#modalFormRoles').modal("hide");
                formRoles.reset();
                swal("Nuevo Vehiculo", objData.msg ,"success");
                tableRoles.api().ajax.reload(function(){
                    ftnEditRol();
                });
            } else {
                swal("Error", objData.msg , "error" );
            }
        }
    }
}
});
function openModalRoles(){

    document.querySelector('#idRoles').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector('#formRoles').reset();

    $('#modalFormRoles').modal('show');
}
window.addEventListener('load', function() {
    ftnEditRol();
    fntDelRol();
}, false);

function ftnEditRol() {
    var btnEditRol = document.querySelectorAll(".btnEditRol");
    btnEditRol.forEach(function(btnEditRol) {
        btnEditRol.addEventListener('click', function() {
            
            document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            
            var idRol = this.getAttribute("rl");
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/RolesUsuarios/getRol/'+idRol;
            request.open("GET",ajaxUrl,true);
            request.send();

            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200){
                    
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        document.querySelector('#idRoles').value = objData.data.id_rol;
                        document.querySelector('#txtNombre').value = objData.data.nombre_rol;
                        document.querySelector('#txtDescripcion').value = objData.data.descripcion;
                        if (objData.data.estado == 0) {
                            var optionSelectR = '<option value="0" selected class="notBlock">Activo</option>';
                        }else{
                            var optionSelectR = '<option value="1" selected class="notBlock">Inactivo</option>';
                        }
                        var htmlSelectR = `${optionSelectR}
                                            <option value="0">Activo</option>
                                            <option value="1">Inactivo</option>
                        `;
                        document.querySelector('#listStatus').innerHTML = htmlSelectR;
                        //se abre el modal
                        $('#modalFormRoles').modal('show');
                    }
                    else{
                        swal("Error", objData.msg ,"error");
                    }
                }
            }
    
        });
    });   
}

function fntDelRol() {
    var btnDelRol = document.querySelectorAll(".btnDelRol");
    btnDelRol.forEach(function(btnDelRol) {
        btnDelRol.addEventListener('click', function() {
            var idUsuario = this.getAttribute("rl");
            
            swal({
                title: "Eliminar rol",
                text: "¿Realmete quieres eliminar el rol?",
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
                    var ajaxUrl = base_url+'/RolesUsuarios/delRol/';
                    var strData = "idRoles="+idRoles;
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