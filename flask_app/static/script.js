
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

    console.log("user location: ", userLat, " ", userLng);

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
        radius: 1000,
        type: "restaurant",
    };

    const callback = (results, status) => {
        console.log(results);

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
                                `<p class="info-window-website-label"> Website: <a href="` + result.website + `" target="_blank" rel="noopener noreferrer">` + result.website + `</a>` + `</p>` +
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

            let prevMarker = null;
            let prevMarkerIcon = "";
            let prevMarkerOpacity = 0;
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

                        if (prevMarker) {
                            prevMarker.setLabel({
                                ...prevMarker.label,
                                text: prevMarkerIcon,
                            })
                            prevMarker.setOpacity(prevMarkerOpacity)
                        }
                        prevMarker = marker;
                        prevMarkerIcon = marker.label.text;
                        prevMarkerOpacity = marker.opacity;
                        marker.setLabel({
                            ...marker.label,
                            text: "\ue8b6",
                        });
                        marker.setOpacity(1.0);
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
                    placeInput.value = [place.name,";;",place.geometry.location.lat(),";;",place.geometry.location.lng()];

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

                    /**
                     * fix the input containers to no longer show window information
                     * keep it so that the image changes on the marker
                     * change to magnifine glass
                     * make the glass persist until the next glass should appear
                     * window only appears by interacting with markers
                     */

                    /**
                     * try mouseover
                     * look for way to group the eventlistener to a div and its child elements so that
                     * the event doesnt keep happening over and over again
                     * check by using a console log statement
                     * use a var prevMarker similar to prevWindow
                     * user only an event listener for mouseover and remove mouse out
                     * move mouseout icon resetting logic to mouseover
                     * might have to find the restaurantIcon again
                     * close prev window on mouseover
                     */
                    inputContainer.onmouseover = (e) => {
                        if ((e.target !== e.currentTarget) || (prevMarker && prevMarker == marker)) {
                            return
                        }
                        console.log("hit mouseover");
                        if (prevWindow) {
                            prevWindow.close();
                        }
                        if (prevMarker) {
                            prevMarker.setLabel({
                                ...prevMarker.label,
                                text: prevMarkerIcon,
                            })
                            prevMarker.setOpacity(prevMarkerOpacity)
                        }
                        prevMarker = marker;
                        prevMarkerIcon = marker.label.text;
                        prevMarkerOpacity = marker.opacity;
                        marker.setLabel({
                            ...marker.label,
                            text: "\ue8b6",
                        });
                        marker.setOpacity(1.0);
                        if (document.getElementById("toggle-pan-to").checked) {
                            map.panTo(place.geometry.location);
                        }
                    };

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
                        prevMarkerIcon = marker.label.text;
                        prevMarkerOpacity = marker.opacity;
                    });
                }
            }
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
    let lat;
    let lng;
    if (document.getElementById("name") && 
        (document.forms["add_favorite_form"] || document.forms["manual-restaurant-add-form"])) {
        restaurantName = document.querySelector("#name");
        lat = document.querySelector("#lat");
        lng = document.querySelector("#lng");
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
            lat.value = place.geometry.location.lat();
            lng.value = place.geometry.location.lng();
        }
        if (place.place_id) {
            placeId.value = place.place_id;
            console.log("place id hit: ", place.place_id)
        }
        streetAddress.value = autoStreetAddress;
        city.value = autoCity;
        state.value = autoState;
        zipCode.value = autoZipCode;
    }
    autocomplete.addListener("place_changed", fillInAddress);
};

