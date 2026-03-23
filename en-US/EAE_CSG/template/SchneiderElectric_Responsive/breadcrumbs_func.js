function SE_ShowProductBreadcrump(url, resultOnError)
{
	try
	{
		var helpBrickConfig = null;
		if (typeof(g_se_helpBrickConfig)=='undefined' || g_se_helpBrickConfig == null)
			helpBrickConfig = parent.g_se_helpBrickConfig;
		else
			helpBrickConfig = g_se_helpBrickConfig;
		if (typeof(helpBrickConfig)=='undefined' || helpBrickConfig == null)
			return true;
		return !helpBrickConfig.isInstalled();
	}
	catch(e)
	{
		return resultOnError ;
	}
}
function AddMasterBreadcrumbs(relHomePage, styleInfo, separator, strHome, strHomePath) {
    document.write("<span id=\"brseq" + gBCId + "\" ></span>");
    gBreadCrumbInfo[gBCId] = new BreadCrumbInfo(relHomePage, styleInfo, separator, strHome, strHomePath);
    gBCId++;
	if (typeof(se_breadcrumb_settings)!='undefined' && se_breadcrumb_settings != null)
	{
		for (var i=0; i < se_breadcrumb_settings.breadcrumbs.length; i++)
		{
			var currentBreadcrumb = se_breadcrumb_settings.breadcrumbs[i];
			if (currentBreadcrumb.isProductLandingPage == 'true' && SE_ShowProductBreadcrump(currentBreadcrumb.relHomePage, true)==false)
				continue;
			document.write("<span id=\"brseq" + gBCId + "\" ></span>");
			gBreadCrumbInfo[gBCId] = new BreadCrumbInfo(currentBreadcrumb.relHomePage, styleInfo, separator, currentBreadcrumb.strLabel, currentBreadcrumb.strUrlPage);
			gBCId++;
		}
	}
    addRhLoadCompleteEvent(UpdateBreadCrumbsMarker);
}
function writeBreadCrumbs() {
    for(var i=0;i<gBCId;i++) {  
		var bHomeFound = false;
        var strTrail = "";
        if(gBreadCrumbInfo[i].bcLinks.length == 0)
        {   
	        if(gBreadCrumbInfo[i].styleInfo == "breadcrumbs")
		        strTrail = "<a class=\""+ gBreadCrumbInfo[i].styleInfo + "\"" + " href=\"" + gBreadCrumbInfo[i].strHomePath +  "\">" + gBreadCrumbInfo[i].strHome + "</a> " + ((gBreadCrumbInfo[i].strHome == "")? "":gBreadCrumbInfo[i].separator) + " ";
	        else
	            strTrail = "<a style=\""+ gBreadCrumbInfo[i].styleInfo + "\"" + " href=\"" + gBreadCrumbInfo[i].strHomePath + "\"" + " target=\"_parent\"" + ">" + gBreadCrumbInfo[i].strHome + "</a> " + ((gBreadCrumbInfo[i].strHome == "")? "":gBreadCrumbInfo[i].separator) + " ";
        }
        else{
            var len = gBreadCrumbInfo[i].bcLinks.length;
			var bcName = "";
            for(var j=len-1;j>=0;j--)
            { 
				if(gBreadCrumbInfo[i].bcLinks[j].firstEntry == true)
				{
					if(bHomeFound)
						continue;
					else
						bHomeFound = true;
				}					

				bcName = gBreadCrumbInfo[i].bcLinks[j].name;
				
                if(gBreadCrumbInfo[i].bcLinks[j].strLink == "")
                {
                    strTrail += bcName + " " + gBreadCrumbInfo[i].separator + " ";
                }
                else{
                    if(gBreadCrumbInfo[i].styleInfo == "breadcrumbs")
 			            strTrail += "<a class=\""+ gBreadCrumbInfo[i].styleInfo + "\"" + " href=\"" + gBreadCrumbInfo[i].bcLinks[j].strLink + "\">" + bcName + "</a> " + gBreadCrumbInfo[i].separator + " ";
 			        else
 			            strTrail += "<a style=\""+ gBreadCrumbInfo[i].styleInfo + "\"" + " href=\"" + gBreadCrumbInfo[i].bcLinks[j].strLink + "\"" + " target=\"_parent\"" + ">" + bcName + "</a> " + gBreadCrumbInfo[i].separator + " ";
                }
            } 
        }
        var brselem = document.getElementById("brseq"+i);
        brselem.innerHTML = strTrail;
    }
}
