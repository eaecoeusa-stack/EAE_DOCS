showHidePrintButtons();
var g_currentTopicHref;

//check if all needed functions for hierarchy print are supported
function canHierarchyPrint() {
  //return false to deactivate the enhancemnt for hierarchyPrint
  return false;
  if (isDocumentInWeb() && isTOCAvailable()) {
    return true;
  } else if (doesBrowserPrintSupport() && isTOCAvailable()) {
    return true;
  }
}

//check current browser
function doesBrowserPrintSupport() {
  if (isInternetExplorer()) {
    return false;
  } else if (document.querySelector("iframe.topic").contentDocument == null) {
    return false;
  } else {
    return true;
  }


}

//check if global var in external JS file for JSON is set
function isTOCAvailable() {
  if (typeof (g_SEToc) == "undefined" || g_SEToc == null || g_SEToc == "") {
    return false;
  } else {
    return true;
  }
}

//Show or hide Print Menu in HTML
function showHidePrintButtons() {
  //default print button; default navigation buttons
  var divDefaultPrint = document.querySelector("div.functionholder > .buttons.se_default_print");
  //new print button; default navigation buttons
  var divHierarchyPrint = document.querySelector("div.functionholder > .buttons.se_hierarchy_print");
  divHierarchyPrint.style.display = "none";
  setTimeout(function () {
    if (canHierarchyPrint()) {
      //hides default print button; shows only new print button and default navigation buttons
      divDefaultPrint.style.display = "none";
      divHierarchyPrint.style.display = "block";
      //dropdown option "print all topics"
      var optionPrintHierarchy = document.getElementById("print_hierarchy");
      //dropdown option "print current topic"
      var optionPrintTopic = document.getElementById("print_topic");
      //div for dropdown options
      var printOptionsDropdown = document.getElementById("printOptionsDropdown");
      //print button (opens dropdown menu)
      var openPrintOptionsDropdown = document.getElementById("btn_print_hierarchy");
      //show or hide dropdown menu
      openPrintOptionsDropdown.onclick = function () {
        if (printOptionsDropdown.classList.contains("show")) {
          printOptionsDropdown.classList.remove('show');
        } else {
          printOptionsDropdown.tabIndex = "1";
          printOptionsDropdown.focus();

          if (SE_mobileBrowserDetection()) {
            printOptionsDropdown.onblur = function () {
              printOptionsDropdown.classList.remove('show');
            }
          } else {
            printOptionsDropdown.onmouseleave = function () {
              printOptionsDropdown.classList.remove('show');
            }
          }
          printOptionsDropdown.classList.add('show');
        }
      }
      //print all topics, close dropdown after click
      optionPrintHierarchy.onclick = function () {
        printOptionsDropdown.classList.remove('show');
        printAllPages();
      };
      //print current topic (resp. use default print function), close dropdown after click
      optionPrintTopic.onclick = function () {
        printOptionsDropdown.classList.remove('show');
        window.print();
      };
    } else {
      //hides new print button; shows only dafult print button and default navigation buttons
      divHierarchyPrint.style.display = "none";
      divDefaultPrint.style.display = "block";

    }
  }, 1000);

}

//print all topics
function printAllPages() {
  var toc = LoadToc("toc");
  if (toc == null || typeof (toc) == 'undefined')
    return;
  g_currentTopicHref = window.location.href;
  var filename = getCurrentTopicFile();
  var subToc = findCurrentTOCEntry(toc, filename);
  BuildDocument(subToc, printDocument);
  BuildLoadingCircle();
}

//print only current topic (default function)
function printCurrentPage() {
  printDocument();
}

function BuildLoadingCircle() {
  var circleBody = document.createElement("div");
  circleBody.setAttribute("id", "circleBody");

  var circleCanvas1 = document.createElement("span");
  var circleCanvas2 = document.createElement("span");
  var circleCanvas3 = document.createElement("span");
  circleBody.appendChild(circleCanvas1);
  circleBody.appendChild(circleCanvas2);
  circleBody.appendChild(circleCanvas3);

  //get Header Element
  //var header = document.getElementsByClassName("header")[0];
  var header = document.querySelector(".header");
  header.appendChild(circleBody);
}

