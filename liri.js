require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


var input = process.argv;
var action = input[2];
var details = input[3];

console.log(details)

switch (action) {
	case "concert-this":
	bands(details);
	break;

	case "spotify-this-song":
	spotify(details);
	break;

	case "movie-this":
	movie(details);
	break;

	case "do-what-it-says":
	doit();
	break;
};

function spotify(details) {
    var spotify = new Spotify(keys.spotify);

		if (!details){
        	details = 'Rap God';
    	}
		spotify.search({ type: 'track', query: details }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
    });
}

function movie(details) {

	var queryUrl = "http://www.omdbapi.com/?t=" + details + "&y=&plot=short&apikey=2462eb04";

	request(queryUrl, function(error, response, body) {
		if (!details){
        	details = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

            // console.log(JSON.parse(body))

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function doit() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
        } else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
  	});

};
