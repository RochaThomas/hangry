
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

const openIconModal = () => {
    let modal = document.getElementById("info-icon-modal")
    modal.style.display = "block";
};
const closeIconModal = () => {
    let modal = document.getElementById("info-icon-modal")
    modal.style.display = "none";
};


// var geocoder;
// var map;
// function initMap() {
//     geocoder = new google.maps.Geocoder();
//     var latlng = new google.maps.LatLng(37.4221, -122.0841);
//     var mapOptions = {
//         zoom: 14,
//         center: latlng
//     }
//     map = new google.maps.Map(document.getElementById('map'), mapOptions);
//     geocodeAddress();
// }

// function geocodeAddress() {
//     var address = document.getElementById('address').innerText;
//     console.log(address)
//     geocoder.geocode( {'address': address}, function(results, status) {
//         if (status == 'OK') {
//             map.setCenter(results[0].geometry.location);
//             var marker = new google.maps.Marker({
//                 map: map,
//                 position: results[0].geometry.location
//             });
//         } else {
//             alert('Geocode was not successful for the following resason: ' + status);
//         }
//     });
// }

function initMap(){
    // icon used for creating markers on the map
    const icon = {
        scaledSize: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(0,25),
    };

    const mapStyling = [
        {
            featureType: "poi.business.food_and_drink",
            stylers: [
                { visibility: "off"}
            ],
        }
    ];

    const userLat = Number(document.getElementById("lat").value);
    const userLng = Number(document.getElementById("lng").value);

    const userLocation = { lat: userLat, lng: userLng };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: userLocation,
        styles: mapStyling,
    });

    new google.maps.Marker({
        position: userLocation,
        map: map,
    });

    // change the request to get the icon?
    // icon_mask_base_uri and icon_background_color
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
            // use the place icon (icon_mask_base_uri and icon_background color) to style icon
            // change how the icons react as well
            // change icon size onhover if possible
            //      if not possible change the color to yellow on hover or something like that
            // change icon color on click to green or blue to indicate the restaurant has been selected

            const findIconType = (types) => {
                if (types.includes("bar") || types.includes("nightclub")) {
                    return "\ue540";
                }
                else if (types.includes("cafe") || types.includes("bakery")) {
                    return "\ue541";
                }
                else {
                    return "\ue56c";
                } 
            }

            for (const place of places) {
                if (place.geometry && place.geometry.location){
                    let label = {
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "18px",
                        text: findIconType(place.types),
                    }
                    
                    const marker = new google.maps.Marker(
                        {
                            position: place.geometry.location,
                            map: map,
                            label: label,
                            opacity: 0.7,
                            title: place.name,
                        }
                    );

                    const infoWindow = new google.maps.InfoWindow({content: place.name});
                    const openCloseInfoWindow = () => {
                        if (prevWindow){
                            prevWindow.close()
                        }
    
                        prevWindow = infoWindow;
                        infoWindow.open(map, marker);
                    }
                    marker.addListener("mouseover", openCloseInfoWindow);

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
                        marker.setLabel({
                            ...marker.label,
                            text: "\ue8b6",
                        });
                        marker.setOpacity(1.0);
                        openCloseInfoWindow();
                        if (document.getElementById("toggle-pan-to").checked) {
                            map.panTo(place.geometry.location);
                        }
                    });

                    inputContainer.addEventListener("mouseout", () => {
                        if (placeInput.classList.contains("selected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: findIconType(place.types),
                            });
                            marker.setOpacity(0.7);
                        }
                        else if (placeInput.classList.contains("unselected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: "\ue5cd",
                            });
                            marker.setOpacity(0.3);
                        }
                    });

                    placeInput.addEventListener("click", () => {
                        if (placeInput.classList.contains("selected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: "\ue5cd",
                            });
                            marker.setOpacity(0.3)
                            placeInput.classList.add("unselected");
                            placeInput.classList.remove("selected");
                        }
                        else if (placeInput.classList.contains("unselected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: findIconType(place.types),
                            });
                            marker.setOpacity(0.7)
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

// adapt to fill user location addresses as well as restaurant addresses
function initAutocomplete() {
    let restaurantName;
    if (document.getElementById("name")) {
        // console.log("if statement worked");
        restaurantName = document.querySelector("#name");
    }
    let streetAddress = document.querySelector("#street_address");
    let city = document.querySelector("#city");
    let state = document.querySelector("#state");
    let zipCode = document.querySelector("#zip_code");

    let autocomplete;

    if (restaurantName) {
        autocomplete = new google.maps.places.Autocomplete(restaurantName, {
            componentRestrictions: { country: ["us"] },
            // add bounds for lng and lat to limit search area
            fields: ["address_components", "geometry", "name"],
            types: ["restaurant"],
        });
    }
    else {
        autocomplete = new google.maps.places.Autocomplete(streetAddress, {
            componentRestrictions: { country: ["us"] },
            // add bounds for lng and lat to limit search area
            fields: ["address_components"],
            types: ["address"],
        });
    }

    const fillInAddress = () => {
        const place = autocomplete.getPlace();
        let autoRestaurantName;
        let autoStreetAddress = "";
        let autoCity = "";
        let autoState = "";
        let autoZipCode = "";

        for (const component of place.address_components) {
            const componentType = component.types[0];
            
            switch (componentType) {
                case "street_number": {
                    autoStreetAddress = `${component.long_name} ${autoStreetAddress}`;
                    break;
                }
                case "route": {
                    autoStreetAddress += component.short_name;
                    break;
                }
                case "postal_code": {
                    autoZipCode = `${component.long_name}${autoZipCode}`;
                    break;
                }
                case "postal_code_suffix": {
                    autoZipCode = `${autoZipCode}-${component.long_name}`;
                    break;
                }
                case "locality": {
                    autoCity = component.long_name;
                    break;
                }
                case "administrative_area_level_1": {
                    autoState = component.short_name;
                    break;
                }
            }
        }
        
        if (place.name) {
            autoRestaurantName = place.name;
            restaurantName.value = autoRestaurantName;
        }
        streetAddress.value = autoStreetAddress;
        city.value = autoCity;
        state.value = autoState;
        zipCode.value = autoZipCode;
    }
    autocomplete.addListener("place_changed", fillInAddress);
};

// fix error handling of user location
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                hiddenLat = document.getElementById("lat");
                hiddenLng = document.getElementById("lng");

                hiddenLat.value = position.coords.latitude;
                hiddenLng.value = position.coords.longitude;

                document.forms["user_location_form"].submit();
            },
            () => {
                handleLocationError(true)
            }
        );
    }
    else {
        handleLocationError(false);
    }
};

