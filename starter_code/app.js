const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout')

var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '5b5d1268988d4cc6a7df38ff162b2692',
    clientSecret = '12a952c5d9e64edc932b60dba6b790e7';
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }).catch((err) => {
    console.log('Something went wrong when retrieving an access token', err)
  });

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artists', (req, res) => {
  let artist = req.query.artist
  spotifyApi.searchArtists(artist)
    .then((data) => {
      // console.log('Search artists by', data.body.artists.items[0])
      let artists = data.body.artists.items
      res.render('artists', {
        artists: artists
      });
    }).catch((err) => {
      console.log(err)
    })
})

app.get('/albums/:artistId', (req, res) => {
  let artist = req.params.artistId

  spotifyApi.getArtistAlbums(artist)
    .then((data) => {
      // console.log(data.body.items[0])
      res.render('artist-albums', {
        albums: data.body.items
      })
    }).catch((err) => {
      console.log(err)
    })
})

app.get('/album/tracks/:albumId', (req, res) => {
  let album = req.params.albumId

  spotifyApi.getAlbumTracks(album)
    .then((data) => {
      console.log(data.body)
      res.render('album-tracks', {
        tracks: data.body.items
      })
    }).catch((err) => {
      console.log(err)
    })
})

app.listen(3000, () => {
  console.log('Spotify server listening')
})
