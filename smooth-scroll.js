/*--------------------------------------------------------------------------
 *  Smooth Scroller Script, version 1.0.2
 *  (c) 2007 Dezinerfolio Inc. <midart@gmail.com>
 *  Edited by @floorish
 *
 *  For details, please check the website : http://dezinerfolio.com/
 *
  --------------------------------------------------------------------------*/

Scroller = {
	// control the speed of the scroller.
	// dont change it here directly, please use Scroller.speed=50;
	speed:10,
    offset:0,

	// returns the Y position of the div
	gy: function (elem) {
		var y = elem.offsetTop;
		if (elem.offsetParent) {
            while (elem = elem.offsetParent) {
                y += elem.offsetTop;
            }
        }
		return y - this.offset;
	},

	// returns the current scroll position
	scrollTop: function () {
		var body = document.body;
        var d = document.documentElement;
        if (body && body.scrollTop) return body.scrollTop;
        if (d && d.scrollTop) return d.scrollTop;
        if (window.pageYOffset) return window.pageYOffset;
        return 0;
	},

	// attach an event for an element
	add: function(elem, type, func) {
        if (elem.addEventListener) return elem.addEventListener(type, func, false);
        if (elem.attachEvent) return elem.attachEvent('on'+type, func);
	},

	// kill an event of an element
	end: function(e) {
        if (window.event) {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
            return;
        }
        if (e.preventDefault && e.stopPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }
	},
	
	// move the viewport to the desired position
	scroll: function(targetPos) {

        // viewport height
		var viewHeight = window.innerHeight || document.documentElement.clientHeight;

        // total page height
		var pageHeight = document.body.scrollHeight;

        // current scroll position
		var currentPos = Scroller.scrollTop();

        // check if we are at the destination of previous iteration
        /*if ( Scroller.previousPos !== false && Scroller.previousPos !== currentPos ) {
            return;
        }*/

        // can't scroll beyond pageHeight: set target to lowest possible
        if( pageHeight - targetPos < viewHeight ) {
            targetPos = pageHeight - viewHeight;
        }

        var diff = ( targetPos - currentPos)/Scroller.speed;

        // check if target is below current position
        if(targetPos > currentPos) {
            diff = Math.ceil(diff);
        } else {
            diff = Math.floor(diff);
        }

        currentPos += diff;

        // scroll to new position
		window.scrollTo(0, currentPos);

        Scroller.previousPos = currentPos;

        // stop if the destination is reached, or this iteration scrolled nothing
        if(currentPos == targetPos || diff == 0 ) {
            clearInterval(Scroller.interval);
            Scroller.previousPos = false;
        }

	},

	// initializer that adds the renderer to the onload function of the window
	init: function() {
		Scroller.add(window, 'load', Scroller.render);
	},

	// this method extracts all the anchors and validates then as # and attaches the events.
    render: function() {

        Scroller.end(this);

        var anchors = document.getElementsByTagName('a');

        for ( var i = 0; i < anchors.length; i++ ) {
            var anchor = anchors[i];

            // check if anchor links to something in current page
            if( anchor.href && anchor.href.indexOf('#') != -1 &&
                    anchor.href.indexOf('#') != anchor.href.length-1 &&
                    ((anchor.pathname == location.pathname) || ('/'+anchor.pathname == location.pathname)) ) {

                // add event listener
                Scroller.add(anchor, 'click',
                    function() {
                        Scroller.end(this);

                        var target = this.hash.substr(1);
                        var targetElem = document.getElementById(target);

                        // check if target exists
                        if( ! targetElem) {

                            // check all anchors on the page for matching name attribute
                            for ( var j=0; j < anchors.length; j++) {

                                if( anchors[j].name == target ) {
                                    targetElem = anchors[j];

                                    // don't search further
                                    break;
                                }

                            }

                        }

                        // scroll to target if it exists
                        if ( targetElem ) {
                            clearInterval(Scroller.interval);

                            Scroller.interval = setInterval(function(){
                                Scroller.scroll(Scroller.gy(targetElem));
                            }, 10);
                        }

                    }

                );


            }
        }
    }
};

// invoke the initializer of the scroller
Scroller.init();
