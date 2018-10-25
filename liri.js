require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


var input = process.argv;
var action = input[2];
var details = input.splice(3).join(" ");


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


function bands(details) {

	var bandUrl = "https://rest.bandsintown.com/artists/" + details + "/events?app_id=codingbootcamp"

	request(bandUrl, function (error, response, body) {
		if (!details) {
			details = "Drake"
		}
		if (!error && response.statusCode === 200) {


			var concerts = JSON.parse(body)
			console.log(concerts[0].venue)
		}
	});


};

function spotify(details) {
	var spotify = new Spotify(keys.spotify);

	if (!details) {
		details = 'The Sign';
	}
	spotify.search({ type: 'track', query: details }, function (err, data) {
		if (err) {
			console.log(err);
			return;
		}

		var songInfo = data.tracks.items;
		console.log("Artist: " + songInfo[0].artists[0].name);
		console.log("Song Name: " + songInfo[0].name);
		console.log("Preview Link: " + songInfo[0].preview_url);
		console.log("Album: " + songInfo[0].album.name);
	});
}

function movie(details) {

	var movieUrl = "http://www.omdbapi.com/?t=" + details + "&y=&plot=short&apikey=2462eb04";

	request(movieUrl, function (error, response, body) {
		if (!details) {
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
	fs.readFile('random.txt', "utf8", function (error, data) {

		if (error) {
			return console.log(error);
		}

		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} else if (dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		}else if (dataArr[0] === "concert-this") {
			var artist = dataArr[1].slice(1, -1);
			movie(artist);
		}
	});

};
