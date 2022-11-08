
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
    // expand request fields to take more than just name and geometry
    const request = {
        location: userLocation,
        radius: 500,
        type: "restaurant",
    };

    const callback = (results, status) => {
        // console.log(results);

        // get the html list
        let listOfPlaces = document.getElementById("list-of-places");

        // setting prevWindow for onhover window display handling
        let prevWindow = false;

        // check if the response from the request is okay
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
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

            const openCloseInfoWindow = (infoWindow, marker) => {
                if (prevWindow){
                    prevWindow.close()
                }

                prevWindow = infoWindow;
                infoWindow.open(map, marker);
            }

            const initInfoWindowContent = (placeId, price, infoWindow, marker) => {
                service.getDetails({
                    placeId: placeId,
                    fields: ['formatted_address', 'name', 'opening_hours', 'photos', 'url', 'utc_offset_minutes','website'],
                }, async (result, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(result);
                        let name = result.name,
                            restaurantHours = "",
                            operationStatus = "",
                            firstPhoto = "",
                            restOfPhotos = "",
                            linkToGooglePage = "";
                        
                        // price set from nearby search results

                        // settting restaurant hours
                        for (let i = 0; i < result.opening_hours.weekday_text.length; i++) {
                            restaurantHours += `<p>` + result.opening_hours.weekday_text[i] +`</p>`
                        }

                        if (result.opening_hours.isOpen()) {
                            operationStatus = `<p class="is-open">Open</p>`
                        }
                        else {
                            operationStatus = `<p class="is-closed">Closed</p>`
                        }

                        // setting photos and url to google page
                        if (result.photos) {
                            firstPhoto = `<img class="first-photo" src="` + result.photos[0].getUrl() + `" alt="` + result.name + `photo 1" onclick="openLinkNewTab('` + result.photos[0].getUrl() + `')">`;
                            restOfPhotos = `<div class="rest-of-photos">`;
                            for (let i = 1; i < 4; i++){
                                if (result.photos[i]){
                                    restOfPhotos += `<img src="`+ result.photos[i].getUrl() + `" alt="` + result.name + `photo` + (i + 1) + `" onclick="openLinkNewTab('` + result.photos[i].getUrl() + `')">`;
                                }
                            }
                            linkToGooglePage = 
                                `<span class="link-to-google-page">` + 
                                    `<a href="` + result.url + `" target="_blank" rel="noopener noreferrer">Click For More +</a>` +
                                `</span>`;
                            restOfPhotos += linkToGooglePage + `</div>`;
                        }

                        // translating content into html for infoWindow
                        const contentString = 
                            `<div class="info-window-content">` + 
                                `<h3 class="info-window-title">` + name + `</h3>` +
                                `<div class="price-status">` +
                                    operationStatus +
                                    price + 
                                `</div>` +
                                `<p class="info-window-website-label"> Website: <a href="` + result.website + `" target="_blank" rel="noopener noreferrer">` + result.website + `</a>` +
                                `<div class="restaurant-photos">` + 
                                    firstPhoto +
                                    restOfPhotos +
                                `</div>` +
                                `<div class="restaurant-hours">` + 
                                    `<p>Hours: </p>` + 
                                    `<div class="hours-days">` +
                                        restaurantHours +
                                    `</div>` +
                                `</div>` + 
                                `<p class"formatted-address">Address: ` + result.formatted_address + `</p>` +
                            `</div>`;
                        infoWindow.setContent(contentString);
                    }
                    else {
                        console.log('Status: ', status);
                    }
                    await openCloseInfoWindow(infoWindow, marker);
                });
            }

            for (const place of places) {
                if (place.geometry && place.geometry.location){

                    // find icon used for marker and restaurant list
                    const restaurantIcon = findIconType(place.types);

                    // set marker icon
                    let label = {
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "18px",
                        text: restaurantIcon,
                    }
                    
                    // set marker
                    const marker = new google.maps.Marker(
                        {
                            position: place.geometry.location,
                            map: map,
                            label: label,
                            opacity: 0.7,
                            title: place.name,
                        }
                    );

                    const infoWindow = new google.maps.InfoWindow({content: null});


                    marker.addListener("mouseover", () => {
                        if (!infoWindow.content) {
                            initInfoWindowContent(place.place_id, price, infoWindow, marker);
                        }
                        else {
                            openCloseInfoWindow(infoWindow, marker);
                        }
                    });

                    const inputContainer = document.createElement("div");
                    inputContainer.classList.add("list-input-container");
                    listOfPlaces.appendChild(inputContainer);

                    const placeInput = document.createElement("input");
                    const labelPlaceInput = document.createElement("label");

                    placeInput.type = "checkbox";
                    placeInput.checked = true;
                    placeInput.id = place.place_id;
                    placeInput.classList.add("selected");
                    placeInput.name = place.place_id;
                    placeInput.value = place.name;

                    let priceFill = "",
                        priceShadow = "",
                        price = "";

                    // setting price for list and info windows
                    for (let i = 0; i < place.price_level; i++) {
                        priceFill += '$';
                    }
                    for (let j = 0; j < 4 - priceFill.length; j++) {
                        priceShadow += '$';
                    }
                    price =
                        `<p class="restaurant-price">` + 
                            `Price: ` + `<span class="price-fill">` + priceFill + `</span>` + `<span class="price-shadow">` + priceShadow + `</span>` + 
                        `</p>`;

                    labelPlaceInput.htmlFor = place.place_id;
                    labelPlaceInput.innerHTML = 
                        `<div class="label-input-container">` +
                            `<h3 class="list-icon">` + restaurantIcon + `</h3>` +
                            `<div class="list-name-price">` +
                            `<p class="restaurant-input-name">` + place.name + `</p>` +
                            price +
                            `</div>` + 
                        `</div>`;
                            

                    inputContainer.appendChild(placeInput);
                    inputContainer.appendChild(labelPlaceInput);

                    let timer = null;
                    inputContainer.addEventListener("mouseover", () => {
                        timer = window.setTimeout(() => {
                            if (!infoWindow.content) {
                                initInfoWindowContent(place.place_id, price, infoWindow, marker);
                            }
                            else {
                                openCloseInfoWindow(infoWindow, marker);
                            }
                        }, "1000");
                        marker.setLabel({
                            ...marker.label,
                            text: "\ue8b6",
                        });
                        marker.setOpacity(1.0);
                        if (document.getElementById("toggle-pan-to").checked) {
                            map.panTo(place.geometry.location);
                        }
                    });

                    inputContainer.addEventListener("mouseout", () => {
                        window.clearTimeout(timer);
                        if (prevWindow) {
                            prevWindow.close();
                        }
                        if (placeInput.classList.contains("selected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: restaurantIcon,
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

                    inputContainer.addEventListener("click", () => {
                        if (placeInput.classList.contains("selected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: "\ue5cd",
                            });
                            marker.setOpacity(0.3)
                            placeInput.classList.add("unselected");
                            placeInput.classList.remove("selected");
                            placeInput.checked = false;
                        }
                        else if (placeInput.classList.contains("unselected")) {
                            marker.setLabel({
                                ...marker.label,
                                text: restaurantIcon,
                            });
                            marker.setOpacity(0.7)
                            placeInput.classList.add("selected");
                            placeInput.classList.remove("unselected");
                            placeInput.checked = true;
                        }
                    });
                }
            }


            // const submitButton = document.createElement("input");
            // submitButton.type = "submit";
            // submitButton.value = "Submit Selected Restaurants";
            // listOfPlaces.appendChild(submitButton);

        }
    }

    service.nearbySearch(request, callback);
    
};

