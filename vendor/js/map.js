var map;
var markers = [];
var gasStationsJson;
var infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.6315214, lng: 22.446073},
        zoom: 7
    });

    infoWindow = new google.maps.InfoWindow({
        map: map
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cbGetCurPosOK, cbGetCurPosFail);
    }
}

function cbGetCurPosOK(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var curPosition = new google.maps.LatLng(lat, long);

    map.setCenter(curPosition);


    var curMarker = new google.maps.Marker({
        position: curPosition,
        title: "You are here",
        icon: "me.png"
    });

    curMarker.setMap(map);
}

function cbGetCurPosFail(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}


function onGasStationsReceived(json) {
    cleanMapAndStations();
    gasStationsJson = json;
    for (i = 0; i < json.length; i++) {
        icon = "logos/" + json[i].gasstation.fuelcompid + ".png";
        marker = new MarkerWithLabel({
            position: new google.maps.LatLng(json[i].gasstation.gasstationlat, json[i].gasstation.gasstationlong),
            title: json[i].gasstation.fuelcompnormalname,
            icon: {
                url: icon,
                anchor: new google.maps.Point(17, 50)
            },
            map: map,
            labelContent: json[i].fuelprice + "€",
            labelAnchor: new google.maps.Point(19, 15),
            labelClass: "labels",
            labelInBackground: false
        });
        marker.gasStationIndex = i;
        markers.push(marker);
        
        relateInfoWindow(marker);
    }
    zoomExtends();
}

function cleanMapAndStations() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    gasStationsJson = null;
}


function zoomExtends() {
    //ορίζουμε ένα object-ορθογώνιο (για να ζουμάρουμε μετά πάνω του)
    var bounds = new google.maps.LatLngBounds();
    //σαρώνουμε όλα τα markers και αναπροσαρμόζουμε τις συντεταγμένες
    //του παραπάνω ορθογωνίου ώστε τα markers να περιέχονται μέσα του
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
    }
    //zoomάρουμε πάνω στο οριστικοποιημένο ορθογώνιο
    map.fitBounds(bounds);
}

function relateInfoWindow(marker) {
    google.maps.event.addListener(marker, 'click', function () {
        gasStationIndex = marker.gasStationIndex;
        gasStation = gasStationsJson[gasStationIndex];
        infowinText = createInfoWinText(gasStation);
        infoWindow.setContent(infowinText);
        infoWindow.open(map, this);
    });
}


function createInfoWinText(gasStation) {
    productsButton = "";
    phone = "";
    if (isAuthedicated()) {
        gasStationid = gasStation.gasstation.gasstationid;
        productsButton = '<button id="priceList-btn" class="btn btn-info" data-toggle="modal" data-target="#priceListModal" style="width: 80%;" onclick="getPriceList(' + gasStationid + ')">products</button>';
    }
    if (gasStation.gasstation.phone1) {
        phone = gasStation.gasstation.phone1;
    }

    content = '<div id="iw-container">' +
            '<div class="iw-title">' + gasStation.gasstation.fuelcompnormalname + '</div>' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">' + gasStation.fuelnormalname + ' : ' + gasStation.fuelprice + '€</div>' +
            '<img src="logos/' + gasStation.gasstation.fuelcompid + '.png">' +
            productsButton +
            '<div class="iw-subTitle">Επικοινωνία</div>' +
            '<p>Διεύθυνση : ' + gasStation.gasstation.gasstationaddress + '<br>' +
            '<br>Τηλέφωνο : ' + phone + '</p>' +
            '</div>' +
            '<div class="iw-bottom-gradient"></div>' +
            '</div>';
    return content;

}