const initFavoritesMap = () => {
    // connect autocomplete
    initAutocomplete();
    
    // develop map
    // bounds will be used to set zoom on map markers dynamically
    let bounds = new google.maps.LatLngBounds();

    const mapStyling = [
        {
            featureType: "poi.business.food_and_drink",
            stylers: [
                {visibility: "off"}
            ],
        }
    ]
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        styles: mapStyling,
    });

    
    // markers for user's locations (home, work, etc.)
    let lat, lng, name, location;
    let locationCoords = {};
    const locationsLabel = {
        fontFamily: "Material Icons",
        color: "#b41412",
        fontSize: "20px",
        text: "\ue838",
    }
    
    const locations = document.getElementById("location_id").children;
    let processedLocations = new Map();

    for (let i = 1; i < locations.length; i++) {
        lat = parseFloat(locations[i].getAttribute("lat"));
        lng = parseFloat(locations[i].getAttribute("lng"));
        locationCoords = {lat: lat, lng: lng};
        name = locations[i].textContent;
        location = parseInt(locations[i].value);

        let marker = new google.maps.Marker({
            position: locationCoords,
            map: map,
            label: locationsLabel,
        })
        bounds.extend(locationCoords);

        let info = new google.maps.InfoWindow({content: name});
        marker.addListener("mouseover", () => {
            info.open(map, marker);
        })
        marker.addListener("mouseout", () => {
            info.close(map, marker);
        })

        processedLocations.set(location, locationCoords);
    }
    map.fitBounds(bounds);

    console.log("processed locations: ", processedLocations);

    // markers for all the favorites
    let favorites = document.getElementsByClassName("favorites");
    let markers = new Map();
    let favLat;
    let favLng;
    let favName;
    let favLocId;
    let coords;
    let lastId;

    const favoritesLabel = {
        fontFamily: "Material Icons",
        color: "#b41412",
        fontSize: "20px",
        text: "\ue87d",
    }

    // creates new markers for all favorites, keeps display hidden, and stores them in a map
    // they will be displayed once their location is selected
    // as you iterate through favorites, set appropriate bounds
    let favsBounds = new google.maps.LatLngBounds()

    for (let i = 0; i < favorites.length; i++) {
        favLat = parseFloat(favorites[i].getAttribute("lat"));
        favLng = parseFloat(favorites[i].getAttribute("lng"));
        favLocId = parseInt(favorites[i].getAttribute("location_id"));
        // initialize new bounds when the location id changes
        // this should take advantage of the fact that favs lists all favs for
        // 1 location then all the favs for the next
        if ((i != 0) && (favLocId == lastId)) {
            favsBounds = new google.maps.LatLngBounds();
        }
        favName = favorites[i].textContent;
        coords = {lat: favLat, lng: favLng};

        // map set to null to hide markers
        // map will be set when location is chosen
        let newMarker = new google.maps.Marker({
            position: coords,
            map: null,
            label: favoritesLabel,
        })
        if (markers.get(favLocId)) {
            markers.get(favLocId).push(newMarker);
            markers.get(favLocId)[0].extend(coords);
        }
        else {
            favsBounds.extend(processedLocations.get(favLocId));
            markers.set(favLocId, [favsBounds, newMarker]);
        }

        // make info windows that display favorites names
        let info = new google.maps.InfoWindow({content: favName});
        newMarker.addListener("mouseover", () => {
            info.open(map, newMarker);
        })
        newMarker.addListener("mouseout", () => {
            info.close(map, newMarker);
        })

        // setting lastId so that we can tell when the next location's favorites begin
        lastId = favLocId;
    }
    console.log("favorites' markers: ", markers);

    const showMarkers = (markers) => {
        for (let i = 1; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    const hideMarkers = (markers, id) => {
        for (let [key, value] of markers) {
            if (key != id) {
                for (let i = 1; i < value.length; i++) {
                    value[i].setMap(null);
                }
            }
        }
    }

    // set map markers function will show the appropriate markers based
    // on the selected location
    const setMapMarkers = (locationId) => {
        map.fitBounds(markers.get(locationId)[0]);
        showMarkers(markers.get(locationId));
        hideMarkers(markers, locationId);
    }
    
    // set map markers if there is a previous location id
    let locationId = document.getElementById("location_id");
    if (parseInt(locationId.value) > -1) {
        setMapMarkers(parseInt(locationId.value));
    }

    // event listener for the locations list input
    // onchange... run function that recenters the map and displays
    // all the favorites for a location

    locationId.addEventListener('change', () => {
        setMapMarkers(parseInt(locationId.value))
    })
}

const initLocationsMap = () => {
    // connect autocomplete
    initAutocomplete();

    // develop map
    // bounds will be used to set zoom on map markers dynamically
    let bounds = new google.maps.LatLngBounds();

    const mapStyling = [
        {
            featureType: "poi.business.food_and_drink",
            stylers: [
                {visibility: "off"}
            ],
        }
    ]
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        styles: mapStyling,
    });

    
    // markers for user's locations (home, work, etc.)
    let lat, lng, name, location;
    let locationCoords = {};
    const locationsLabel = {
        fontFamily: "Material Icons",
        color: "#b41412",
        fontSize: "20px",
        text: "\ue838",
    }
    
    const locations = document.getElementById("locations").children;
    let processedLocations = new Map();

    for (let i = 0; i < locations.length; i++) {
        lat = parseFloat(locations[i].getAttribute("lat"));
        lng = parseFloat(locations[i].getAttribute("lng"));
        locationCoords = {lat: lat, lng: lng};
        name = locations[i].textContent;
        location = parseInt(locations[i].value);

        let marker = new google.maps.Marker({
            position: locationCoords,
            map: map,
            label: locationsLabel,
        })
        bounds.extend(locationCoords);

        let info = new google.maps.InfoWindow({content: name});
        marker.addListener("mouseover", () => {
            info.open(map, marker);
        })
        marker.addListener("mouseout", () => {
            info.close(map, marker);
        })

        processedLocations.set(location, locationCoords);
    }
    map.fitBounds(bounds);

    console.log("processed locations: ", processedLocations);
}

