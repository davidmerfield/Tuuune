# Youtube Music Finder

Searches the music category for music with <10,000 views which has < 0.5% ratings and whose like to dislike ratio is > 95%.

By default, just show audio player.

BLACK FEEL

generates new playlist on load, options to share playlist.

calling / redirects you to 
/p/HASH which allows you to share generated playlist

Parse Title and song name. query spotify. Add feature to push to spotify.

go after designers.mx market

have random playlists made

also show pre-made playlists on right hand side
youtify.com is good example

hide video player by default

add a slider to find good music with under 100,000 views, log scale.

add slider for 'fresh'

scrobble to last fm

Attempt to parse buy link

AVENIR CONDENSED, MUSEO SANS CONDENSED IF NOT

# Name ideas

GoodUnknown
okunknown.com

OK Unknown
Good Unknown

song track
songmap 
compass

void.fm
avoid.fm
the good unknown
ok unknown 
oktrak
very disco (discovery)
onown .co
uncharted - .cm, im, is, .mx, LIKE .am, .gd, .im, .is, .mx	
strange
goodunknownmusic
goodunpopular
unknown.fm
unone.fm
unown.fm
notyet.fm
prefame.fm
probablyhavent.com
novelsong
novel.fm
new.gd
upMusic

unkwn
unoone
unown.com
vnknown
sonu

If it gets popular it will 'shift the market' and influence results returned

# Implementation Ideas

How to get low viewed highly rated videos from youtube

search params:

q: 'random string' to help reduce number of results and vary response
order: 'rating' highest to lowest, we want good music
	- other potentially useful are title (alphabetical) and views (top to bottom)
publishedAfter: 1 month, we want fresh music
maxResults: 50
regionCode: USA
videoEmbeddable: true
videoCategoryId: music
videoDefinition: any
safeSearch: none
type: video
videoDuration: short (will return < 4min) eek

iterate over each of the responses, 
		for each check rating is > 95%
		check view count is < 100k
		if so
			append to results div
			call search on similar video

when done call 

work out how to search within languages

// Application works like so

get results from 
   - youtube seed
   - similar videos to like song

there are user preferences and global preferences

user preferences:
   keyword - new search
   date range - new search
   max populatity - filter existing

global:
   no live shows 
   like ratio
   min likes

make queue from results applying filters specified by user

perhaps try without seed query (random word) but with more specific date range?

player moves down queue

player saves song
   append more to results

player skips song
   DO SOMETHING

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
