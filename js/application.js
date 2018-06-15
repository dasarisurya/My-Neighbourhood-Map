

var map, clientID, clientSecret;
// Global variables

// Function is taken 
function showModelApp() {
	var self = this;

	this.searchOption = ko.observable("");
	this.markers = [];

	/* This function populates the infowindow when the marker is clicked. We'll only allow
	   one infowindow which will open at the marker that is clicked, and populate based
	   on that markers position.*/
	   
	this.populateInfoWindow = function (marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.setContent('');
			infowindow.marker = marker;
			// foursquare api client
			// foursquare api secret
			clientID = "QLFU2SIAQFAHSFZ045UELDABAAWZMJUUZ4UGGAWTKWILVATJ";
			clientSecret =
				"MGKLGARK320W1AW1TVW0KW5KKFGIABPXXI1JA3WXZCSL1NG3";
			// url for the foursquare api
			var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
				marker.lat + ',' + marker.lng + '&client_id=' + clientID +
				'&client_secret=' + clientSecret + '&query=' + marker.title +
				'&v=20180125' + '&m=foursquare';
			// foursquare api
			$.getJSON(apiUrl).done(function (marker) {
				var response = marker.response.venues[0];
				self.street = response.location.formattedAddress[0];
				self.city = response.location.formattedAddress[1];
				self.category = response.categories[0].shortName;
                                
                                // marker content by foursquare
				self.contentOfHtmFoursquare =
					'<h4 class="iw_subtitle">(' + self.category +
					')</h4>' + '<div>' +
					'<h5 class="iw_address_title"> Details/Address: </h5>' +
					'<div class="iw_address">' + self.street + '</div>' +
					'<div class="iw_address">' + self.city + '</div>' +
					'</div>' + '</div>' + '</div>';

				infowindow.setContent(self.contentOfHtm + self.contentOfHtmFoursquare);
			}).fail(function () {
				// Send alert
				alert(
					"Failed to load the FS api refresh and try again"
				);
			});

			this.contentOfHtm = '<div>' + '<h4 class="iw_title">' + marker.title +
				'</h4>';

			infowindow.open(map, marker);

			infowindow.addListener('closeclick', function () {
				infowindow.marker = null;
			});
		}
	};
        
        // Marker bounces on click on the map
	this.populateAndBounceMarker = function () {
		self.populateInfoWindow(this, self.largeInfoWindow);
		this.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout((function () {
			this.setAnimation(null);
		}).bind(this), 1400);
	};
        
        // Location is set for the view
	this.initMap = function () {
		var canvasMap = document.getElementById('map');
		var optionsMap = {
			center: new google.maps.LatLng(17.0005383, 81.80403449999994),
			zoom: 14,
			styles: styles
		};
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(canvasMap, optionsMap);

		// Set InfoWindow
		this.largeInfoWindow = new google.maps.InfoWindow();
		for (var i = 0; i < mylocalities.length; i++) {
			this.markerTitle = mylocalities[i].title;
			this.markerLat = mylocalities[i].lat;
			this.markerLng = mylocalities[i].lng;
			// Google Maps marker setup
			this.marker = new google.maps.Marker({
				map: map,
				position: {
					lat: this.markerLat,
					lng: this.markerLng
				},
				title: this.markerTitle,
				lat: this.markerLat,
				lng: this.markerLng,
				id: i,
				animation: google.maps.Animation.DROP
			});
			this.marker.setMap(map);
			this.markers.push(this.marker);
			this.marker.addListener('click', self.populateAndBounceMarker);
		}
	};

	this.initMap();
        
        // Filter using the knockout
	// This block appends our locations to a list using data-bind
	// It also serves to make the filter work
	this.mylocalitiesFilter = ko.computed(function () {
		var result = [];
		for (var i = 0; i < this.markers.length; i++) {
			var markerLocation = this.markers[i];
			if (markerLocation.title.toLowerCase().includes(this.searchOption()
					.toLowerCase())) {
				result.push(markerLocation);
				this.markers[i].setVisible(true);
			} else {
				this.markers[i].setVisible(false);
			}
		}
		return result;
	}, this);
}

googleError = function googleError() {
	alert(
		'Oops. Google Maps did not load. Please refresh the page and try again!'
	);
};

function startApp() {
	ko.applyBindings(new showModelApp());
}

// Styles for the display on the map

var styles = [{
	"featureType": "water",
	"stylers": [{
			"visibility": "on"
		},
		{
			"color": "black"
		}
	]
}];

// My markers
// My Localities on the map are taken below

var mylocalities = [{
		title: 'Iskcon Rajahmundry',
		lat: 16.9903936,
		lng: 81.7754933,
	},
	{
		title: 'Hotel Shelton Rajamahendri',
		lat: 16.9987117,
		lng: 81.78449699999999,
	},
	{
		title: 'Gandhi Park',
		lat: 17.007411,
		lng: 81.78258600000004,
	},
	{
		title: 'Syamala Theatre',
		lat: 17.003533,
		lng: 81.7731819,
	},
	{
		title: 'Arts College',
		lat: 17.0128753,
		lng: 81.7825765,
	},
	{
		title: 'Kambalacheruvu Park',
		lat: 17.0135478,
		lng: 81.7739402,
	},
	{
		title: 'Rajahmundry East Railway Station',
		lat: 16.9850035,
		lng: 81.78529100000003,
	},
	{
		title: 'Eat n Play',
		lat: 17.0117199,
		lng: 81.7818198,
	},
	{
		title: 'WalMarts Best Price',
		lat: 17.0069742,
		lng: 81.8113343,
	},
]


