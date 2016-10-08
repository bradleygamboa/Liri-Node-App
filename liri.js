var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var keys = require('./keys.js')
var fs = require('fs');



var Artist = function(artist) {
    return artist.name;
}

var Spotify = function(songName) {

    if (songName === undefined) {
        songName = 'Ace of Base - The Sign';

    }

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(Artist));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('-----------------------------------');
        }
    });
}

var Twitter = function() {

    var client = new twitter(keys.twitterKeys);

    var params = { screen_name: 'superfinethanks' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log('');
                console.log(tweets[i].text);
            }
        }
    });
}

var Omdb = function(movieName) {

    if (movieName === undefined) {
        movieName = 'Mr Nobody';
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Year: ' + jsonData.Year);
            console.log('Rated: ' + jsonData.Rated);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot);
            console.log('Actors: ' + jsonData.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
            console.log('Rotton Tomatoes URL: ' + jsonData.tomatoURL);
        }
    });

}

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }

    });
}

var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            Twitter();
            break;
        case 'spotify-this-song':
            Spotify(functionData);
            break;
        case 'movie-this':
            Omdb(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('LIRI doesn\'t know that');
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