const initResultsRouteMap = (destinationLat, destinationLng) => {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const calculateAndDisplayResultRoute = () => {
        directionsService
            .route({
                origin: {
                    lat: parseFloat(document.getElementById("user_loc").getAttribute("lat")),
                    lng: parseFloat(document.getElementById("user_loc").getAttribute("lng")),
                },
                destination: {lat: destinationLat, lng: destinationLng},
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
            })
            .catch((e) => {
                console.error("Error: ", e);
            })
    }

    // CHANGE ZOOM AND CENTER BASED ON USERS LOCATION AND THE RESULT
    const map = new google.maps.Map(document.getElementById("map"));

    directionsRenderer.setMap(map);
    calculateAndDisplayResultRoute(directionsService, directionsRenderer);
}


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

// for now it works but...THIS CODE IS SO UGLY!!!
// NOT DRY AT ALL
// FIGURE OUT HOW TO USE PROMISES AND ASYNC/AWAIT PROPERLY SO YOU DON'T HAVE REPETITIVE CODE
const geocode = () => {
    // check if form submission came from add_favorite_form & has place id already
    // if there is already a place id then submit form
    if (document.forms["add_favorite_form"] && document.getElementById("place_id").value != ""){
        console.log("hit: add fav form with place id");
        document.forms["add_favorite_form"].submit();
    }
    // run geocode if not from add_favorite_form & no place id
    else {
        console.log("hitting else statement where there is no placeId");
        // identify the form type (change to switch statement)
        let formType;
        // from manual_entry_form
        if (document.forms["manual_entry_form"]){
            formType = "manual_entry_form"; 
        }
        if (document.forms["manual-restaurant-add-form"]){
            formType = "manual-restaurant-add-form"; 
        }
        // from add_location_form
        if (document.forms["add_location_form"]){
            formType = "add_location_form"; 
        }
        // from add_favorite_form
        if (document.forms["add_favorite_form"]) {
            formType = "add_favorite_form"; 
        }

        // save form in var so it is accessible in callback for submission
        var form = document.forms[formType];
        
        // get address from input
        let streetAddress = document.getElementById("street_address").value;
        let city = document.getElementById("city").value
        let state = document.getElementById("state").value
        let zipCode = document.getElementById("zip_code").value
        let address = [streetAddress, city, state, zipCode].join(" ");
        const geocoder = new google.maps.Geocoder();
        
        
        if (formType =="add_favorite_form" || formType == "manual-restaurant-add-form") {
            // get name from input
            let name = document.getElementById("name");

            // get hidden place id
            // goal of this if statement is to get the correct place id, lat, and lng into the request form
            let placeId = document.getElementById("place_id");
            let hiddenLat = document.getElementById("lat");
            let hiddenLng = document.getElementById("lng");
            
            
            // set an HTML connection for PlacesService to connect to
            const connect = document.getElementById("connectToNearby");
            
            // instantiate the google PlacesService that are going to be used
            const service = new google.maps.places.PlacesService(connect);

            console.log("hitting before geocoder runs");

            let geo = async () =>  {
                try {
                    console.log("hit try of geo before geocoder runs");
                    
                    // run geocoder to get the lat and lng of user's input location
                    let res = await geocoder.geocode({'address': address});
    
                    console.log("hit after geocoder runs");
                    console.log("result from async geo: ", res.results[0]);
                    // AWAIT DISCONNECTS THE FORM
                    
                    // isolate lat and lng from geocode result
                    lat = res.results[0].geometry.location.lat();
                    lng = res.results[0].geometry.location.lng();
    
                    // pass lat and lng into nearby function
                    nearby(lat, lng);
                }
                catch(error) {
                    console.log("hit the catch of geo");
                    console.error("geo error: ", error);
                    document.body.appendChild(form);
                    form.submit();
                }
            }
    
            let nearby = async (lat, lng) => {
                try {
                    console.log("hit try of nearby before nearbySearch runs");
    
                    // run nearbySearch to get the restaurant of the user's manual entry
                    await service.nearbySearch({
                        location: {lat: lat, lng: lng},
                        keyword: [address],
                        type: ["restaurant"],
                        radius: 100,
                    }, (results, status) => {
                        if (status == 'OK') {
                            console.log("result from callback: ", results);
                            
                            // set hidden place_id, lat, and lng using results of nearbySearch
                            placeId.value = results[0].place_id;
                            hiddenLat.value = results[0].geometry.location.lat();
                            hiddenLng.value = results[0].geometry.location.lng();
                            console.log(placeId.value)
                            console.log(hiddenLat.value)
                            console.log(hiddenLng.value)
                            
                            // get the name of the location from results
                            let resultName = results[0].name;
                            
                            // compare names
                            if (name != resultName) {
                                // if not equal alert the difference and what it is now saved as
                                alert(`According to Google's database, the name of the location corresponding to the address you entered is ${resultName}, not ${name.value}. Hangry will record your entry as ${resultName}.`);
                                name.value = resultName; 
                            }
                        }
                        else {
                            console.log("Status: ", status);
                        }

                        // this must go here
                        console.log("hit in nearbySearch callback");
    
                        // reconnect form that loses connection due to promises and await
                        // then submit form
                        document.body.appendChild(form);
                        form.submit();
                    });
                }
                catch(error) {
                    console.log("hit the catch of nearby");
                    console.error("nearby error: ", error);
                    document.body.appendChild(form);
                    form.submit();
                }
            }

            geo();
        }

        // if it's not add_favorite_form, get lat & lng
        else {
            geocoder.geocode({address: address}, (results, status) => {
                if (status == "OK") {
                    console.log("results[0]", results[0].geometry.location.lat);
                    const res = results[0].geometry.location;
                    let hiddenLat = document.getElementById("lat")
                    let hiddenLng = document.getElementById("lng")
                    hiddenLat.value = res.lat();
                    hiddenLng.value = res.lng();
                }
                else {
                    console.log("Status: ", status);
                }
                form.submit();
            })
        }
    }
};

