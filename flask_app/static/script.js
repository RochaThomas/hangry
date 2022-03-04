
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