function closeLoadingCircle() {
  var loadingCircle = document.getElementById("circleBody");
  loadingCircle.remove();
}
//build document for iframe; load all elements into the document
function BuildDocument(toc, postaction) {
  this.htmlContent = "<html>";
  this.currentToc = toc;
  this.rootdone = false;
  this.callback = postaction;
  this.footerContent = "";
  this.ontopicloaded = function (topicFrame) {
    var topicDoc = topicFrame.contentDocument;
    if (this.rootdone == false) {
      //if this ist the first topic, add head element and get breadcrumbs and footer
      this.htmlContent += getHeadContent(topicDoc.head);
      this.htmlContent += "<body>";
      this.htmlContent += getBreadcrumb(topicDoc.body);
      this.footerContent = getFooterContent(topicDoc.body);
      this.rootdone = true;
    }
    //collect all content into htmlContent
    this.htmlContent += getBodyContent(topicDoc.body);
    topicFrame.remove();
    var tocentry = this.getNextTocEntry(this.currentToc.nodes);
    if (tocentry == null) {
      //if no tocentry is left, set footer and end html-tag
      htmlContent += this.footerContent;
      htmlContent += "</body>";
      htmlContent += "</html>";
      this.callback(htmlContent);
    } else {
      tocentry.done = true;
      loadTopicFile(tocentry.url, this.ontopicloaded);
    }
  }
  this.getNextTocEntry = function (tocentries) {
    if (typeof (tocentries) == 'undefined')
      return null;
    for (var i = 0; i < tocentries.length; i++) {
      if (typeof (tocentries[i].done) == 'undefined' || tocentries[i].done != true) {
        return tocentries[i];
      }
      if (typeof (tocentries[i].nodes) != 'undefined') {
        var tocentryfound = this.getNextTocEntry(tocentries[i].nodes);
        if (tocentryfound != null) {
          return tocentryfound;
        }
      }
    }
    return null;
  }
  this.currentToc.done = true;
  loadTopicFile(toc.url, this.ontopicloaded);
}

//get breadcrumb element from document
function getBreadcrumb(bodyContent) {
  var breadcrumbDivElement = bodyContent.querySelector("div > p.pt_breadcrumbs");
  if (typeof (breadcrumbDivElement) != "undefined") {
    return fixReferencesForPrint(breadcrumbDivElement.outerHTML);
  } else {
    return "";
  }
}
//get footer element from document
function getFooterContent(rootBodyContent) {
  var footerDivElement = rootBodyContent.querySelector("div.pt_footer").outerHTML;
  if (typeof (footerDivElement) != "undefined") {
    return fixReferencesForPrint(footerDivElement);
  } else {
    return "";
  }

}
//get head element from document
function getHeadContent(rootHeadContent) {
  return fixReferencesForPrint(rootHeadContent.outerHTML);
}
//get content-div element from document
function getBodyContent(bodyContent) {
  if (bodyContent != null) {
    var contentDivElements = bodyContent.querySelectorAll("div#content_idx");
    var contentDiv = "";
    for (var i = 0; i < contentDivElements.length; i++) {
      contentDiv += contentDivElements[i].outerHTML;
    }
    return fixReferencesForPrint(contentDiv);
  }
}

//fix all paths by deleting "../" inside of it
function fixReferencesForPrint(element) {
  element = element.split("../").join("");
  var tempElement = document.createElement("div");
  tempElement.innerHTML = element;
  var modifiedElement = modifyImgSrc(tempElement);
  element = modifiedElement.innerHTML;
  return element;
}

//print iframe
function printDocument(domstring) {
  if (typeof (domstring) == 'undefined')
    window.print();
  else {
    var printframes = document.querySelectorAll("iframe.printer");
    for (var i = 0; i < printframes.length; i++) {
      printframes[i].remove();
    }
    var printframe = document.createElement("iframe");
    printframe.className = "printer";
    var bodyContainer = document.querySelector("body.media-desktop") || document.querySelector("body.media-landscape") || document.querySelector("body.media-mobile");
    bodyContainer.appendChild(printframe);

    //in IE the iframe needs to be focused
    if (isInternetExplorer()) {
      printframe.addEventListener('load',
        function () {
          // modifyImgSrc(printframe.contentDocument.body);
          onPrintContentLoaded(this);
        }
      );
      printframe.addEventListener('focus',
        function () {

          printframe.contentWindow.print();
          printframe.contentWindow.close();
          printframe.remove();
          window.location.href = g_currentTopicHref.split("index.htm")[0] + modifyCurrentPath(window.location.href) + "?rhfulllayout=true";
        }
      );
      closeLoadingCircle();
    }
    var printdoc = printframe.contentDocument;
    printdoc.open();
    printdoc.write(domstring);
    printdoc.close();
    if (!isInternetExplorer()) {
      printframe.onload = function () {
        // modifyImgSrc(printframe.contentDocument.body);
        printframe.contentWindow.print();
        printframe.contentWindow.onfocus = function () {
          printframe.contentWindow.close();
          printframe.remove();
          window.location.href = g_currentTopicHref.split("index.htm")[0] + modifyCurrentPath(window.location.href) + "?rhfulllayout=true";
        }
      }

      closeLoadingCircle();
    }
  }
}

