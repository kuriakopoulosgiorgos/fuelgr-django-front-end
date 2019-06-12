menuToggle = document.getElementById("menu-toggle");


function unAuthorizedUser() {
    signInBtn = document.createElement("button");
    signInBtn.id = "sign-in-btn";
    signInBtn.style.marginTop = "20px";
    signInBtn.style.width = "80%";
    signInBtn.classList.add("btn");
    signInBtn.classList.add("btn-primary");
    signInBtn.setAttribute("data-toggle", "modal");
    signInBtn.setAttribute("data-target", "#loginModal");
    signInBtn.innerHTML = "sign in";
    sidebar.innerHTML = "";
    sidebar.appendChild(signInBtn);
}

function onLoginSuccessFull(messageArea, json) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-success");
    messageDiv.setAttribute("role", "alert");
    messageDiv.innerHTML = "Successfully logged in!";
    messageDiv.id = "display-message";
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);


    localStorage.setItem("token", json['token']);
    localStorage.setItem("username", json['username']);

    authedicatedUser();
}

function onLoginFailed(messageArea) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-warning");
    messageDiv.setAttribute("role", "alert");
    messageDiv.innerHTML = "Wrong credentials!";
    messageDiv.id = "display-message";
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);
}

function authedicatedUser() {

    signInButton = document.getElementById("sign-in-btn");
    if (signInButton) {
        signInButton.style.display = "none";
    }
	
    if(document.getElementById("logout-btn") == null) {
    logoutButton = document.createElement("button");
    logoutButton.id = "logout-btn";
    logoutButton.style.marginTop = "20px";
    logoutButton.style.marginLeft = "20px";
    logoutButton.style.width = "80%";
    logoutButton.classList.add("btn");
    logoutButton.classList.add("btn-info");
    logoutButton.innerHTML = "logout";
    logoutButton.addEventListener("click", logout);

    sidebar.appendChild(logoutButton);
}
}

function onFuelTypesReceived(json, selector) {
    selector.innerHtml = "";
    for (i = 0; i < json.length; i++) {
        option = document.createElement("option");
        option.value = json[i]["fueltypeid"];
        option.innerHTML = json[i]["fuelnormalname"];
        selector.appendChild(option);
    }
    getGasStations();
    getStatistics();
}

function onTransactionCompleted(messageArea, message) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-success");
    messageDiv.setAttribute("role", "alert");
    messageDiv.id = "display-message";
    messageDiv.innerHTML = message;
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);
}

function onTransactionFailed(messageArea, message, clean = true) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-warning");
    messageDiv.setAttribute("role", "alert");
    messageDiv.id = "display-message";
    messageDiv.innerHTML = message;
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);
    if (clean) {
        cleanStorage();
        checkAuth();
    }
    checkAuth();
}

function onStatisticsReceived(json) {
    document.getElementById("statistics-count").innerHTML = json.gasstations_count;
    document.getElementById("statistics-min").innerHTML = json.min_price;
    document.getElementById("statistics-max").innerHTML = json.max_price;
    document.getElementById("statistics-avg").innerHTML = json.avg_price;
}

