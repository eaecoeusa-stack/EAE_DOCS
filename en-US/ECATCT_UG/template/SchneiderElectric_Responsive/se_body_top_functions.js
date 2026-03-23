/*Schneider Electric - 2017-01-25
  created by Markus Wiedenmaier, practice-innovation
          2017-01-2015

this is a placeholder script file, for later customizations
script is placed at the beginning of the html-body element (after body-start-tag) see (topic.slp)

*/
window.onload = function(){
  var checkbox = getSubstrSearchCheckbox();
  if (checkbox == null)
    return;
  var isActive;
  if(getUrlParameter("SUBSTRSRCH", gDefTopicURL) != 'undefined' && getUrlParameter("SUBSTRSRCH", gDefTopicURL) != ''){
    isActive = getUrlParameter("SUBSTRSRCH", gDefTopicURL);
  }else if(gsSubstrSrch != 'undefined'){
    isActive = gsSubstrSrch;
  }else{
    isActive = 1;
  }
  checkAndURLParamenter();
  changeSubstringSearchCheckbox(checkbox, isActive) 
}
function checkAndURLParamenter(){
  var isActive;
  if(getUrlParameter("rhandsearch", gDefTopicURL) != 'undefined' && getUrlParameter("rhandsearch", gDefTopicURL) != ''){
    isActive = getUrlParameter("rhandsearch", gDefTopicURL);
  }else if(gbANDSearch != 'undefined'){
    isActive = gbANDSearch;
  }else{
    isActive = 1;
  }
  changeAndSearchState(isActive);
}
function changeAndSearchState(isActive){
  initSettings(".");
  if(isCookieFullySupported())
		setCookie("rhandsearch", isActive, true);
	else if(isLocalDBSupported())
		setInLocalDB("rhandsearch", isActive, true);
	else if(isCookieSupportedWithoutPath())
    setThroughIFrame("rhandsearch", isActive, true);
}
function changeSubstringSearchCheckbox(checkbox, isActive){
  if(isActive == "1"){
    checkbox.classList.remove("active");
    gsSubstrSrch = 1;
  }else{
    checkbox.classList.add("active"); 
    gsSubstrSrch = 0; 
  }
}
function searchEntireString(){
  var checkbox = getSubstrSearchCheckbox();
  if (checkbox == null)
    return;
  var checkActivity = checkbox.classList.contains("active");
  if(checkActivity){
    var isActive = 1;
  }else{
    var isActive = 0;
  }

  changeSubstringSearchCheckbox(checkbox, isActive) 
}
function getSubstrSearchCheckbox()
{
  var checkbox = document.getElementById("substringSearchLabel");
  if (checkbox == undefined)
    return null;
  return checkbox;
}