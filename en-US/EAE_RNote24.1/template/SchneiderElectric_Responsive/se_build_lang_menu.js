document.addEventListener("DOMContentLoaded", function (event) {
  var g_se_installedLangs = g_se_helpBrickConfig.getInstalledLanguagesFromHelpBook();
  var g_se_currentLanguage = findCurrentLanguage(g_se_helpBrickConfig.getInstalledLanguagesFromHelpBook());
  buildLanguageDropdown();

  function buildLanguageDropdown() {
    if (checkConfigFile()) {
      buildLangDropdownHead(g_se_installedLangs, g_se_currentLanguage);
    }
  }

  function checkConfigFile() {
    if (typeof (g_se_helpBrickConfig) == 'undefined' || g_se_helpBrickConfig == null) {
      return false;
    } else {
      return true;
    }
  }

  function buildLangDropdownHead(installedLangs, currentLanguage) {
    var dropDownHeadElement = document.getElementById("se_language_menu_Head");
    dropDownHeadElement.onclick = function () {
      buildLangDropdownEntries(installedLangs, currentLanguage);
      showHideLanguageDropdown()
    };
    dropDownHeadElement.innerText = currentLanguage;
  }

  function showHideLanguageDropdown() {
    var dropdownMenu = document.getElementById("lp_language_navigation");
    if (dropdownMenu.classList.contains("show")) {
      dropdownMenu.classList.remove("show");
    } else {
      dropdownMenu.classList.add("show");
      dropdownMenu.focus();
    }
  }

  function buildLangDropdownEntries(installedLangs, currentLang) {
    var langDropdown = document.getElementById("lp_language_navigation");
    langDropdown.innerHTML = "";
    if (installedLangs.length == 1 && installedLangs[0] == currentLang) {
      var li = document.createElement("li");
      var a_li = document.createElement("a");
      a_li.innerText = installedLangs[0];
      a_li.href = currentURL();
      li.appendChild(a_li);
      langDropdown.appendChild(li);
    } else {
      for (i = 0; installedLangs.length > i; i++) {
        if (installedLangs[i] != currentLang) {
          var li = document.createElement("li");
          var a_li = document.createElement("a");
          a_li.innerText = installedLangs[i];
          a_li.href = URLForLanguage(installedLangs[i], currentLang);
          a_li.setAttribute("target", "_self");
          li.appendChild(a_li);
          langDropdown.appendChild(li);
        }
      }
    }

    langDropdown.tabIndex = "1";
    langDropdown.focus();

    var langDropdownHead = document.getElementById("lp_language_navigationHeader");
    if (SE_iOSBrowserDetection()) {
      langDropdown.onclick = function (e) {
        langDropdown.tabIndex = "1";
        langDropdown.focus();
        langDropdown.onblur = function () {
          langDropdown.classList.remove("show");
        }
      }
    } else if (SE_mobileBrowserDetection()) {
      langDropdownHead.onclick = function (e) {
        langDropdown.tabIndex = "1";
        langDropdown.focus();
        langDropdown.onblur = function () {
          langDropdown.classList.remove("show");
        }
      }
    } else {
      langDropdown.onmouseleave = function () {
        langDropdown.classList.remove("show");
      }
    }


  }

  function findCurrentLanguage() {
    var urlBookname = "/" + getBooknameFromURL();
    var urlFromPath = currentURL().split(urlBookname)[currentURL().match(new RegExp(urlBookname, "g")).length -1].split("/");
    urlFromPath = urlFromPath[urlFromPath.length - 1];
    return urlFromPath;
  }

  function currentURL() {
    return window.location.href;
  }

  function currentPath() {
    if (window.location.origin != null && window.location.origin != "null")
      return window.location.origin + window.location.pathname;
    else
      return window.location.pathname;
  }

  function URLForLanguage(language, currentLanguage) {
    var modCurrentLanguage = "/" + currentLanguage + "/"
    //change language code in url
    var modLanguage = "/" + language + "/"
    var path = currentPath();
    path = path.split(modCurrentLanguage).join(modLanguage);
    var rhmapid = getRhMapId();
    if (rhmapid === "?rhmapid=") {
      path = currentURL().split(modCurrentLanguage).join(modLanguage);
    } else {
      path = path + rhmapid;
    }
    return path;
  }

  function getRhMapId() {
    var xrefParam = "";
    try {
      var topicIframe = document.getElementsByTagName("iframe")[0];
      var docTopicIframe = topicIframe.contentWindow.document;
      xrefParam = getXrefId(docTopicIframe);
    } catch (e) {
      xrefParam = getNestedRhMapIdFromUrl();
    }
    return "?rhmapid=" + xrefParam;
  }

  function getXrefId(fromNode) {
    var xrefId = "";
    try {
      var xrefAnchor = fromNode.querySelector("[name^=XREF_]");
      var anchorId = xrefAnchor.getAttribute("name");
      xrefId = anchorId.split("XREF_")[1];
    } catch (e) {}
    return xrefId;
  }

  function getNestedRhMapIdFromUrl() {
    var nestedRhMapId = "";
    try {
      var anchorId = getCurrentAnchorFromUrl();
      var topicIframe = document.getElementsByTagName("iframe")[0];
      var docTopicIframe = topicIframe.contentWindow.document;
      if (docTopicIframe != null) {
        var anchors = docTopicIframe.querySelectorAll("[name^=" + anchorId + "]");
        if (anchors.length == 0)
          return nestedRhMapId;
        var anchor = anchors[0];
        var anchorParent = anchor.parentElement;
        nestedRhMapId = getXrefId(anchorParent);
      }
    } catch (e) {}
    return nestedRhMapId;
  }

  function getCurrentAnchorFromUrl() {
    var anchorId = "";
    try {
      var path = decodeURIComponent(currentURL());
      path = path.split("?")[1];
      path = path.split("&")[0];
      path = path.split("#")[2];
      if (path.includes("bc-"))
        path = path.split("bc-")[0];
      anchorId = path;
    } catch (e) {}
    return anchorId;
  }
});