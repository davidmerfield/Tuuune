# Music Finder

Find good unknown music.

Works by searching for songs with low number of listens but a very high like-to-view ratio. Or just a high ratio of 'responses,' positive or negative.

Sources:
Youtube Data API - have to show embed

Future sources:
Soundcloud Api
Vimeo API
Last.fm?

Prefer other sources over YouTube since their API TOS prohibit hiding their music player.

# Target

8tracks users and designers.mx

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

ALL ABOUT THAT AVENIR CONDENSED, MUSEO SANS CONDENSED IF NOT?
WHAT ABOUT FUTURA BOLD ITALIC FOR THAT HIPSTER SUPREME VIBE

# How to get the right songs

## Youtube

First we make a date range. Since there are so many music videos uploaded to youtube, we want to restrict the videos we need to filter. A date range of 1-3 days seems to work well. 

Then we search youtube with the following options:

order: 'relevance' seems to work the best
*other potentially useful are title (alphabetical) and views (top to bottom) and rating (top to bottom)*
publishedAfter: start of date range
publishedBefore: end of date range
maxResults: 50
regionCode: USA
videoEmbeddable: true
videoCategoryId: 10 // which is music
safeSearch: none // FUCK THE POLICE
type: video

Note there is no query parameter. Not sure how to construct one which works well.

Then filter the reponses: 

# Filter

iterate over each of the responses, 
		for each check rating is > 95%
		check view count is < 100k
		if so
			append to results div
			call search on similar video

when done call 

work out how to search within languages

# Player

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