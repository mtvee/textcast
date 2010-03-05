// ----------------------------------------------------------------
// Textcast class
//
// This class types out text found in a hidden textarea like
// an old school terminal would... kinda sorta
//
// Tested with: Safari 4, Firefox 3.5, Opera 10
//
// <div id="terminal">
//		<span id="writer"></span><b class="cursor" id="cursor">_</b>
// </div>
//
// ----------------------------------------------------------------// 
// Copyright: 2010 &copy; J. Knight 
//    Author: J. Knight <emptyvee AT_GARBAGE gmail DOT_GARBAGE com>
//       Web: http://github.com/mtvee/textcast
//      Date: Mar 3, 2010
//   Version: 0.2.0
//   License: MIT 
// ----------------------------------------------------------------
var Textcast = function( p_opts ) 
{
    // ============================
    // Private, super secret stuffs
    // ============================
    // user cconfigurable vars
    var config = {
    	speed: 		120,        // ms between typed chars
    	pause: 		1000,       // ms at end of typed line
    	line_count: 25,         // how many lines or psuedo screen has
    	writer_id: 	"writer",   // html id of the writer span
    	cursor_id: 	"cursor",   // html id of the cursor span
    	style:      'term'      // style to use
    }
    
    // put more styles here. Just an array of pairs with each pair
    // being a [regexp,css style name]
    // the last regex should match anything, default style
    var styles = {
        term : [[new RegExp(/^\$/),'input'], // regex, css style name
                [new RegExp(/^\#/),'comment'],
                [new RegExp(/^.?/),'output']]
    }

    // private vars
    var m_text = new Array();
    var m_row = 0;
    var m_col = 0;
    var m_timeout = null;

    // ----------------------------------------------------------------
    // Load the configuration options into our config object
    // ----------------------------------------------------------------
    var load_config = function( opts ) {
    	for( var k in opts ) {
    		config[k] = opts[k];
    	}
    };

    // ----------------------------------------------------------------
    // deal with entities
    // ----------------------------------------------------------------
    function stripHtml(s) {
    	return s.replace(/\&/g, '&amp;').replace(/\</g, '&lt;');
    }
    
    // ----------------------------------------------------------------
    // the actual typer thing
    // ----------------------------------------------------------------
    var type_text = function() {
    	txt = '';
		clearTimeout( m_timeout );
    	for( var i = Math.max(0,m_row-config.line_count); i < m_row; i++ ) {
    		for( var s in styles[config.style] ) {
    		    if( styles[config.style][s][0].test( m_text[i] )) {
        			txt += "<span class='"+styles[config.style][s][1]+"'>" + m_text[i].replace(/ /g, '&nbsp;') + "</span><br/>";
        			break;
    		    }
    		}
    	}
    	if( m_row >= m_text.length) {
    		document.getElementById(config.writer_id).innerHTML = txt;
    		return;			
    	}
        document.getElementById(config.writer_id).innerHTML = txt + m_text[m_row].substr(0,m_col);		
    	m_col++;
    	if( m_col > m_text[m_row].length ) {
    		m_col = 0;
    		m_row++;
    		while( m_row < m_text.length && m_text[m_row].charAt(0) != '$' && m_text[m_row].charAt(0) != '#' ) {
    			m_row++;
    		}
    		m_timeout = setTimeout( type_text, config.pause );
    	} else {
    		m_timeout = setTimeout( type_text, config.speed );
    	}						
    };

    // ----------------------------------------------------------------
    // Set the text by reading the textarea with id=data_id and splitting
    // it, on newlines, into an array of lines
    // ----------------------------------------------------------------
    var set_text = function( data_id ) {
    	return m_text = stripHtml(document.getElementById(data_id).value).split("\n");			
    };

    // -------------------
    // read in the options
    if( p_opts ) load_config( p_opts );

    // ============================
    // Public, show your mom stuffs
    // ============================
    return {		
    	// ----------------------------------------------------------------
    	// call this with the id of a hidden textarea that contains the 
    	// multiline textual data
    	// ----------------------------------------------------------------
    	write: function( data_id ) {
    		m_row = m_col = 0;
    		if( set_text( data_id ) )
    			type_text();
    	},
	
    	// ----------------------------------------------------------------
    	// start the playback
    	// ----------------------------------------------------------------
    	play: function() {
    		m_timeout = setTimeout( type_text, config.speed );				
    	},
	
    	// ----------------------------------------------------------------
    	// pause the playback
    	// ----------------------------------------------------------------
    	pause: function() {
    		clearTimeout( m_timeout );				
    	},
	
    };
};
