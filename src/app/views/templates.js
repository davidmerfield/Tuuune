function templates () {
  return {
    song:
      '<a class="result" href="#" id="{{id}}">' +
        '<span class="thumbnail"><img src="{{snippet.thumbnails.default.url}}" /></span>' +
        '<span class="title">{{prettyTitle}} </span> ' +
        '<span class="buttons">' +
          '<span class="removeFromResults">x Hide</span>' +
          '<span class="save">* Save</span>' +
          '<span class="addToQueue">+ Queue</span>' +
        '</span>' + 
        '<span class="stats">' +
          '<span class="duration">{{prettyDuration}} &#8226; </span>' +
          '<span class="views">{{prettyViewCount}} listens &#8226; </span>' +
          '<span class="views">{{statistics.likeCount}} likes &#8226; </span>' +
          '<span class="views">{{statistics.dislikeCount}} dislikes</span>' +
        '</span>' +
      '</a>'
  }
}
