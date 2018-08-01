require("dotenv").config();
var command = process.argv[2];

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var movieArr = process.argv.slice(3);
var fullName = movieArr.join(' ');

function searchSpotify(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        var song = data.tracks.items[0];
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(song.artists[0].name);
        console.log(song.name);
        console.log(song.external_urls.spotify);
        console.log(song.album.name);
    });
}

function searchMovie(movie) {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        var information = JSON.parse(body);
        if (!error && response.statusCode === 200) {
            console.log("The title of the movie is " + information.Title + " and was released on " + information.Released + ".");
            console.log("IMDB gave it a " + information.imdbRating + " out of 10. While Rotten Tomatoes gave it " + information.Ratings[1].Value + ".");
            console.log("It was filmed in " + information.Country + " with " + information.Language + " being its main language.");
            console.log(information.Actors + " starred in " + information.Title + ".");
            console.log("The plot of the movies is as follows: " + information.Plot);
        }
    });
}

if (command == "my-tweets") {
    // client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=thegraphicjar&count=20", params, callback);
    client.get('favorites/list', function(error, tweets, response) {
        if (error) throw error;
        console.log(tweets); // The favorites.
        console.log(response); // Raw response object.
    });
} else if (command == "spotify-this-song") {
    var songInput = process.argv.slice(3);
    var userSong = songInput.join(' ');
    if (typeof process.argv[3] == "string") {
        searchSpotify(userSong);
    } else {
        var defaultSong = "The Sign";
        searchSpotify(defaultSong);
    }
} else if (command == "movie-this") {
    if (typeof process.argv[3] == "string") {
        searchMovie(fullName);
    } else {
    	var defaultMovie = "Mr. Nobody";
    	searchMovie(defaultMovie);
    }
} else if (command == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(err, data) {
        var dataArr = data.split(",");
        if (err) {
            return console.log(err);
        }
        // if (dataArr[0] == "my-tweets") {
        	
        // }
        if (dataArr[0] == "spotify-this-song") {
            searchSpotify(dataArr[1]);
        } else if (dataArr[0] == "movie-this") {
            searchMovie(dataArr[1]);
        }
    })
}