//replace img references in topic
function modifyImgSrc(container) {
  var hash = window.location.hash;
  var hashDecode = decodeURIComponent(hash);
  var path = "";
  var topicHash = "";
  var topicPath = "";
  if (topicHash.indexOf("#t=") > -1) {
    topicHash = hashDecode.split("&")[0];
    topicPath = topicHash.replace("#t=", "");
  } else {
    topicHash = hashDecode.split("&t=")[hashDecode.split("&t=").length - 1];
    topicPath = topicHash.split("&")[0];
  }
  path = topicPath.substring(0, topicPath.lastIndexOf("/") + 1);

  var images = container.querySelectorAll("img[src]");
  for (var i = 0; i < images.length; i++) {
    images[i].src = images[i].attributes.src.value.substring(0, 0) + path + images[i].attributes.src.value.substring(0);
  }
  return container;
}
//set focus to iframe
function onPrintContentLoaded(frame) {
  if (frame.contentWindow) {
    frame.contentWindow.focus();
  } else if (frame.contentDocument && frame.contentDocument.documentElement) {
    // For old versions of Safari
    frame.contentDocument.documentElement.focus();
  }

}

//find current tocentry and check if this entry has nodes
function findCurrentTOCEntry(tocentries, currentFileName) {
  for (var i = 0; i < tocentries.length; i++) {
    if (tocentries[i].url == currentFileName) {
      return tocentries[i];
    }
    if (typeof (tocentries[i].nodes) != 'undefined') {
      var tocentryfound = findCurrentTOCEntry(tocentries[i].nodes, currentFileName);
      if (tocentryfound != null) {
        return tocentryfound;
      }
    }
  }
  return null;
}

//return only the path after the host and delete any anchors
function modifyCurrentPath(currentURL) {
  if (currentURL.split("#t=").length > 1) {
    var path = currentURL.split("#t=")[1];
  } else if (currentURL.split("&t=").length > 1) {
    var path = currentURL.split("&t=")[1];
  } else if (currentURL.split("?t=").length > 1) {
    var path = currentURL.split("?t=")[1];
  } else {
    console.log("WARNING: can't find current path in URL parameter 't'. Current page will printed");
    return "";
  }
  path = decodeURIComponent(path);
  path = path.split("&")[0];
  path = path.split("#")[0];
  path = path.split("?")[0];
  return path;
};
//get current path for merging the right position in toc
function getCurrentTopicFile() {
  return modifyCurrentPath(window.location.href);
}

//iframe to load content from document into
function loadTopicFile(fileName, ontopicloaded) {
  var iframe = document.querySelector("iframe.topicloader");
  if (!document.querySelectorAll("iframe.topicloader").length > 0) {
    iframe = document.createElement("iframe");
    iframe.className = "topicloader";

    var bodyContainer = document.querySelector("body.media-desktop") || document.querySelector("body.media-landscape") || document.querySelector("body.media-mobile");
    bodyContainer.appendChild(iframe);
  }
  iframe.addEventListener('load',
    function () {
      ontopicloaded(this);
    }
  );
  iframe.src = fileName;
}

//get JSON form JSONTOC.js
function LoadToc(toc) {
  var toc = g_SEToc;
  initializeToc(toc);
  return toc;
}

function initializeToc(toc) {
  initializeTocEntries(toc)
  return toc;
}

function initializeTocEntry(toc) {
  if (typeof (toc) == 'undefined' || toc == null)
    return;
  toc.done = false;
  if (typeof (toc.nodes) == 'undefined') {} else {
    initializeTocEntries(toc.nodes);
  }
}

function initializeTocEntries(tocentries) {
  if (typeof (tocentries) == 'undefined' || tocentries == null)
    return;
  for (var i = 0; i < tocentries.length; i++)
    initializeTocEntry(tocentries[i]);
}