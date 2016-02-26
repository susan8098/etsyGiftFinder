//************************************************************************
//								DOCUMENT READY
//************************************************************************
$(function() {
	etsyApp.init();
});	

//************************************************************************
//							ETSY OBJECT		
//************************************************************************
var etsyApp = {};

etsyApp.apiKey = 'ao3boag2j9soanucuqyhk53i';
etsyApp.url = 'https://openapi.etsy.com/v2';

etsyApp.userName = null;
etsyApp.userLocation = null;

// We have 4 categories of Etsy Products: Tech, Apprel, Home, Leisure/Craft
etsyApp.categories = {
	tech: {
		keywords: ["Audio","Cameras","Gadgets","Decals and Skins","Cumputers & Peripherals","Video Games"]
	},
	home: {
		keywords: ["Painting", "Photography", "Sculpture", "candles", "Bathroom", "Bedding", "Furniture", "Home Appliances", "Home Decor", "Lighting", "Outdoor & Gardening"]
	},
	fashion: {
		keywords: ["mittens", "scarves", "caps", "sunglasses", "eyewear", "backpacks","messenger bags", "wallets", "hair care", "spa & relaxation"]
	},
	leisure: {
		keywords: ["drawing", "prints", "Drawings", "spa", "skin care", "collectibles", "movies", "books"]
	}
}



etsyApp.getUserName = function() {
	$('.form-start').on('submit', function(e){
		e.preventDefault();
		console.log('form is firing');
		// get the name of the recipient
		etsyApp.userName = $('#name').val();
		console.log(etsyApp.userName);

		$('span.reciName').text(etsyApp.userName);

		etsyApp.userLocation = $('#location').val();
		console.log(etsyApp.userLocation);
	})
};



etsyApp.location = "Toronto";

//results from the quiz pushed into  this object array
etsyApp.playerSearchObject = [];

etsyApp.results = [];

etsyApp.getEtsyItems = function() {
		$.each(etsyApp.playerSearchObject, function(i, keyword) { 
			$.ajax({
				url: 'http://proxy.hackeryou.com',
				method: "GET",
				dataType: "json",
				data: {
					reqUrl:  etsyApp.url + "/listings/active",
					params: {
						format: "json",
						api_key: etsyApp.apiKey,
						location: etsyApp.userLocation,
						limit: 50,
						tags: keyword
					}
				}
			}).then(function(response) {
				var items = response.results;
				console.log(response);
				etsyApp.results.push(items);
			});
		});
}

//on form submit
etsyApp.displayItems = function() {
	$('.form-submit-answers').on('submit', function(e) {
		//grab three items from each array random
		e.preventDefault();
		etsyApp.getEtsyItems();
		var randomNumberArray = [Math.floor(Math.random() * etsyApp.playerSearchObject.length),
								Math.floor(Math.random() * etsyApp.playerSearchObject.length),
								Math.floor(Math.random() * etsyApp.playerSearchObject.length)];
		console.log(randomNumberArray);
		//for each array in etsyApp.results
		$.each(randomNumberArray, function(i, number) {
			//create a random number
			var randomNumber = Math.floor(Math.random() * etsyApp.results[number].length);
			//choose an item using that random number
			var chosenItem = etsyApp.results[number][randomNumber];
			console.log(chosenItem);
			//get the image for the chosen item
			var chosenItemImage = $.ajax({
				url:  'http://proxy.hackeryou.com',
				method: "GET",
				dataType: "json",
				data: {
					reqUrl: etsyApp.url + "/listings/" + chosenItem.listing_id + "/images",
					params: {
						format: "json",
						api_key: etsyApp.apiKey,
					}
				}
			}).then(function(response){ 
				// console.log(response.results);
				var title = chosenItem.title;
				var image = response.results[0].url_fullxfull;
				var price = chosenItem.price;
				var shopUrl = chosenItem.url;
			//run the template
			}); //end of ajax call
			//delete the item from the array
			etsyApp.results[number].splice(randomNumber, 1);
		}); //end of each

	}); //end of on submit
}


// when we click on radio option, grab the value
// use that value to get a random keyword from the etsyApp cateogry object
// push the keyword into player search object

$('input[type=radio]').on('click', function() {
	var selectedCategory = $(this).val();

	var selectedKeywords = etsyApp.categories[selectedCategory].keywords;

	var randomKeyword = selectedKeywords[Math.floor(Math.random()* selectedKeywords.length)];

	etsyApp.playerSearchObject.push(randomKeyword);
	
});

etsyApp.init = function() {
	etsyApp.getUserName();
	etsyApp.displayItems();

}




// On click, apply the class selected, grab the data of the class selected

// Use selected data to roll a result on the corresponding array

// push results into an selected choice array
// if there is a repeated keyword, filter out the duplicate 

// On submit location form, grab location data 

// request ajax results from the selected choice array
// pass in location data 

// display results

