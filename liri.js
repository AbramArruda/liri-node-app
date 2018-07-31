
// Requiring files and npm packages
require("dotenv").config();
var request = require("request");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

// Initializing variables
var input = process.argv;
var userInput = input[2];
var songName = "";
var movieName = "";


//User Input Options
if (userInput === "my-tweets") {
	getTweets();
}

else if (userInput === "movie-this") {
	getMovie();
}

else if (userInput === "spotify-this-song") {
	getSong(songName);
}

else if (userInput === "do-what-it-says") {
	doWhatItSays();
}

else {
	console.log("Not Getting Input, Please enter movie-this");
}





//Function that grabs the movie data
function getMovie() {
    
    for (var i = 3; i < input.length; i++) {
        if (i > 2 && i < input.length) {
	    movieName = movieName + " " + input[i];
	  }
	}
	 if (!movieName) {
	 	movieName = "Mr Nobody";
    }
    
	request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function(error, response, body) {
      
        if (!error && response.statusCode === 200) {
			var movieInfo = JSON.parse(body);
			var movieResponse = 
				"|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||" + "\r\n" +
				"Title: " + movieInfo.Title + "\r\n" +
				"Year movie was released: " + movieInfo.Year + "\r\n" +
				"IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +
				"Filmed in: " + movieInfo.Country + "\r\n" +
				"Language: " + movieInfo.Language + "\r\n" + 
				"Movie plot: " + movieInfo.Plot + "\r\n" +
				"Actors: " + movieInfo.Actors + "\r\n" +
				"|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
			console.log(movieResponse);
			
		}
	});
 }




// Function that grabs the song data
function getSong(songName) {

	for (var i=3; i < input.length; i++){
		songName = songName + " " + input[i];
	}

	var spotify = new Spotify({
  		id: process.env.SPOTIFY_ID,
  		secret: process.env.SPOTIFY_SECRET
	});

	
	if (!songName) {
		songName = "The Sign";
	}

	
	spotify.search({ type: 'track', query: songName, limit: 10 }, function(err, data) {

  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
 
	if (songName === "The Sign") {
	
		var defaultSong = 
		"Artist: " + data.tracks.items[5].artists[0].name + "\r\n" + 
		"Song title: " + data.tracks.items[5].name + "\r\n" +
		"Preview song: " + data.tracks.items[5].preview_url + "\r\n" +
    	"Album: " + data.tracks.items[5].album.name + "\r\n" 

		
		console.log (defaultSong);
    }
    
	else {
		console.log("Top 10 songs named, " + songName);
		for (var i = 0; i < data.tracks.items.length; i++) {

			var trackInfo = data.tracks.items[i];
            var previewSong = trackInfo.preview_url;
            
			if (previewSong === null) {
				previewSong = "Preview is not available for this song.";
            }
            
			var songResponse = 
				"|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||" + "\r\n" +
				"Song #" + (i+1) + "\r\n" +
				"Artist: " + trackInfo.artists[0].name + "\r\n" +
				"Song title: " + trackInfo.name + "\r\n" +
				"Preview song: " + previewSong + "\r\n" +
				"Album: " + trackInfo.album.name + "\r\n" +
				"|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||";
			console.log(songResponse);
			
		}
	}
	});
}








// Function that grabs the last 20 tweets
 function getTweets(){

	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	var parameters = {screen_name: 'AbramArruda', limit: 20};
	client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
	  if (!error) {
	    
	    console.log("My last 20 tweets");
	    for (var i=0; i < tweets.length; i ++) {
	    	
	    	var myTweetResponse = 
	    		"||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||" + "\r\n" +
	    		"Tweet #" + (i+1) + "\r\n" +
	    		"Tweet: " + tweets[i].text + "\r\n" +
	    		"Created at: " + tweets[i].created_at 
	    		"||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||" 

	    	console.log(myTweetResponse);
	    }
	  }
	});
}






//Function for do-what-it-says Input
function doWhatItSays() {
	
	fs.readFile("random.txt", "utf8", function(error, data) {
  		if (error) {
    		return console.log(error);
          }
          
  		var songdataArray = data.split(",");

  		getSong(songdataArray[1]);
 	});
}




