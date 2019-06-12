var rootUrl = 'http://localhost:8000/';
var selector = document.getElementById("fueltype-selector");
window.addEventListener('load', getFuelTypes);
selector.addEventListener('click', getGasStations);
selector.addEventListener('click', getStatistics);

function getFuelTypes() {
    var ajaxObject = initAjax();
    url = "pricedata/fueltypes/";
    ajaxObject.open("GET", rootUrl + url);
    ajaxObject.send();
    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(ajaxObject.responseText);
            onFuelTypesReceived(json, selector);
        }
    }
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var messageArea = document.getElementById("message-area");

    var ajaxObject = initAjax();
    url = "api/auth/token/";
    ajaxObject.open('POST', rootUrl + url, true);
    ajaxObject.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');


    var loginObject = JSON.stringify(
            {
                username: username,
                password: password
            });
    ajaxObject.send(loginObject);

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onLoginSuccessFull(messageArea, json);
        }

        if (ajaxObject.readyState === 4 && (ajaxObject.status === 403 || ajaxObject.status === 400)) {
            onLoginFailed(messageArea);
        }
    }

    $('#loginModal').modal('toggle');
}

function makeOrder(productID) {
    var messageArea = document.getElementById("message-area");
    var quantity = document.getElementById("input" + productID).value;
    if (quantity == "") {
        onTransactionFailed(messageArea, "    Please give quantity!", false);
        return;
    }
    var messageArea = document.getElementById("message-area");
    var ajaxObject = initAjax();
    jwtToken = "JWT " + localStorage.getItem("token");
    url = "order/";
    ajaxObject.open('POST', rootUrl + url, true);
    ajaxObject.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    ajaxObject.setRequestHeader('Authorization', jwtToken);


    var orderObject = JSON.stringify(
            {
                productid: productID,
                quantity: quantity
            });
    ajaxObject.send(orderObject);

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 201) {
            var json = JSON.parse(this.responseText);
            onTransactionCompleted(messageArea, "    Transaction completed!");
        }

        if (ajaxObject.readyState === 4 && ajaxObject.status === 401) {
            var json = JSON.parse(this.responseText);
            onTransactionFailed(messageArea, "    Please login!");
        }
    }

    $('#orderModal').modal('toggle');
}

function getStatistics() {
    var ajaxObject = initAjax();
    id = selector.options[selector.selectedIndex].value;
    url = "statistics/"+id+'/';
    ajaxObject.open('GET', rootUrl + url);
    ajaxObject.send();

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onStatisticsReceived(json);
        }
    }
}
function getGasStations() {
    var ajaxObject = initAjax();
    id = selector.options[selector.selectedIndex].value;
    url = "pricedata/" + id + "/gasstations";
    ajaxObject.open('GET', rootUrl + url);
    ajaxObject.send();

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onGasStationsReceived(json);
        }
    }
}

function getPriceList(gasStationID) {
    var ajaxObject = initAjax();
    url = "gasstations/" + gasStationID + "/pricelist";
    ajaxObject.open('GET', rootUrl + url);
    ajaxObject.send();

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onPriceListReceived(json);
        }
        if (ajaxObject.readyState === 4 && ajaxObject.status === 404) {
            onPriceListFailed();
        }
    }
}

function getFuel(productID) {
    var ajaxObject = initAjax();
    url = "pricedata/" + productID;
    ajaxObject.open('GET', rootUrl + url);
    ajaxObject.send();
    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onFuelReceived(json);
        }
    }
}


function updateFuel(productID) {
    fuletypeid = document.getElementById('fueltypeid').value;
    fuelsubtypeid = document.getElementById('fuelsubtypeid').value;
    fuelnormalname = document.getElementById('fuelnormalname').value;
    fuelname = document.getElementById('fuelname').value;
    fuelprice = document.getElementById('fuelprice').value;
    messageArea = document.getElementById("message-area");

    var ajaxObject = initAjax();
    url = "pricedata/" + productID;
    jwtToken = "JWT " + localStorage.getItem("token");
    ajaxObject.open('PUT', rootUrl + url, true);
    ajaxObject.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    ajaxObject.setRequestHeader('Authorization', jwtToken);


    var fuelObject = JSON.stringify(
            {
                fuletypeid: fuletypeid,
                fuelsubtypeid: fuelsubtypeid,
                fuelnormalname: fuelnormalname,
                fuelname: fuelname,
                fuelprice: fuelprice
            });
    ajaxObject.send(fuelObject);

    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 202) {
            var json = JSON.parse(this.responseText);
            onUpdateCompleted(messageArea, "Fuel updated successfully!");
            //console.log(json.gasstation); //TODO
        }

        if (ajaxObject.readyState === 4 && (ajaxObject.status === 403 || ajaxObject.status === 400)) {
            onUpdateFailed(messageArea, "Please login!");
        }
    }

    $('#editFuelModal').modal('toggle');
}

function getFuelOrders(gasStationID) {
    var ajaxObject = initAjax();
    url = "order/" + gasStationID + '/';
    ajaxObject.open('GET', rootUrl + url);
    jwtToken = "JWT " + localStorage.getItem("token");
    ajaxObject.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    ajaxObject.setRequestHeader('Authorization', jwtToken);
    ajaxObject.send();
    ajaxObject.onreadystatechange = function () {
        if (ajaxObject.readyState === 4 && ajaxObject.status === 200) {
            var json = JSON.parse(this.responseText);
            onFuelOrdersReceived(json);
        }
    }
}




function initAjax() {
    if (window.XMLHttpRequest) { // all modern browsers
        return ajaxObject = new XMLHttpRequest();
    } else if (window.ActiveXObject) { //for IE5, IE6
        return ajaxObject = new ActiveXObject("Microsoft.XMLHTTP");
    } else { //AJAX not supported
        alert("Your browser does not support AJAX calls!");
        return false;
    }
}


