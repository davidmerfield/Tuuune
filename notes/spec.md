# Music Finder

Find good unknown music.

Works by searching for songs with low number of listens but a very high like-to-view ratio. Or just a high ratio of 'responses,' positive or negative.

never allow the user to discover a song we know they've listened too.

always start showing verfied great songs.
pepper in new untested songs after a few hits

Streaming sources:
soundcloud
youtube
Vimeo API
- if found on youtube or vimeo, check if exists on soundcloud
- soundcloud is ideal because we don't care about the video

Search sources:
Youtube Data API - have to show embed
Soundcloud Api
Last.fm
Spotify - great for finding related artists
REDDIT
 - genre subreddits
 - music subreddit
PITCHFORK FRESH
Various music blogs

Prefer soundcloud over YouTube since their API TOS prohibit hiding their music player.

look into using google's people also search for feature
spotify's related artists

# Target

8tracks users and designers.mx
make sharing music all about helping the artist and the song.
the fact that the song is 'hosted' on our site is a secondary feature.
PEOPLE LOVE SHARING MUSIC THEY FIND
THEY HAVE TO FEEL LIKE THEY FOUND IT
Set expectations for the search tool

# Explore features

- Options for view range
- Options for song/album
- Options for remixes, covers, foreign music
- Options for genre

# Explore implementation

On load quickly returns 10 preached responses?
Should we always return cached responses?
Should we always return whitelisted response?
Perhaps allow regular and semi-trusted users the options to 'Be a pioneer' and actually interact with the raw (basic filtered) responses from the source APIs?
Perhaps allow regular and semi-trusted users to paste in a youtube link which is automatically added to songs on the site
Have a big SKIP (not appropriate for this site) button?

*We're going to need a 'duplicate' detector for finding youtube re-uploads of popular music*

*If we cache songs on our servers we're going to need to periodically update them*

*What about a succeeded section for songs which we indexed but which grew to have more than 100k views.*

# Playlist implementation

- Paste in URL from source websites
- No MP3 uploads, except perhaps for verified artists?
- Underground factor 

# Additional features

Long term goal is to build a community around sharing good unknown music, if the explore tool is good enough.

- Saving music you find which you like.
- Creating playlists from music you find. // Playlists are human

# Design

HIPSTER SUPREME VIBE

# How to get the right songs

## Youtube

First we make a date range. Since there are so many music videos uploaded to youtube, we want to restrict the videos we need to filter. A date range of 1 day seems to work well. 

Then we search youtube with the following options:

order: 'relevance' seems to work the best
*other potentially useful are title (alphabetical) and views (top to bottom) and rating (top to bottom)*
publishedAfter: start of date range
publishedBefore: end of date range
maxResults: 50
regionCode: USA
videoEmbeddable: true
videoCategoryId: 10 // which is music
safeSearch: moderate // experiment with this
type: video

Note there is no query parameter. Not sure how to construct one which works well.

I'm unsure that this is working to retrieve all the music videos which are uploaded. Perhaps sort by date?

Then filter the reponses. If a video passes the filter perhaps call:

relatedToVideoId=video.id since the related videos will also likes be ok.

relatedToVideoId=video.id might be a smart way to work out the artist name.

channelId to get artist name? or perhaps more videos uploaded by uploader. get intersection of two strings to work out what's the artist and what's the song name.

# Filter

Right now the filter is very aggressive.

It doesn't assign weights to content it just removes it. Is this fine? Or should we not just remove bad results but assign them values then return a sorted list of videos?

Right now the songs that most appeal to me are in the format:

SONG - ARTIST

The like count and like to dislikes isn't quite so important since I don't show those to the user. But increasing the requirements for like and dislike seems to return songs with titles which conform to the above format.

right now I'm not looking at the description at all. Perhaps I should. I'm also making a ton of assumptions about the content of the video based on the title. should I implement some slightly more impartial algorithm which I train by just looking at the video? then clicking yes or no?

Have no other cruft alongside. And are a video with just a photo.

By default we don't want live performances, we want studio recordings. Perhaps have a feature to search for live performances as a toggle.


iterate over each of the responses, 
		for each check rating is > 95%
		check view count is < 100k
		if so
			append to results div
			call search on similar video

work out how to search within languages

right now I reject anything with a non english character in it.

# Player

Player should take a service and resource ID (e.g. Youtube and video id). then pass this to player as an embed.

Player code should be structured to add a services in a modular way. 

The service module needs to load a resource, change the state of the resource, broadcast the state of the resource.

make queue from results applying filters specified by user

perhaps try without seed query (random word) but with more specific date range?

player moves down queue

player saves song
   append more to results

player skips song
   DO SOMETHING

## detect if video is a lyric video with just an image:
http://stackoverflow.com/questions/13808268/check-to-see-if-youtube-video-is-static-image

