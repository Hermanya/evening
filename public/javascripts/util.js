var Util = {
  insertAtCaret:  function(txtarea,text) {
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var browser = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
      "ff" : (document.selection ? "ie" : false ) );
    if (browser == "ie") { 
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      strPos = range.text.length;
    }
    else if (browser == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (browser == "ie") { 
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      range.moveStart ('character', strPos);
      range.moveEnd ('character', 0);
      range.select();
    }
    else if (browser == "ff") {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
  },
  toHumanTime : function (then) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = Date.now() - then;
    var result;
    if (elapsed < msPerMinute) {
        result = Math.round(elapsed/1000); 
         return  result < 2 ? 'now' : ( result + ' seconds ago');   
    }

    else if (elapsed < msPerHour) {
      result = Math.round(elapsed/msPerMinute);
         return  result < 2 ? 'a minute ago' :  (result + ' minutes ago');   
    }

    else if (elapsed < msPerDay ) {
      result = Math.round(elapsed/msPerHour );
         return  result < 2 ? 'an hour ago':( result + ' hours ago');   
    }

    else {
      return new Date(then).toJSON().split("T")[0];
    }
}
}