'use strict';

//************************************************************************
//								DOCUMENT READY
//************************************************************************
$(function () {
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

//************************************************************************
//							ETSY APP FUNCTIONS
//************************************************************************

// We have 4 categories of Etsy Products: Tech, Apprel, Home, Leisure/Craft
etsyApp.categories = {
	tech: {
		keywords: ["Audio", "Cameras", "Gadgets", "Decals", "VideoGames"]
	},
	home: {
		keywords: ["Painting", "Photography", "Sculpture", "candles", "Bathroom", "Bedding", "Furniture", "Home Appliances", "Home Decor", "Lighting", "Gardening"]
	},
	fashion: {
		keywords: ["mittens", "scarves", "caps", "sunglasses", "eyewear", "backpacks", "messenger bags", "wallets", "hair care", "spa"]
	},
	leisure: {
		keywords: ["drawing", "prints", "Drawings", "spa", "skin care", "collectibles", "movies", "books"]
	}
};

var etsyAppAvatarsSources = {
	avatar1: ["css/images/3catavatar_playerone.jpg", "css/images/8catavatar_playerone.jpg", "css/images/13catavatar_playerone.jpg", "css/images/18catavatar_playerone.jpg"],
	avatar2: ["css/images/3catavatar_playertwo.jpg", "css/images/8catavatar_playertwo.jpg", "css/images/13catavatar_playertwo.jpg", "css/images/18catavatar_playertwo.jpg"]
};

etsyApp.getUserName = function () {
	// get the name of the recipient
	etsyApp.userName = $('#name').val();

	//place the username on the page where appropriate for the questions
	$('span.reciName').text(etsyApp.userName);

	//get the location of the hand-made products to search for
	etsyApp.userLocation = $('#location').val();
};

//results (keywords) from the quiz pushed into  this object array
etsyApp.playerSearchObject = [];

//items from etsy app call
etsyApp.results = [];

etsyApp.getEtsyArrays = function () {
	$.each(etsyApp.playerSearchObject, function (i, keyword) {
		$.ajax({
			url: 'http://proxy.hackeryou.com',
			method: "GET",
			dataType: "json",
			data: {
				reqUrl: etsyApp.url + "/listings/active/",
				params: {
					format: "json",
					api_key: etsyApp.apiKey,
					location: etsyApp.userLocation,
					limit: 100,
					tags: keyword
				}
			}
		}).then(function (response) {

			var items = response.results.filter(filterByFavorers);
			console.log(items);
			etsyApp.createOneItem(items);
			etsyApp.results.push(items);
		});
	});
};

function filterByFavorers(obj) {
	if (obj.num_favorers >= 25) {
		return true;
	} else {
		return false;
	}
}

etsyApp.createOneItem = function (itemArray) {
	var randomNumber = Math.floor(Math.random() * itemArray.length);
	//choose an item using that random number
	var chosenItem = itemArray[randomNumber];
	//get the image for the chosen item
	var chosenItemImage = $.ajax({
		url: 'http://proxy.hackeryou.com',
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: etsyApp.url + "/listings/" + chosenItem.listing_id + "/images",
			params: {
				format: "json",
				api_key: etsyApp.apiKey
			}
		}
	}).then(function (response) {
		console.log(chosenItem);
		etsyApp.displayItems(response, chosenItem);
		itemArray.splice(randomNumber, 1);
	}); //end of ajax call
};

etsyApp.createThreeItems = function () {
	var randomNumberArray = [Math.floor(Math.random() * etsyApp.playerSearchObject.length), Math.floor(Math.random() * etsyApp.playerSearchObject.length), Math.floor(Math.random() * etsyApp.playerSearchObject.length)];

	console.log(randomNumberArray);
	//for each array in etsyApp.results
	$.each(randomNumberArray, function (i, number) {
		//create a random number
		var randomNumber = Math.floor(Math.random() * etsyApp.results[number].length);
		//choose an item using that random number
		var chosenItem = etsyApp.results[number][randomNumber];
		console.log(chosenItem);
		//get the image for the chosen item
		var chosenItemImage = $.ajax({
			url: 'http://proxy.hackeryou.com',
			method: "GET",
			dataType: "json",
			data: {
				reqUrl: etsyApp.url + "/listings/" + chosenItem.listing_id + "/images",
				params: {
					format: "json",
					api_key: etsyApp.apiKey
				}
			}
		}).then(function (response) {
			etsyApp.displayItems(response, chosenItem);
			etsyApp.results[number].splice(randomNumber, 1);
		}); //end of ajax call
	}); //end of each
};

etsyApp.displayItems = function (response, chosenItem) {
	var resultCard = {
		title: chosenItem.title,
		image: response.results[0].url_fullxfull,
		price: chosenItem.price,
		shopUrl: chosenItem.url
	};
	//run the template
	// ***** Handle Bar Template *****
	var resultCardHtml = $('#itemTemplate').html();
	var template = Handlebars.compile(resultCardHtml);

	$('.resultContainer .resultsWrapper').append(template(resultCard));
};
etsyApp.getKeywords = function (button) {
	var selectedCategory = $(button).val();
	var selectedKeywords = etsyApp.categories[selectedCategory].keywords;
	var randomKeyword = selectedKeywords[Math.floor(Math.random() * selectedKeywords.length)];
	etsyApp.playerSearchObject.push(randomKeyword);
};
//************************************************************************
//									INTERACTING WITH THE DOM
//************************************************************************
etsyApp.showQuestion = function () {
	$('.question1').fadeIn("slow");
};

etsyApp.showNextQuestion = function (button) {
	var desiredParent = $(button).parents(".question");
	var desiredParentClass = desiredParent[0].classList[1];
	var newQuestionNumber = ".question" + (parseInt(desiredParentClass[8]) + 1);
	$(newQuestionNumber).fadeIn("slow");
};

function scrollToBottom() {
	window.scrollTo(0, document.body.scrollHeight);
}

//************************************************************************
//									ON EVENT HANDLERS
//************************************************************************

//on form submit
etsyApp.onSubmitAnswers = function () {
	$('.form-submit-answers').on('submit', function (e) {
		console.log("success!");
		//grab three items from each array random
		$(this).parents('.submit').hide();
		$('.resultArea').show();
		e.preventDefault();
		etsyApp.getEtsyArrays();
		setInterval(function () {
			console.log($(".resultsWrapper").children.length);
			if ($('.resultsWrapper')[0].children.length >= 3) {
				$('.animationWrapper').hide("fast");
			}
		}, 1000);
		$('footer').toggle();
	}); //end of on submit
};
etsyApp.onRadioClick = function () {
	$('.options input[type=radio]').on('click', function () {
		$(this).parents('.question').hide();
		etsyApp.getKeywords(this);
		etsyApp.showNextQuestion(this);
	});
};

etsyApp.onFormStart = function () {
	$('.form-start').on('submit', function (e) {
		e.preventDefault();
		$(this).parents('.header').hide();
		etsyApp.getUserName();
		etsyApp.showQuestion();
		$('footer').toggle();
	}); //end of submit
};

etsyApp.showMoreResults = function () {
	$('.showMoreGifts').on('click', function () {
		console.log('firing!');
		etsyApp.createThreeItems();
		scrollToBottom();
	});
};

etsyApp.avatarChoice = function () {
	$('label[class^="avatarOption"]').on('click', function () {
		$(this).addClass('selectedAvatar');
		$(this).siblings().removeClass('selectedAvatar');
		var chosenAvatarValue = $(this).attr("value");
		var avatarContainers = $('div[class^=avatarContainer');
		console.log(avatarContainers);
		console.log(chosenAvatarValue);
		$.each(avatarContainers, function (i, container) {
			$(container).html("<img src='" + etsyAppAvatarsSources[chosenAvatarValue][i] + "'>");
			console.log(this);
			console.log(etsyAppAvatarsSources[chosenAvatarValue][i]);
		});
	});
};

//************************************************************************
//									ETSY APP INIT FUNCTION
//************************************************************************
etsyApp.init = function () {
	etsyApp.onFormStart();
	etsyApp.onRadioClick();
	etsyApp.onSubmitAnswers();
	etsyApp.showMoreResults();
	etsyApp.avatarChoice();
};
//# sourceMappingURL=main.js.map