function onPriceListReceived(json) {
    pricelist = json.pricedata_set;
    priceListModal = document.getElementById('products-form-group');
    isTheOwner = isOwner(json.user.username);
    text = '<section class="head">' +
            '<div class="container">' +
            '<h2 class="text-center"><span>' + json.fuelcompnormalname + '</span></h2>' +
            '</div>' +
            '</section>' +
            '<div class="clearfix"></div>' +
            '<section class="search-box">' +
            '<div class="container-fluid">' +
            '<div class="row">' +
            '<div class="col-md-12 listing-block">';
    for (i = 0; i < pricelist.length; i++) {
        ownerEditBtn = "";
        ownerOrdersBtn = "";
        if (isTheOwner) {
            ownerEditBtn = '<button class="btn btn-warning right" data-dismiss="modal" data-toggle="modal" data-target="#editFuelModal" onclick="getFuel(' + pricelist[i].productid + ')">edit</button>';
        }
        text +=
                '<div class="media">' +
                '<div class="fav-box"><i class="fa fa-heart-o" aria-hidden="true"></i>' +
                '</div>' +
                '<img height=80px width = 80px class="d-flex align-self-start" src="fuel.jpeg">' +
                '<div class="media-body pl-3">' +
                '<div class="price">' + pricelist[i].fuelprice + '€ / λίτρο<br/><small style="overflow-wrap: break-word;">' + pricelist[i].fuelname + '</small></div>' +
                '</div>' +
                ownerEditBtn +
                '<input id="input' + pricelist[i].productid + '" class="right min-input" type="number"></input>' +
                '<button id="order-btn' + pricelist[i].productid + '" class="btn btn-info right" data-dismiss="modal" onclick="makeOrder(' + pricelist[i].productid + ')">order</button>' +
                '</div>'
    }
    text +=
            '</div>' +
            '</div>' +
            '</div>' +
            '</section>';

    if (isTheOwner) {
        buttons = '<button class="btn btn-success" data-dismiss="modal" data-toggle="modal" data-target="#orderListModal" onclick="getFuelOrders(' + json.gasstationid + ')">orders</button>' +
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
        listFooter = document.getElementById('fuel-list-footer').innerHTML = buttons;
    } else {
        listFooter = document.getElementById('fuel-list-footer').innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    }
    priceListModal.innerHTML = text;
}

function onFuelReceived(json) {
    document.getElementById('fueltypeid').value = json.fueltypeid;
    document.getElementById('fuelsubtypeid').value = json.fuelsubtypeid;
    document.getElementById('fuelnormalname').value = json.fuelnormalname;
    document.getElementById('fuelname').value = json.fuelname;
    document.getElementById('fuelprice').value = json.fuelprice;

    footerArea = document.getElementById('fuel-update-footer');
    footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
            '<button type="button" class="btn btn-primary" onclick="updateFuel(' + json.productid + ')">Update</button>';
    footerArea.innerHTML = footer;
}

function onUpdateCompleted(messageArea, message) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-success");
    messageDiv.setAttribute("role", "alert");
    messageDiv.id = "display-message";
    messageDiv.innerHTML = message;
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    getGasStations();
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);
}

function onUpdateFailed(messageArea, message) {
    messageDiv = document.createElement('div');
    messageDiv.classList.add("alert");
    messageDiv.classList.add("alert-warning");
    messageDiv.setAttribute("role", "alert");
    messageDiv.innerHTML = message;
    messageDiv.id = "display-message";
    messageArea.innerHTML = "";
    messageArea.appendChild(messageDiv);
    setTimeout(function () {
        $('#display-message').remove()
    }, 3000);
    cleanStorage();
    checkAuth();
}

function onFuelOrdersReceived(orders) {

    orderListModal = document.getElementById('orders-form-group');
    text = '<section class="head">' +
            '<div class="container">' +
            '<h2 class="text-center"><span>Παραγγελίες</span></h2>' +
            '</div>' +
            '</section>' +
            '<div class="clearfix"></div>' +
            '<section class="search-box">' +
            '<div class="container-fluid">' +
            '<div class="row">' +
            '<div class="col-md-12 listing-block">';
    for (i = 0; i < orders.length; i++) {
        text +=
                '<div class="media">' +
                '<div class="fav-box"><i class="fa fa-heart-o" aria-hidden="true"></i>' +
                '</div>' +
                '<img height=80px width = 80px class="d-flex align-self-start" src="order.png">' +
                '<div class="media-body pl-3">' +
                '<div class="price">Ποσότητα : ' + orders[i].quantity + '<br/><small style="overflow-wrap: break-word;">Ημερομηνία : ' + new Date(orders[i].when).toLocaleDateString('en-GB') + '</small></div>' +
                '</div>' +
                '</div>';
    }
    text +=
            '</div>' +
            '</div>' +
            '</div>' +
            '</section>';

    listFooter = document.getElementById('orders-list-footer').innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    orderListModal.innerHTML = text;
}






