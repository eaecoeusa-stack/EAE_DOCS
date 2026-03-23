if (typeof(se_dynamicLinkInfo)=="undefined")
	var se_dynamicLinkInfo = new Array();

function se_openlink(mapid)
{
	window.parent.location.href = "../index.htm" + "?rhmapid=" + mapid;
	return false;
}
function se_loadExternalLinkTargets(linkElement, linkTarget){
	
	var children = document.querySelectorAll(".relatedTopics");
	if(children.length > 0){
		se_deleteRelatedTopicsContainer(children);
	}

	var linkTargets = linkTarget.split(";");
	linkTargets.forEach(function (target){
		if(target != "" && target != null){
			var linkInfos = se_FindDynamicLinkInfo(target);
			if(linkInfos != null && linkInfos != undefined){
				var targets = "";
				for(var i=0; i < linkInfos.data.length; i++)
				{
					targets += linkInfos.data[i].topictitle + " ";
				}

				se_buildRelatedTopicsContainer(linkElement, linkInfos.data);
			}
		}		
	})
}

function se_deleteRelatedTopicsContainer(children){
	children.forEach(function(item){
		item.remove();
	})
}

function se_buildRelatedTopicsContainer(linkShowTopics, linkInfos){

	var relatedTopicsContainer = document.createElement("span");
		relatedTopicsContainer.setAttribute("class","relatedTopics");
	linkShowTopics.parentNode.insertBefore(relatedTopicsContainer, linkShowTopics.nextSibling);

	
	linkInfos.forEach(function(item){
		var path = se_modifyRelatedTopicPath(item);
		var relatedTopic = document.createElement("a");
			relatedTopic.setAttribute("class","relatedTopic");
			relatedTopic.setAttribute("href",path);
			relatedTopic.setAttribute("target","_parent");
		relatedTopicsContainer.appendChild(relatedTopic);

		var topicTitleElem = document.createElement("span");
			topicTitleElem.setAttribute("class","topicTitle");
		relatedTopic.appendChild(topicTitleElem);
		
		var topicTitleText = document.createTextNode(item.topictitle);
		topicTitleElem.appendChild(topicTitleText);
		
		var helpTitleElem = document.createElement("span");
			helpTitleElem.setAttribute("class","helpTitle");
		relatedTopic.appendChild(helpTitleElem);
		
		var helpTitleText = document.createTextNode(item.helptitle);
		helpTitleElem.appendChild(helpTitleText);
	})
}
function se_modifyRelatedTopicPath(item){
	var directories = item.topicurl.split("/") 
	var goDirectoryUp  = "";	 
	var helpRootFound = false;
	directories.forEach(function (dir){
		if(dir != ".." && (dir != item.helpname || helpRootFound) && dir != directories[directories.length -1]){			
			goDirectoryUp += "../"
		}	
		if (dir == item.helpname)
			helpRootFound = true ;
	})

	return goDirectoryUp + item.topicurl
}
function se_AddDynamicLink(helpId, dynamicLinkInfo)
{
	var helpBrickConfig = se_GetHelpBrickConfig();
	var isHelpBookVisible = true ;
	if (helpBrickConfig != null && typeof(helpBrickConfig)!='undefined' && helpBrickConfig && helpBrickConfig.isHelpBookVisible(helpId)==false)
		isHelpBookVisible = false;
	if (isHelpBookVisible==false)
		return ;
	var linkRef = se_FindDynamicLinkInfo(dynamicLinkInfo.anchor);
	if (linkRef == null)
	{
		linkRef = {"id": dynamicLinkInfo.anchor, "data": new Array()};
		se_dynamicLinkInfo.push(linkRef);		
	}
	linkRef.data.push(dynamicLinkInfo);
}
function se_GetHelpBrickConfig()
{
	if (typeof(g_se_helpBrickConfig)!='undefined')
		return g_se_helpBrickConfig;
	try
	{
		if (typeof(window.parent.g_se_helpBrickConfig)!='undefined')
			return window.parent.g_se_helpBrickConfig;
	}
	catch(e)
	{
		//no access to parent window, perhaps due to browser restrictions on local installations (i.e. Chrome)
	}
	return null;
}
function se_FindDynamicLinkInfo(anchorId)
{
	for(var i=0; i < se_dynamicLinkInfo.length; i++)
	{
		if (se_dynamicLinkInfo[i].id == anchorId)
			return se_dynamicLinkInfo[i];
	}
	return null;
}