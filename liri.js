require("dotenv").config();
var command = process.argv[2];

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv.slice(3);
var inputString = userInput.join(' ');

// functions
function searchTweets() {
    client.get('statuses/user_timeline', { screen_name: 'thegraphicjar', count: 20 }, function(error, tweets, response) {
        console.log("Accessing twitter account: " + tweets[0].user.screen_name);

        function pastTweets() {
            for (i = 0; i < tweets.length; i++) {
                console.log("\nOn " + tweets[i].created_at.slice(0, 10) + tweets[i].created_at.slice(25) + " user posted:");
                console.log(tweets[i].text);
            }
        }
        setTimeout(pastTweets, 1500);
    });
}

function searchSpotify(userSong, a) {
    spotify.search({ type: 'track', query: userSong, limit: 10 }, function(err, data) {
            var song = data.tracks.items[a];
            // console.log(song);
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist: " + song.artists[0].name);
            console.log("Song name: " + song.name);
            console.log("Song link: " + song.external_urls.spotify);
            console.log("Album name: " + song.album.name);
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
        } else {
        	console.log("Error! Make sure you spelled the movie correctly.")
        }
    });
}

// command lines
if (command == "my-tweets") {
    searchTweets();
} else if (command == "spotify-this-song") {
    if (typeof process.argv[3] == "string") {
        searchSpotify(inputString, 0);
    } else {
        var defaultSong = "The Sign";
        searchSpotify(defaultSong, 5);
    }
} else if (command == "movie-this") {
    if (typeof process.argv[3] == "string") {
        searchMovie(inputString);
    } else {
        var defaultMovie = "Mr. Nobody";
        searchMovie(defaultMovie);
    }
} else if (command == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(err, data) {
        var dataArr = data.split(",");
        var randomCom = dataArr[0];
        var randomInput = dataArr[1];
        if (err) {
            return console.log(err);
        }
        if (randomCom == "my-tweets") {
        	searchTweets();
        } else if (randomCom == "spotify-this-song") {
            searchSpotify(randomInput);
        } else if (randomCom == "movie-this") {
            searchMovie(randomInput);
            console.log("This is my favorite movie.");
        }
    })
}

// bonus
fs.appendFile('log.txt', command + " " + inputString + "\n", function(err) {
    if (err) {
        console.log(err);
    }
});