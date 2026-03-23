// Create Element.remove() function if not exist //e.g. Internet Explorer doen't support function .remove().
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
  function getBrowserInformation() {
    var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isEdge = window.navigator.userAgent.indexOf("Edge") > -1,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isMozFF = winNav.userAgent.indexOf("Firefox") > -1,
      isSafariMac = winNav.userAgent.indexOf("Safari") > -1 && winNav.userAgent.indexOf("Macintosh") > -1,
      isSafariMobile = winNav.userAgent.indexOf("Safari") > -1 && winNav.userAgent.indexOf("Mobile") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");
    if (isIOSChrome) {
      //Google Chrome for iOS
      name = "ChromeIOS";
    } else if (isEdge) {
      //Microsoft Edge
      name = "Edge";
    } else if (isMozFF) {
      //Mozilla Firefox
      name = "Firefox";
    }else if (isSafariMac){
      name = "Safari";
    }else if(isSafariMobile) {
      name = "Safari";  
    }else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false
    ) {
      //Google Chrome
      name = "Chrome";
    } else {
      //Microsoft Internet Explorer
      name = "InternetExplorer"
    }
    var browserInfor = {
      browserName: name,
      browserVersion: "",
    }
    return browserInfor;
  }
  
  function isChrome() {
    return getBrowserInformation().browserName == "Chrome";
  }
  
  function isChromeIOS() {
    return getBrowserInformation().browserName == "ChromeIOS";
  }
  
  function isInternetExplorer() {
    return getBrowserInformation().browserName == "InternetExplorer";
  }
  
  function isEdge() {
    return getBrowserInformation().browserName == "Edge";
  }
  
  function isFirefox() {
    return getBrowserInformation().browserName == "Firefox";
  }
  
  function isSafari() {
    return getBrowserInformation().browserName == "Safari";
  }
function SE_mobileBrowserDetection(){
	if( navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)
	){
	   return true;
	 }
	else {
	   return false;
	 }
}
function SE_iOSBrowserDetection(){
    if( navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    ){
       return true;
     }
    else {
       return false;
     }
}

//check if document is local or in web
//print functions will only works in chrome if the document is not local
function isDocumentInWeb() {
    if (window.location.protocol != "file:") {
      return true;
    } else {
      return false;
    }
  }
