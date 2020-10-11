var tableTipoVehiculo;

document.addEventListener('DOMContentLoaded', function(){

    tableTipoVehiculo = $('#tableTipoVehiculo').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/TipoVehiculo/getTipoVehiculos",
            "dataSrc":""
        },
        "columns":[ 
            {"data": "id_tp_vehiculo"},
            {"data": "nom_vehiculo"},
            {"data": "options"}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"asc"]]
        
    });
//Nuevo tipo de vehiculo
var formTipoVehiculo = document.querySelector("#formTipoVehiculo");
formTipoVehiculo.onsubmit = function(e) {
    e.preventDefault();
    
    var strIdUsuario = document.querySelector('#idTpVehiculo').value;
    var strNombreVehiculo = document.querySelector('#txtnomTp').value;
    if(strNombreVehiculo == '')
    {
        swal("Atención", "Todos los campos son obligatios." , "error");
        return false;
    }

    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/TipoVehiculo/setTipoVehiculo';
    var formData = new FormData(formTipoVehiculo);
    request.open("POST",ajaxUrl,true);
    request.send(formData);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){

            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#modalFormTipoVehiculo').modal("hide");
                formTipoVehiculo.reset();
                swal("Nuevo Vehiculo", objData.msg ,"success");
                tableTipoVehiculo.api().ajax.reload(function(){
                    ftnEditTpVehiculo();
                });
            } else {
                swal("Error", objData.msg , "error" );
            }
        }
    }
}
});

$('#tableTipoVehiculo').DataTable();

function openModalTipoVehiculo(){

    document.querySelector('#idTpVehiculo').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Tipo Vehiculo";
    document.querySelector('#formTipoVehiculo').reset();

    $('#modalFormTipoVehiculo').modal('show');
}

window.addEventListener('load', function() {
    ftnEditTpVehiculo();
    fntDelTipoVehiculo();
}, false);

function ftnEditTpVehiculo() {
    var btnEditTpVehiculo = document.querySelectorAll(".btnEditTpVehiculo");
    btnEditTpVehiculo.forEach(function(btnEditTpVehiculo) {
        btnEditTpVehiculo.addEventListener('click', function() {
            
            document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            
            var idTpVehiculo = this.getAttribute("rl");
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/TipoVehiculo/getTipoVehiculo/'+idTpVehiculo;
            request.open("GET",ajaxUrl,true);
            request.send();

            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200){
                    
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        document.querySelector('#idTpVehiculo').value = objData.data.id_tp_vehiculo;
                        document.querySelector('#txtnomTp').value = objData.data.nom_vehiculo;
                        //se abre el modal
                        $('#modalFormTipoVehiculo').modal('show');
                    }
                    else{
                        swal("Error", objData.msg ,"error");
                    }
                }
            }
    
        });
    });
}

function fntDelTipoVehiculo() {
    var btnDelTpVehiculo = document.querySelectorAll(".btnDelTpVehiculo");
    btnDelTpVehiculo.forEach(function(btnDelTpVehiculo) {
        btnDelTpVehiculo.addEventListener('click', function() {
            var idTpVehiculo = this.getAttribute("rl");
            
            swal({
                title: "Eliminar Tipo de vehiculo",
                text: "¿Realmete quieres eliminar a el Tipo de vehiculo?",
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
                    var ajaxUrl = base_url+'/TipoVehiculo/DelTipoVehiculo/';
                    var strData = "idTpVehiculo="+idTpVehiculo;
                    request.open("POST",ajaxUrl,true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    request.send(strData);
                    request.onreadystatechange = function() {
                        if(request.readyState == 4 && request.status == 200){
                            var objData = JSON.parse(request.responseText);
                            if(objData.status)
                            {
                                swal("Eliminar!", objData.msg ,"success");
                                tableTipoVehiculo.api().ajax.reload(function() {
                                    ftnEditTpVehiculo();
                                    fntDelTipoVehiculo();
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
