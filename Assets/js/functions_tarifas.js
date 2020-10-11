var tableTarifas;

document.addEventListener('DOMContentLoaded', function(){

    tableTarifas = $('#tableTarifas').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/Tarifas/getTarifas",
            "dataSrc":""
        },
        "columns":[ 
            {"data": "nom_vehiculo"},
            {"data": "tarifa_minuto"},
            {"data": "tarifa_hora"},
            {"data": "tarifa_dia"},
            {"data": "options"}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"asc"]]
        
    });
//Nuevo tipo de vehiculo
var formTarifa = document.querySelector("#formTarifas");
formTarifa.onsubmit = function(e) {
    e.preventDefault();
    
    var strIdTarifa = document.querySelector('#idTarifa').value;
    var intTpVehiculo = document.querySelector('#listTipoVehiculo').value;
    var floatTarifaMinuto = document.querySelector('#floatTarifaMinuto').value;
    var floatTarifaHora = document.querySelector('#floatTarifaHora').value;
    var floatTarifaDia = document.querySelector('#floatTarifaDia').value;
    if(intTpVehiculo == '' || floatTarifaMinuto == '' || floatTarifaHora == '' || floatTarifaDia == '' )
    {
        swal("Atención", "Todos los campos son obligatios." , "error");
        return false;
    }

    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/Tarifas/setTarifas';
    var formData = new FormData(formTarifa);
    request.open("POST",ajaxUrl,true);
    request.send(formData);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){

            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#modalFormTarifas').modal("hide");
                formTarifa.reset();
                swal("Nuevo Tarifa", objData.msg ,"success");
                tableTarifas.api().ajax.reload(function(){
                    ftnTpVehiculosTarifas();
                });
            } else {
                swal("Error", objData.msg , "error" );
            }
        }
    }
}
}, false);

$('#tableTarifas').DataTable();

window.addEventListener('load', function () {
    ftnTpVehiculosTarifas();
    ftnEditTarifas();
}, false);

function ftnTpVehiculosTarifas(){
    var ajaxUrl = base_url+'/TipoVehiculo/getSelectTpVehiculo';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open('GET',ajaxUrl,true);
    request.send();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var selectInput = document.querySelector('#listTipoVehiculo').innerHTML = request.responseText;
            document.querySelector('#listTipoVehiculo').value = 1;
            $('#listTipoVehiculo').selectpicker('render');
        }
    }
}

function openModalTarifas(){

    document.querySelector('#idTarifa').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nueva Tarifas";
    document.querySelector('#formTarifas').reset();

    $('#modalFormTarifas').modal('show');
}

function ftnEditTarifas() {
    var ftnEditTarifas = document.querySelectorAll(".btnEditTarifa");
    ftnEditTarifas.forEach(function(ftnEditTarifas) {
        ftnEditTarifas.addEventListener('click', function() {
            
            document.querySelector('#titleModal').innerHTML = "Actualizar Tarifa";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            
            var idTarifa = this.getAttribute("rl");
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/Tarifas/getTarifa/'+idTarifa;
            request.open("GET",ajaxUrl,true);
            request.send();

            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200){
                    
                    var objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        document.querySelector('#idTarifa').value = objData.data.id_tarifas;
                        document.querySelector('#listTipoVehiculo').value = objData.data.fk_id_tp_vehiculo;
                        $('#listTipoVehiculo').selectpicker('render');
                        document.querySelector('#floatTarifaMinuto').value = objData.data.tarifa_minuto;
                        document.querySelector('#floatTarifaHora').value = objData.data.tarifa_hora;
                        document.querySelector('#floatTarifaDia').value = objData.data.tarifa_dia;
                        //se abre el modal
                        $('#modalFormTarifas').modal('show');
                    }
                    else{
                        swal("Error", objData.msg ,"error");
                    }
                }
            }
    
        });
    });
}