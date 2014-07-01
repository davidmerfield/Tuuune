# To do

# Precache valid results then select from those instead of hammering YTs API? Would be so much quicker...
		- This is a good idea. Store the songs in JSON.
		- select 200 good songs with attractive album covers to form favorable first impression
- Create introductory visual to explain how discover works, set users expectations to have to wade through shit
		-	Emphasize this is for listening to good music you've never heard of... no genre options just new shit
		- It takes effort on your part, is this an active process
- add region detection/selection to make sure no 'video not available in your country'
- Nice truncation
- Loading then playing animation for song card
- added to queue state for song card
- add 'quality' indicator to song card / hotness incidator
- make song cards responsive width to fill screen
- add loading/buffering state to player
- add volume setting to player, media players
- make player work without flash
- show youtube player for youtube songs
- add star button to song cards
- try to avoid distorting the album art too much
- this won't work disclaimer for mobile/ipad/internet explorer

Discover

- stop already seen songs from showing up again in search results

Starred

- Add dynamic label which shows how many starred songs there are
- Work out how to robustly backup starred songs locally, perhaps cookies? they don't persist throughout sessions
- explain that the songs might get removed, follow me on twitter for updates

Queue
- Add label which shows how many songs there are in queue
Save queue locally

History
Save history locally
Allow yourself to play a song from history
Player
- fix progress bar
- add tooltips to star and permalink
- show sound cloud embed if flash not enabled
- prevent played from playing two songs at the same time
- save play history

Footer
- add legal disclaimer

# After launch

- add related songs which fly out around the current song card in a circle, use spotify's api for this too
- Add sensible animation
- Make a community
- Consider alternative player layout at top of page
- 'Blind' mode with no album art or song titles, only revealed when you like a song.
- Drag and drop UI
- Make playback quicker, Preload first song, Preload next song 
- On hover start buffering song in secondary player
- work out how to dynamically add and remove players
- Make sure each song has shareable URL
- determine like/dislike and like/view parameters for best results programmatically for each source.
- generate dictionary of popular artists from last.fm
- check for popular duplicate/re upload
- Think about how to add in albums
- Make filter use machine learning
- make filter weighted, instead of binary
- Regenerates next results on like song?
- try to find the song on Youtube and Soundcloud
- Rapid next-then previous should revert to point during song at which next was presed.
- take thumbnail into song quality consideration?
- Mainstream page with banned artists
- search become music streaming aggregator