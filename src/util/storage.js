Tuuune.storage = (function(){
  
  var appPrefix = 'Tuuune:';

  function get (key) {
    var value = localStorage.getItem(appPrefix + key);
    if (value) {return JSON.parse(value)}
  };

  function drop (key) {
    localStorage.removeItem(appPrefix + key)
  };

  function set (key, value) {

    if (typeof value === "object") {
      value = JSON.stringify(value)
    };

    return localStorage.setItem(appPrefix + key, value);
  };

  return {
    set: set,
    get: get,
    drop: drop 
  }

}());