// adapt to fill user location addresses as well as restaurant addresses
function initAutocomplete() {
    // if the page has a scroll bar, keep it at the correct spot
    if (document.getElementById("list-of-selected")) {
        let scrollbar = document.querySelector("#list-of-selected")
        scrollbar.scrollTop = -scrollbar.scrollHeight;
    }

    let restaurantName;
    if (document.getElementById("name")) {
        restaurantName = document.querySelector("#name");
    }
    let streetAddress = document.querySelector("#street_address");
    let city = document.querySelector("#city");
    let state = document.querySelector("#state");
    let zipCode = document.querySelector("#zip_code");
    let placeId;

    if (document.querySelector("#place_id")) {
        placeId = document.querySelector("#place_id");
    }

    let autocomplete;

    if (restaurantName) {
        autocomplete = new google.maps.places.Autocomplete(restaurantName, {
            componentRestrictions: { country: ["us"] },
            // add bounds for lng and lat to limit search area
            fields: ["address_components", "geometry", "name", "place_id"],
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
        if (place.place_id) {
            placeId.value = place.place_id;
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

const getResultInfo = () => {
    console.log("hit")
    let resultInfo = document.getElementById("result-info");
    const service = new google.maps.places.PlacesService(resultInfo);
    const placeId = document.getElementById('result_id').value;

    service.getDetails({
        placeId: placeId,
        fields: ['formatted_address', 'opening_hours', 'photos', 'price_level', 'url', 'utc_offset_minutes','website'],
    }, (result, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(result);
            let restaurantHours = "",
                operationStatus = "",
                firstPhoto = "",
                restOfPhotos = "",
                linkToGooglePage = "",
                priceFill = "",
                priceShadow = "";
            
            // price set from nearby search results
            for (let i = 0; i < result.price_level; i++) {
                priceFill += '$';
            }
            for (let j = 0; j < 4 - priceFill.length; j++) {
                priceShadow += '$';
            }
            price =
                `<p class="restaurant-price">` + 
                    `Price: ` + `<span class="price-fill">` + priceFill + `</span>` + `<span class="price-shadow">` + priceShadow + `</span>` + 
                `</p>`;

            // settting restaurant hours
            for (let i = 0; i < result.opening_hours.weekday_text.length; i++) {
                restaurantHours += `<p>` + result.opening_hours.weekday_text[i] +`</p>`
            }

            if (result.opening_hours.isOpen()) {
                operationStatus = `<p class="is-open">Open</p>`
            }
            else {
                operationStatus = `<p class="is-closed">Closed</p>`
            }

            // setting photos and url to google page
            if (result.photos) {
                firstPhoto = `<img class="first-photo" src="` + result.photos[0].getUrl() + `" alt="` + result.name + `photo 1" onclick="openLinkNewTab('` + result.photos[0].getUrl() + `')">`;
                restOfPhotos = `<div class="rest-of-photos">`;
                for (let i = 1; i < 4; i++){
                    if (result.photos[i]){
                        restOfPhotos += `<img src="`+ result.photos[i].getUrl() + `" alt="` + result.name + `photo` + (i + 1) + `" onclick="openLinkNewTab('` + result.photos[i].getUrl() + `')">`;
                    }
                }
                linkToGooglePage = 
                    `<span class="link-to-google-page">` + 
                        `<a href="` + result.url + `" target="_blank" rel="noopener noreferrer">Click For More +</a>` +
                    `</span>`;
                restOfPhotos += linkToGooglePage + `</div>`;
            }

            // translating content into html for infoWindow
            const contentString = 
                `<div class="info-window-content">` + 
                    `<h3 class="info-window-title">` + name + `</h3>` +
                    `<div class="price-status">` +
                        operationStatus +
                        price + 
                    `</div>` +
                    `<p class="info-window-website-label"> Website: <a href="` + result.website + `" target="_blank" rel="noopener noreferrer">` + result.website + `</a>` +
                    `<div class="restaurant-photos">` + 
                        firstPhoto +
                        restOfPhotos +
                    `</div>` +
                    `<div class="restaurant-hours">` + 
                        `<p>Hours: </p>` + 
                        `<div class="hours-days">` +
                            restaurantHours +
                        `</div>` +
                    `</div>` + 
                    `<p class"formatted-address">Address: ` + result.formatted_address + `</p>` +
                `</div>`;
            resultInfo.innerHTML = contentString;
        }
        else {
            console.log('Status: ', status);
        }
    });
}

const togglePanToWords = () => {
    let wordToChange = document.getElementById("panToStatus");
    if (!document.getElementById("toggle-pan-to").checked) {
        wordToChange.textContent = "Off";
    }
    else {
        wordToChange.textContent = "On";
    }
}

const openLinkNewTab = (link) => {
    window.open(link, '_blank').focus();
}

// getResultInfo();
window.initMap = initMap;
window.initAutocomplete = initAutocomplete;
window.getResultInfo = getResultInfo;