const handleLocationError = (browserHasGeolocation) => {
    browserHasGeolocation
        ? alert(
            'Error: The geolocation service failed.\n' + 
            '\nSolution: Check to see if you have your location enabled for this website on your browser or choose the "Manual Entry" option to enter your address instead.'
        )
        : alert("Error: Your browser does not support geolocation")
};

const findLatLngManualEntry = () => {
    let streetAddressInput = document.getElementById("street_address").value;
    let cityInput = document.getElementById("city").value
    let stateInput = document.getElementById("state").value
    let zipCodeInput = document.getElementById("zip_code").value

    let address = streetAddressInput + " "
                + cityInput + " "
                + stateInput + " "
                + zipCodeInput;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': address} )
        .then((results) => {
            console.log("results.results[0]", results.results[0].geometry.location.lat);
            const res = results.results[0].geometry.location;
            let hiddenLat = document.getElementById("lat")
            let hiddenLng = document.getElementById("lng")

            hiddenLat.value = res.lat();
            hiddenLng.value = res.lng();
            document.forms["manual_entry_form"].submit();
        })
        .catch((error) => {
            alert("Geocode failed: " + error);
            console.log("Geocode failed: " + error);
        })
};

window.initMap = initMap;
window.initAutocomplete = initAutocomplete;