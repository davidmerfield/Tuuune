## General

- Ensure app complies with YT and SCs api TOS
- This won't work disclaimer for mobile/ipad/internet explorer

## Song card

- Make queued and starred and playing and loading states dynamic and rechecked each time the view is rendered
- Undo add to queue
- Make song cards responsive

## Discover

- Precache valid results then select from those
		- Store the songs in JSON
		- Select 200 good songs with attractive album covers to form favorable first impression

- Create introductory visual
		- Explain how discover works, set users expectations
		-	Emphasize this finds music you've never heard of... no genre
		- It takes effort on your part, is this an active process
		- One big button to start listening, first song preloaded

- Make sure every song we show to the user can be played
		- Add region detection/selection 

- Stop songs the user has seen from showing up again in search results

## Player

- Add loading/buffering state to player
- Add better flash detection
	- Show sound cloud embed if flash not enabled
- Add error handling for players
- Fix progress bar
- Add tooltips to star and permalink
- Prevent player from playing two songs at the same time

## Starred

- Add dynamic label for starred song count to nav
- Work out how to robustly backup starred songs locally, perhaps cookies? they don't persist very well throughout sessions

## Queue
- Add dynamic label for queued song count to nav
- Add label which shows how many songs there are in queue
Save queue locally

## History
- Fix play history
- Save history locally
- Allow yourself to play a song from history

## Fun shit
- Add nice colors
- Add fun design touches
- Design a logo
- Add neat about project
- Make fun use of custom cursors

--------------- SHARE THIS ----------------

# Future To Do

- make player work without flash
- Add 'quality' indicator to song card

- add volume setting to player, media players
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

- add top lists feature

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