## removing borders from image thumbnails
http://stackoverflow.com/questions/13220715/removing-black-borders-43-on-youtube-thumbnails

move song when finished from top of queue to history

# Note: A playback only counts toward a video's official view count if it is initiated via a native play button in the player.

right now the results contain 75% songs
how do we remove the other 25%?

need to work out how to remove  live shows

Perhaps we can parse a location from the title of the video

we also need to work out the language of the song
perhaps pass the title to translate api?

Perhaps build an 'explorer UI' 
where one song is put in center ('like radio')

# Song Model

   id: // string, formed from source ID and source prefix
   title: // string
   duration: // int, song duratio in milliseconds
   genre: // string or null, song's artwork
   thumbnail: // string or null, song's artwork

   source: // string
   sourceID: // string, indicates song's id on source website
   url: // string, refers to song's page on source website
           
   listens: // int
   popularity:  // float between 0 and 1

   pretty: 
      duration: // string, e.g '3:40'
      listens: // string, e.g. '10k'
      title: // string

# Name ideas

Good Unknown
Ok Unknown
oktrak
compass
unchanted
uncharted - .cm, im, is, .mx, LIKE .am, .gd, .im, .is, .mx	
unknown
unsound
unfound
soundless
undersound
songsearch

Questo

neutune - .com !!!!
tuuune - .com!!!
ununu
tunedune
soontune
moontune
lunetune
tunetune
newtune
boxtune
boptune
diftune
dibtune
ebbtune
tabtune
fabtune
getune
findtune
tunemap
maptune
hiptune
hoptune
tunehub
testune
babetune
baretune
goodtune
cultune
dustune
easytune
tunefort

mixdom

music roulette
song roulette

finetune

nutune

plutune
neptune

anytune
opportune
bigtune

tinytune

fortune
4tune

tootune
sounnnd
not40
notforty
bottom40
future40
void
avoid
verydisco (discovery)
onown
tvne
tiptune - like
songsilo
soundhound

# idea to get tons of spotify api access:
app which tells you how hipster your music tastes are!!!!

# take lots of design cues from svpply
- found by X user
- select genre UI

#Advanced options

<!-- 
     in  <select id="topicID" class="option" category="search">
        <option value="/m/074ft">any genre</option>
        <option value="/m/07t13s">hip hop</option>
        <option value="/m/0m0jc">electronic</option>
        <option value="/m/03_d0">jazz</option>
        <option value="/m/05rwpb">indie</option>
        <option value="/m/03lty">metal</option>
        <option value="/m/0155w">blues</option>
        <option value="/m/06by7">rock</option>
        <option value="/m/06cqb">reggae</option>
     </select>   -->
<!--             <a href="javascript:void(0)" id="toggleAdvanced">More options</a>
<section id="advancedOptions" class="hide">
<label>Uploaded during
 <select id="after" class="option" category="search">
    <option>Any date</option>
    <option>This year</option>
    <option>This month</option>
    <option>This week</option>
    <option>Today</option>
 </select>
</label>
<b>Include</b>
<label>
<input type="checkbox" id="remixes" class="option"  category="filter" />
Remixes
</label>
<label>
<input type="checkbox" id="foreign"  class="option"  category="filter" />
Foreign songs
</label>
<label>
<input type="checkbox" id="covers" class="option"  category="filter" />
Covers and tributes
</label>
</section> -->

#stats

<section class="listStats">
  <h3>Video stats</h3>
  <section class="youtube"></section>
  <section class="soundcloud"></section>
</section>

function getStats () {

var youtubeStats = {
'Total songs': 0,
'Total likes': 0,
'Total dislikes': 0,  
'Total listens': 0
};

for (var i = 0;i < starredSongs.length;i++) {

var song = starredSongs[i];

if (song.source.name) {

youtubeStats['Total songs']++;
youtubeStats['Total likes'] += song.popularity.likes;
youtubeStats['Total dislikes'] += song.popularity.dislikes;
youtubeStats['Total listens'] += song.listens;

};

};

youtubeStats['Mean likes'] = youtubeStats['Total likes']/youtubeStats['Total songs'];
youtubeStats['Mean listens'] = youtubeStats['Total listens']/youtubeStats['Total songs'];
youtubeStats['Mean dislikes/likes'] = youtubeStats['Total dislikes']/youtubeStats['Total likes'];
youtubeStats['Mean reactions/listens'] = (youtubeStats['Total likes'] + youtubeStats['Total dislikes'])/youtubeStats['Total listens'];

return youtubeStats
};

function makeStatsHtml (stats) {
var html = '';
for (var i in stats) {
html += '<p><b>' + i + ':</b> ' + stats[i] + '</p>';
};
return html
};