const resetPlaceId = () => {
    let placeId = document.getElementById("place_id");
    if (placeId.value != "") {
        placeId.value = "";
    }
}

const getResultInfo = () => {
    let resultInfo = document.getElementById("result-info");
    const service = new google.maps.places.PlacesService(resultInfo);
    const placeId = document.getElementById('result_id').value;
    
    service.getDetails({
        placeId: placeId,
        fields: ['formatted_address', 'geometry.location', 'opening_hours', 'photos', 'price_level', 'url', 'utc_offset_minutes','website'],
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
            
            initResultsRouteMap(result.geometry.location.lat(), result.geometry.location.lng());

            // price set from nearby search results
            for (let i = 0; i < result.price_level; i++) {
                priceFill += '$';
            }
            for (let j = 0; j < 4 - priceFill.length; j++) {
                priceShadow += '$';
            }
            price =
                `<p class="res-restaurant-price">` + 
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
                firstPhoto = `<img class="res-first-photo" src="` + result.photos[0].getUrl() + `" alt="` + result.name + `photo 1" onclick="openLinkNewTab('` + result.photos[0].getUrl() + `')">`;
                restOfPhotos = `<div class="res-rest-of-photos">`;
                // restOfPhotos += `<div class="res-rest-of-photos-top">`;
                for (let i = 1; i < 4; i++){
                    if (result.photos[i]){
                        if (i < 3) {
                            restOfPhotos += `<img src="`+ result.photos[i].getUrl() + `" alt="` + result.name + `photo` + (i + 1) + `" onclick="openLinkNewTab('` + result.photos[i].getUrl() + `')">`;
                        }
                        else {
                            // restOfPhotos += `</div>`;
                            // restOfPhotos += `<div class="res-rest-of-photos-bottom">`;
                            restOfPhotos += `<img src="`+ result.photos[i].getUrl() + `" alt="` + result.name + `photo` + (i + 1) + `" onclick="openLinkNewTab('` + result.photos[i].getUrl() + `')">`;
                        }
                    }
                }
                linkToGooglePage = 
                    `<span class="res-link-to-google-page">` + 
                        `<a href="` + result.url + `" target="_blank" rel="noopener noreferrer">Click For More +</a>` +
                    `</span>`;
                // restOfPhotos += linkToGooglePage + `</div>` + `</div>`;
                restOfPhotos += linkToGooglePage + `</div>`;
            }

            // translating content into html for infoWindow
            const contentString = 
                `<div class="info-window-content res-content">` + 
                operationStatus +
                    `<div class="res-info">` +
                        `<div class="res-price-website-address">` +
                            price + 
                            `<div class="res-info-website-container">` +
                                `<p class="res-info-label">Website: ` + `</p>` + 
                                `<a class="res-info-website" href="` + result.website + `" target="_blank" rel="noopener noreferrer">` + result.website + `</a>` +
                            `</div>` +
                            `<div class="res-info-address-container">` +
                                `<p class="res-info-label">Address: ` + `</p>` + 
                                `<p class="res-formatted-address">` + result.formatted_address + `</p>` +
                            `</div>` +
                        `</div>` +
                    `</div>` + 
                    `<div class="res-restaurant-photos">` + 
                        firstPhoto +
                        restOfPhotos +
                    `</div>` +
                    `<div class="res-restaurant-hours">` + 
                        `<p>Hours: </p>` + 
                        `<div class="hours-days">` +
                            restaurantHours +
                        `</div>` +
                    `</div>` + 
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

const copyEmail = () => {
    console.log("hit email copy");
    navigator.clipboard.writeText("tomrocha99@gmail.com");
    const display = document.getElementById("email_copied");
    display.classList.remove("email_uncopied");
    display.classList.add("email_copied");
    setTimeout(function() {
        $('#email_copied').fadeOut('slow');
    }, 1000); // <-- time in milliseconds
}

const scrollToQuery = (query) => {
    const pageMarker = document.getElementById(query);
    pageMarker.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
    });
}

// getResultInfo();
window.initMap = initMap;
window.initFavoritesMap = initFavoritesMap;
window.initLocationsMap = initLocationsMap;
window.initAutocomplete = initAutocomplete;
window.getResultInfo = getResultInfo;
window.initResultsRouteMap = initResultsRouteMap;