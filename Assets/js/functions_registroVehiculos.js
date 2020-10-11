var tableVehiculos;

document.addEventListener('DOMContentLoaded', function() {

    tableVehiculos = $('#tableVehiculos').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax": {
            "url": " " + base_url + "/RegistroVehiculos/getVehiculos",
            "dataSrc": ""
        },
        "columns": [
            { "data": "placa" },
            { "data": "num_documento" },
            { "data": "acronimo_td" },
            { "data": "nom_vehiculo" },
            { "data": "numero_modelo" },
            { "data": "options" }
        ],
        "resonsieve": "true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [
            [0, "asc"]
        ]

    });
    //______________________________________________________________________________________________________________________
    //Nuevo  vehiculo
    var formVehiculo = document.querySelector("#formVehiculo");
    formVehiculo.onsubmit = function(e) {
        e.preventDefault();
        var strPlaca = document.querySelector('#txtPlaca').value;
        var strNumDocumento = document.querySelector('#txtDocumento').value;
        var intTpDocumento = document.querySelector('#txtTpDocumento').value;
        var intTpVehiculo = document.querySelector('#txtTpVehiculo').value;
        var strNumModelo = document.querySelector('#txtNumeroModelo').value;

        if (strPlaca == '' || strNumModelo == '') {
            swal("Atención", "Todos los campos son obligatios.", "error");
            return false;
        }
        var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        var ajaxUrl = base_url + '/RegistroVehiculos/setVehiculo';
        var formData = new FormData(formVehiculo);
        request.open('POST', ajaxUrl, true);
        request.send(formData);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var objData = JSON.parse(request.responseText);
                if (objData.status) {
                    $('#modalFormVehiculo').modal("hide");
                    formVehiculo.reset();
                    swal("Vehiculos", objData.msg, "success");
                    tableVehiculos.api().ajax.reload(function() {

                    });
                } else {
                    swal("Error", objData.msg, "error");
                }
            }
        }


    }
}, false);

//_______________________________________________________________________________________________________
//Buscar un vehiculo en el select

window.addEventListener('load', function() {
    ftnDocumentoVehiculo();
    ftnTpDocumentoVehiculo();
    ftnTpVehiculo();
}, false)


function ftnDocumentoVehiculo() {
    var ajaxUrl = base_url + '/RegistroVehiculos/getSelectDocumentoVehiculos';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open('GET', ajaxUrl, true);
    request.send();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            document.querySelector('#txtDocumento').innerHTML = request.responseText;
            document.querySelector('#txtDocumento').value = 1;
            $('#txtDocumento').selectpicker('render');
        }
    }


}

function ftnTpDocumentoVehiculo() {
    var ajaxUrl = base_url + '/RegistroVehiculos/getSelectTpDocumentoVehiculos';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open('GET', ajaxUrl, true);
    request.send();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            document.querySelector('#txtTpDocumento').innerHTML = request.responseText;
            document.querySelector('#txtTpDocumento').value = 1;
            $('#txtTpDocumento').selectpicker('render');
        }
    }


}

function ftnTpVehiculo() {
    var ajaxUrl = base_url + '/RegistroVehiculos/getSelectTpVehiculo';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open('GET', ajaxUrl, true);
    request.send();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            document.querySelector('#txtTpVehiculo').innerHTML = request.responseText;
            document.querySelector('#txtTpVehiculo').value = 1;
            $('#txtTpVehiculo').selectpicker('render');
        }
    }


}



//_____________________________________________________________________________________________________________

$('#tableVehiculos').DataTable();

function openModalVehiculos() {

    document.querySelector('#idVehiculo').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Vehiculo";
    document.querySelector('#formVehiculo').reset();

    $('#modalFormVehiculo').modal('show');
}
window.addEventListener('load', function() {
    ftnEditVehiculo();
    fntDelVehiculo();
}, false);

//______________________________________________________________________________________

function ftnEditVehiculo() {
    var btnEditVehiculo = document.querySelectorAll(".btnEditVehiculo");
    btnEditVehiculo.forEach(function(btnEditVehiculo) {
        btnEditVehiculo.addEventListener('click', function() {

            document.querySelector('#titleModal').innerHTML = "Actualizar Vehiculo";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";

            var idVehiculo = this.getAttribute("us");
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + '/registroVehiculos/getVehiculo' + idVehiculo;
            request.open("GET", ajaxUrl, true);
            request.send();

            request.onreadystatechange = function() {
                $('#modalFormVehiculo').modal('show');
            }

        });
    });
}


//______________________________________________________________________________________________________________
//Eliminar Vehiculo
function fntDelVehiculo() {
    var btnDelVehiculo = document.querySelectorAll(".btnDelVehiculo");
    btnDelVehiculo.forEach(function(btnDelVehiculo) {
        btnDelVehiculo.addEventListener('click', function() {
            var txtPlaca = this.getAttribute("rl");
            //alert(txtPlaca);

            swal({
                title: "Eliminar el vehiculo",
                text: "¿Realmete quieres eliminar el vehiculo?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Eliminar",
                cancelButtonText: "No, Cancelar",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {

                if (isConfirm) {
                    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    var ajaxUrl = base_url + '/registroVehiculos/DelVehiculo';
                    var strData = "placa=" + txtPlaca;
                    request.open("POST", ajaxUrl, true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    request.send(strData);
                    request.onreadystatechange = function() {
                        if (request.readyState == 4 && request.status == 200) {
                            var objData = JSON.parse(request.responseText);
                            if (objData.status) {
                                swal("Eliminar!", objData.msg, "success");
                                tableVehiculo.api().ajax.reload(function() {
                                    ftnEditVehiculo();
                                    fntDelVehiculo();
                                });
                            } else {
                                swal("Atencion!", objData.msg, "Error");
                            }
                        }
                    }
                }
            });
        });
    });
}