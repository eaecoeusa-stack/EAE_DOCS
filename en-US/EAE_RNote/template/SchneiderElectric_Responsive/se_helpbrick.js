if (typeof(se_helpBrickConfigXmlStr)!='undefined')
{
	var g_se_helpBrickConfig = new HelpBrick(se_helpBrickConfigXmlStr);
	g_se_helpBrickConfig.checkLoaded();	
}

function HelpBrick(configXmlStr)
{
	this.helpBrickConfigXml = configXmlStr;
	this.brickConfig = null;
	this.callback = null;
	this.loadHelpBrickConfig = function()
	{
		if (typeof(this.helpBrickConfigXml)=='undefined')
			return null;
		if (this.brickConfig != null)
			return ;

		if (window.DOMParser) {
			var domParser = new DOMParser();
			this.brickConfig = domParser.parseFromString(this.helpBrickConfigXml, "text/xml");
		}
		if (this.callback != null)
			this.callback(this.brickConfig);
	}
	this.isInstalled = function()
	{
		this.checkLoaded();
		var helpBrickRoot = null ;
		if (typeof(this.brickConfig.length)=='undefined')
			helpBrickRoot = this.brickConfig.getElementsByTagName('HelpBrickStructureFile');
		else	
			helpBrickRoot = this.brickConfig[0].getElementsByTagName('HelpBrickStructureFile');
		if (helpBrickRoot.length == 0)
			return true ;
		var installed = helpBrickRoot[0].getAttribute("installed");
		if (typeof(installed)=='undefined' || installed==null || installed=="" || installed=="false")
			return false;
		return true ;
	}
	this.getHelpBookById = function(id)
	{
		this.checkLoaded();
		return this.brickConfig.querySelector('*[id=' + id + ']');
	}
	this.getHelpBooksByName = function(name)
	{
		this.checkLoaded();
		return this.brickConfig.querySelector('*[name=' + name + ']');
	}
	this.checkLoaded = function()
	{
		if (typeof(this.helpBrickConfigXml)=='undefined')
			return null;
		if (this.brickConfig != null)
			return;
		this.loadHelpBrickConfig();
	}
	this.isHelpBookVisible = function(id)
	{
		this.checkLoaded();
		var isVisible = true;
		if (typeof(this.brickConfig)=='undefined' || this.brickConfig == null)
			return isVisible;
		var book = this.getHelpBookById(id);
		if (book.length == 0)
			return isVisible;
		var langcode = document.documentElement.lang;
		var language = book.querySelectorAll('Language[value=' + langcode + ']');
		if (language.length == 0)
			return this.isNodeVisible(book);
		return this.isNodeVisible(language);
	}
	this.isNodeVisible = function(node)
	{
		var isVisible = true;
		var currentNode = node;
		if (typeof(node.length)!='undefined')
			currentNode = node[0];
		if (currentNode == null)
			return isVisible;
		var visibility = currentNode.getElementsByTagName('HelpBookVisibility');
		if (visibility.length == 0)
			return isVisible;
		isVisible = false;
		for (var i=0; i < visibility.length; i++)
		{
			if (visibility[i].innerHTML == 'true')
			{
				isVisible = true;
				break;
			}
			if (visibility[i].textContent == 'true')
			{
				isVisible = true;
				break;
			}
		}
		return isVisible;
	}
	this.getAllLanguages = function()
	{
		this.checkLoaded();
		if (typeof(this.brickConfig)=='undefined' || this.brickConfig == null)
			return new Array();
			var languageDefs = this.brickConfig.getElementsByTagName('Language');
		if (languageDefs.length == 0)
			return new Array();

		var languages = new Array();
		for(i = 0; languageDefs.length > i; i++){
			var language = languageDefs[i].getAttribute("value");
			if(typeof(language) != undefined && language != ""){
				languages.push(language);
			}
		}
		return this.uniqueArray(languages);
	}
	this.getInstalledLanguages = function()
	{
		var availLangs = new Array();
		this.checkLoaded();
		if (typeof(this.brickConfig)=='undefined' || this.brickConfig == null)
			return availLangs;
		var languages = this.getAllLanguages();
		for (var i=0; i < languages.length; i++)
		{
			var langcode = languages[i];
			if (langcode == '')
				continue ;

			var language = languages[i];
			var languageDefs = this.brickConfig.querySelectorAll('Language[value=' + language + ']');
			var visible = false ;
			if (languageDefs.length == 0)
				visible = false ;
			else
				visible = this.isNodeVisible(languageDefs);
			if (visible)
				availLangs.push(langcode);
		}
		return availLangs;
	}
	this.getInstalledLanguagesFromHelpBook = function()
	{
		var helpbook = getBooknameFromURL();
		var availLangs = new Array();
		this.checkLoaded();
		if (typeof(this.brickConfig)=='undefined' || this.brickConfig == null)
			return availLangs;
		var languages = this.getAllLanguages();
		for (var i=0; i < languages.length; i++)
		{
			var langcode = languages[i];
			if (langcode == '')
				continue ;
			var languageDefs = this.brickConfig.querySelectorAll('Language[value=' + langcode + ']');
			if (languageDefs.length == 0)
				continue ;
			if(helpbook.indexOf(".") !== -1){
				var modifiedHelpbook = helpbook.replace(/\./g, '\\.');
				var languageAndHelpBook = languageDefs[0].querySelectorAll("HelpBook[name='" + modifiedHelpbook + "']");
			}else{
				var languageAndHelpBook = languageDefs[0].querySelectorAll("HelpBook[name='" + helpbook + "']");
			}
			if (languageAndHelpBook.length==0)
				continue;
			var visible = this.isNodeVisible(languageAndHelpBook);
			if (visible)
				availLangs.push(langcode);
		}
		return availLangs;
	}
	this.uniqueArray = function(array) {
		if (Array.from)
			return Array.from(new Set(array));
		else
			return array;
	}
}
function getBooknameFromURL() {
	var path = window.location.href;
	path = path.split("/index.htm")[0].split("/");
	path = path[path.length -1];
	return path;
}
document.addEventListener("DOMContentLoaded", function(event) {
	if(g_se_helpBrickConfig == null)
		g_se_helpBrickConfig = new HelpBrick(se_helpBrickConfigXmlStr);
	g_se_helpBrickConfig.checkLoaded();
});
