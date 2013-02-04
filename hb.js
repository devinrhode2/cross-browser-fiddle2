/**
 * highlight-bubble.js v0.0.1
 * Create a bubble when text is highlighted
 * MIT Licensed - github.com/devinrhode2/highlight-bubble-js
 * by DevinRhode2, @DevinRhode2 on gmail/github/twttr
 */
var hb = {

  // Default options
  options: {
    bubbleId: 'highlight-bubble'
  },
  
  designMode: function hb_designMode() {
    if (document.designMode == null) {
      return false;
    } else {
      return !(document.designMode === 'off' ||
               document.designMode === 'Off' ||
               document.designMode === 'Inherit');
    }
  },
  
  getSelection: function hb_getSelection() {
    try {
      console.log('defaulView');
      return document.defaultView.getSelection(); // Works for most browsers, rest are for IE
    } catch( _ ) { }
    try {
      console.log('window.getSel');
      return window.getSelection();
    } catch( _ ) { }
    try {
      console.log('doc.getSel');
      return document.getSelection();
    } catch( _ ) { }
    try {
      var selection = document.selection && document.selection.createRange();
      selection.toString = function customToString() {
        return this.text;
      };
      return selection;
    } catch( _ ) { }
    return null;
  },
  
  getLastRange: function hb_getLastRange(selection) {
    var lastRange = selection.getRangeAt(selection.rangeCount - 1);
    for(var r = selection.rangeCount - 1; r >= 0; r--) {
      if (!selection.getRangeAt( r ).collapsed) {
        lastRange = selection.getRangeAt( r );
        break;
      } else {
        //invalid range
      }
    } //fix Firefox bug? with selecting backwards: it creates an range at the end that is collapsed
    return lastRange;
  },
  
  getSelectionKey: function hb_getSelectionKey(selection) {
    try {
      var lastRange = hb.getLastRange(selection);
      return [selection.toString(), lastRange.endContainer, lastRange.endOffset];
    } catch(err) { //bad IE hack
      return [selection.toString()];
    }
  },
  
  isValidSelection: function hb_isValidSelection(selection) {
    try {
      if (selection.toString()) {

        //fix problems with flash players on myspace such as http://www.myspace.com/entershikari
        if (selection.anchorNode.nodeName.toLowerCase() === 'object') {
          return false;
        }
        /*
        //too restrictive
        if (!(selection.anchorNode.nodeName.toLowerCase() === '#text' && 
           selection.focusNode.nodeName.toLowerCase() === '#text')) {
          return false;
        }
        */
        var containsInput = false;
        $('textarea, input[type=text]', document).each(function forEachInput(i) {
          if (selection.containsNode(this, true)) {
            containsInput = true;
            return false;
          }
        });
        return !containsInput;
      } else {
        return false;
      }
    } catch(err) { //bad IE hack
      return selection.toString();
    }
  },
  
  getSelectionOffsets: function hb_getSelectionOffsets(selection) {
    var $testSpan = $('<span class="highlight-bubble-test-span">x</span>');
    try {
      var lastRange = hb.getLastRange(selection);
      var newRange = document.createRange();
      newRange.setStart(lastRange.endContainer, lastRange.endOffset);
      newRange.insertNode($testSpan[0]);
    } catch(err) { //bad IE hack
      try {
        var $tmp = $('<div></div>', document).append($testSpan);
        var newRange = selection.duplicate();
        newRange.setEndPoint('StartToEnd', selection);
        newRange.pasteHTML($tmp[0].innerHTML);
        $testSpan = $('.highlight-popup-bubble-test-span');
      } catch(e) {
        return null; //something is wrong, probably inside input or TextArea (IE <= 8 cannot detect this);
      }
    }
    
    return getOffsetsAndRemove($testSpan);
  },
  
  getOffsetsAndRemove: function hb_getOffsetsAndRemove($testSpan) {
    var currentNode = $testSpan[0];
    var totalOffsetTop = 0;
    var totalOffsetLet = 0;
    while(currentNode != null) {
      totalOffsetTop += currentNode.offsetTop;
      totalOffsetLet += currentNode.offsetLeft;
      currentNode = currentNode.offsetParent;
    }
    $testSpan.remove();
    return [totalOffsetTop, totalOffsetLet, $testSpan.height()];
  },
  
  /**
   * ie, more of a private var, but in leu of changing the module pattern,
   * I'm just making it a property.
   * Changing the module pattern but maintaining the options api was tricky, so I passed
   */
  ie: (function() {
    /*jshint boss:true, asi: true, expr: true, latedef: true */
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    );

    return v > 4 ? v : undef;
  }()),

  isLeftClick: function hb_isLeftClick(event) {
    if (hb.ie) {
      if (document.documentMode && document.documentMode > 8) {
        return event.button === 0;
      } else {
        return event.button === 1;
      }
    } else {
      return event.button === 0;
    }
  },

  setup: function hb_setup() {
    var $html = $('html');
    $html.on('mousedown', function(event) {
      $('.highlight-bubble').each(function(i) {
        //cleanupPopupBubble($(this));
      });
    });

    $html.on('mouseup keyup', function(event) {
      var selection = hb.getSelection();
      console.log(selection);
      
      $('.highlight-bubble', document).each(function(i) {
        //cleanupPopupBubble($(this));
      });
      
      if(hb.isLeftClick(event)) {
        if(!hb.designMode()) {
          // insert popover
        }                    
      }
    });


    var hoveredLink = null;
    var inPopover = false;
    $html.on('mouseenter', 'a', function () {
      if (!inPopover) {
        var hoveredLink = $(this);
        var $a = hoveredLink;
        setTimeout(function() {
          if(!hb.designMode() && hoveredLink && hoveredLink[0] == $a[0]) {
            //insert popover
          }
        }, 750);
      }
    });
    $html.on('mouseenter', 'a', function() {
      hoveredLink = null; //if $a == hoveredLink
      setTimeout(function() {
        if(!inPopover) {
          $('.highlight-bubble').each(function(i) {
            //cleanupPopupBubble($(this));
          });
        }
      }, 450);
    });
    $html.on('mouseenter', '.highlight-bubble', function() {
      inPopover = true;
    });
    $html.on('mouseleave', '.highlight-bubble', function() {
      inPopover = false;
    });
  }
};

(function highlightBubbleJSSetup() {
  if ( (new RegExp('https?://(([^/]*\.)?n___ytimes______disabled.com.*)')
       ).exec(location.href) == null) {
    $(function() {
      if (!hb.designMode()) {
        hb.setup();
      }
    });
  }
}());

if (this.module && this.module.exports) {
  module.exports = hb;
}