/*Schneider Electric - 2017-01-25
  created by Markus Wiedenmaier, practice-innovation
          2017-01-2015

this is a placeholder script file, for later customizations
script is placed at the end of the html document (before body-end-tag) see (topic.slp)

*/

// Custom override for Schneider Electric:
// original function by ScriptEngine\template\scripts\mhtopic.js
// Removed string replace for abs and nbsp since it would remove text-ident
function DomTextNode( a_Node, a_nFrom )
{
	this.node = a_Node;
	this.nFrom = a_nFrom;

	this.aClosedRanges = new Array();

	this.getClosedRanges = function( a_aRanges, a_nStart )
	{
		var nTo = this.nFrom + a_Node.data.length;
		for ( var i = a_nStart; i < a_aRanges.length; i++ )
		{
			if ( a_aRanges[i].nStart <= nTo &&
				 a_aRanges[i].nEnd >= this.nFrom )
			{
				this.aClosedRanges[this.aClosedRanges.length] = new ClosedRange( a_aRanges[i].nStart > this.nFrom ? a_aRanges[i].nStart : this.nFrom,
																				 a_aRanges[i].nEnd < nTo ? a_aRanges[i].nEnd : nTo );
			}
			if ( a_aRanges[i].nEnd > nTo )
			{
				return i;
			}
		}
		return i;
	}

	this.doHighlight = function( a_aRanges, a_nStart )
	{
		s_strHlStart = "<font style='color:" + gsTextColor + "; background-color:" + gsBkgndColor + "'>";
		s_strHlEnd = "</font>";

		if ( a_nStart >= a_aRanges.length )
			return a_nStart;

		var nEnd = this.getClosedRanges( a_aRanges, a_nStart );
		if ( this.aClosedRanges.length == 0 )
			return nEnd;

		// Check if node.parentNode is a valid parent for a span tag.
		if (!isValidParentForSpan(this.node.parentNode))
			return nEnd;

		var strText = this.node.data;

    //SE override start
		strText = strText;
    //SE ovveride end


		var strHTML = "";
		var nLastStart = 0;
		for ( var i = 0; i < this.aClosedRanges.length; i++ )
		{
			strHTML += _textToHtml_nonbsp(strText.substring( nLastStart, this.aClosedRanges[i].nStart - this.nFrom ));
			strHTML += s_strHlStart;
			strHTML += _textToHtml_nonbsp(strText.substring( this.aClosedRanges[i].nStart - this.nFrom,
										  this.aClosedRanges[i].nEnd - this.nFrom ));
			strHTML += s_strHlEnd;

			nLastStart = this.aClosedRanges[i].nEnd - this.nFrom;
		}
		strHTML += _textToHtml_nonbsp(strText.substr( nLastStart ));

		var spanElement = document.createElement( "span" );
		spanElement.innerHTML = strHTML;
		if (gbIE)
		{
		    //for IE, when assigning string to innerHTML, leading whitespaces are dropped
		    if ((strHTML.length >0)&&(strHTML.charAt(0) == " "))
		        spanElement.innerHTML = "&nbsp;" + spanElement.innerHTML ;
		}

		this.node.parentNode.replaceChild( spanElement, this.node );
		if(gnYPos == -1)
		{
			var elemObj = spanElement;
			var curtop = 0;
    			if (elemObj.offsetParent)
    			{
        			while (elemObj.offsetParent)
        			{
            				curtop += elemObj.offsetTop
            				elemObj = elemObj.offsetParent;
        			}
    			}
    			else if (elemObj.y)
        			curtop += elemObj.y;

			gnYPos = curtop;
		}
		showHighlightedElement(spanElement);
		return nEnd;
	};
}