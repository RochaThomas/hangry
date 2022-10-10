
function nav_login_react(element) {
    element.classList.add("on_hover_navbar_login");
}
function nav_login_unreact(element) {
    element.classList.remove("on_hover_navbar_login");
}

function nav_link_react(element) {
    element.classList.add("on_hover_navbar_link");
}
function nav_link_unreact(element) {
    element.classList.remove("on_hover_navbar_link");
}

function nav_sign_up_react(element) {
    element.classList.add("on_hover_navbar_sign_up");
}
function nav_sign_up_unreact(element) {
    element.classList.remove("on_hover_navbar_sign_up");
}

function nav_logout_react(element) {
    element.classList.add("on_hover_navbar_logout");
}
function nav_logout_unreact(element) {
    element.classList.remove("on_hover_navbar_logout");
}

function box_react(element) {
    element.classList.add("on_hover_boxes");
}
function box_unreact(element) {
    element.classList.remove("on_hover_boxes");
}

function box_button_react(element) {
    element.classList.add("on_hover_boxes_buttons");
}
function box_button_unreact(element) {
    element.classList.remove("on_hover_boxes_buttons");
}

function sign_up_react(element) {
    element.classList.add("on_hover_sign_up_button");
}
function sign_up_unreact(element) {
    element.classList.remove("on_hover_sign_up_button");
}

function login_react(element) {
    element.classList.add("on_hover_login_button");
}
function login_unreact(element) {
    element.classList.remove("on_hover_login_button");
}

function add_react(element) {
    element.classList.add("on_hover_add_button");
}
function add_unreact(element) {
    element.classList.remove("on_hover_add_button");
}

function rand_favs_btns_react(element) {
    element.classList.add("on_hover_red_btn_white_wrd");
}
function rand_favs_btns_unreact(element) {
    element.classList.remove("on_hover_red_btn_white_wrd");
}


var geocoder;
var map;
function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(37.4221, -122.0841);
    var mapOptions = {
        zoom: 14,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    geocodeAddress();
}

function geocodeAddress() {
    var address = document.getElementById('address').innerText;
    console.log(address)
    geocoder.geocode( {'address': address}, function(results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following resason: ' + status);
        }
    });
}

function initMap(){
    // icon used for creating markers on the map
    const icon = {
        url: "/static/checkPin.png",
        scaledSize: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(0,25),
    };

    const userLat = Number(document.getElementById("lat").value);
    const userLng = Number(document.getElementById("lng").value);

    const userLocation = { lat: userLat, lng: userLng };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: userLocation,
    });

    new google.maps.Marker({
        position: userLocation,
        map: map,
    });

    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: userLocation,
        radius: 500,
        type: "restaurant",
        fields: ["name", "geometry"],
    };

    const callback = (results, status) => {
        console.log(results);

        // get the html list
        let listOfPlaces = document.getElementById("places");

        // setting prevWindow for onhover window display handling
        let prevWindow = false;

        // check if the response from the request is okay
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            places = results;

            for (const place of places) {
                if (place.geometry && place.geometry.location){
                    const marker = new google.maps.Marker(
                        {
                            position: place.geometry.location,
                            map: map,
                            icon: icon,
                        }
                    );

                    const infoWindow = new google.maps.InfoWindow({content: place.name});
                    marker.addListener("mouseover", () => {
                        if (prevWindow){
                            prevWindow.close()
                        }

                        prevWindow = infoWindow;
                        infoWindow.open(map, marker);
                    });

                    const inputContainer = document.createElement("div");
                    inputContainer.class = "input-container";
                    listOfPlaces.appendChild(inputContainer);

                    const placeInput = document.createElement("input");
                    const labelPlaceInput = document.createElement("label");

                    placeInput.type = "checkbox";
                    placeInput.checked = true;
                    placeInput.id = place.place_id;
                    placeInput.classList.add("selected");
                    placeInput.name = place.place_id;
                    placeInput.value = place.name;
                    labelPlaceInput.htmlFor = place.place_id;
                    labelPlaceInput.textContent = place.name;

                    inputContainer.appendChild(placeInput);
                    inputContainer.appendChild(labelPlaceInput);

                    inputContainer.addEventListener("mouseover", () => {
                        bigSize = new google.maps.Size(35, 35);
                        bigAnchor = new google.maps.Point(0, 35);
                        marker.setIcon({
                            ...marker.icon,
                            scaledSize: bigSize,
                            anchor: bigAnchor,
                        });
                    });

                    inputContainer.addEventListener("mouseout", () => {
                        smallSize = new google.maps.Size(25, 25);
                        smallAnchor = new google.maps.Point(0, 25);
                        marker.setIcon({
                            ...marker.icon,
                            scaledSize: smallSize,
                            anchor: smallAnchor,
                        });
                    });

                    placeInput.addEventListener("click", () => {
                        if (placeInput.classList.contains("selected")) {
                            marker.setIcon({...marker.icon, 
                                url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                            });
                            placeInput.classList.add("unselected");
                            placeInput.classList.remove("selected");
                        }
                        else if (placeInput.classList.contains("unselected")) {
                            marker.setIcon({...marker.icon, 
                                url: "/static/checkPin.png",
                            });
                            placeInput.classList.add("selected");
                            placeInput.classList.remove("unselected");
                        }
                    });
                }
            }

            const submitButton = document.createElement("input");
            submitButton.type = "submit";
            submitButton.value = "Submit Selected Restaurants";
            listOfPlaces.appendChild(submitButton);

        }
    }

    service.nearbySearch(request, callback);
    
};