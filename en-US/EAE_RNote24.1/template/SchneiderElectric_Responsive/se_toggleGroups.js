function r(f) {
  /in/.test(document.readyState) ? setTimeout('r(' + f + ')', 9) : f()
}
r(function() {
  if (AreHowToGroupsAvailable()) {
    buildToggleControl();
    hideToggleContainers();
    groupTitleClickEvent();
  }
});

function buildToggleControl() {
  var contentElement = document.getElementById("content_idx");
  if (contentElement != null && contentElement != undefined) {
    var controlContainer = document.createElement("div");
    controlContainer.classList.add("toggle_control");
    contentElement.insertBefore(controlContainer, contentElement.childNodes[0]);

    var buttonExpandAll = document.createElement("button");
    buttonExpandAll.classList.add("expandAll_toggle_containers");
    buttonExpandAll.addEventListener("click", function(element) {
      changeButtonState();
      showToggleContainers();
    });
    var textExpandAll = document.createTextNode("Expand All");
    buttonExpandAll.appendChild(textExpandAll);
    controlContainer.appendChild(buttonExpandAll);

    var buttonCollapseAll = document.createElement("button");
    buttonCollapseAll.classList.add("collapseAll_toggle_containers");
    buttonCollapseAll.classList.add("hideToggleControlButton");
    buttonCollapseAll.addEventListener("click", function() {
      changeButtonState();
      hideToggleContainers();
    });
    var textCollapseAll = document.createTextNode("Collapse All");
    buttonCollapseAll.appendChild(textCollapseAll);
    controlContainer.appendChild(buttonCollapseAll);
  }
}
function getToggleControlButtons() {
  // var toggleControl = document.getElementsByClassName("toggle_control")[0];
  var toggleControl = document.querySelector(".toggle_control");
  //var buttons = toggleControl.getElementsByTagName("button");
  if(toggleControl != null) {
	var buttons = toggleControl.querySelectorAll("button");
  console.log(buttons);
  return buttons;  
  };
}
function changeButtonState() {
  var buttons = getToggleControlButtons();
  for (var i = 0; i < buttons.length; i++) {
    if(buttons[i].className.indexOf("hideToggleControlButton") > -1){
      buttons[i].classList.remove("hideToggleControlButton")
    }else{
      buttons[i].classList.add("hideToggleControlButton")
    }
  }
}
function groupTitleClickEvent() {
  var groups = getHowToGroups();
  for (var i = 0; i < groups.length; i++) {
    var groupTitle = groups[i].firstElementChild;
    groupTitle.addEventListener("click", function(event) {
      changeStateToggleContainer(event.target);
    })
  }
}

function changeStateToggleContainer(groupTitle) {
  var toggleContainer = groupTitle.parentNode;
  if (toggleContainer.className.indexOf("howToGroups_hide") > -1) {
    showToggleContainer(toggleContainer);
  } else {
    hideToggleContainer(toggleContainer);
  }
}

function hideToggleContainer(element) {
  element.classList.add("howToGroups_hide")
}

function showToggleContainer(element) {
  element.classList.remove("howToGroups_hide")
}

function hideToggleContainers() {
  var groups = getHowToGroups();
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].className.indexOf("howToGroups_hide") < 0) {
      groups[i].classList.add("howToGroups_hide")
    }
  }
}

function showToggleContainers() {
  var groups = getHowToGroups();
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].className.indexOf("howToGroups_hide") > -1) {
      groups[i].classList.remove("howToGroups_hide")
    }
  }
}

function getToggleContainers() {
  var containers = [];
  var groups = getHowToGroups();
  for (var i = 0; i < groups.length; i++) {
	//containers.push(groups[i].getElementsByClassName("FM__p_toggle_container_group")[0])
    containers.push(groups[i].querySelector(".FM__p_toggle_container_group"));
  }
  return containers;
}

function getHowToGroups() {
  //var groups = document.getElementsByClassName("FM__p_howto_group");
  var groups = document.querySelectorAll(".FM__p_howto_group");
  if (groups.length > 0 ) {
    return groups
  }
}

function AreHowToGroupsAvailable() {
  if (getHowToGroups() != undefined && getHowToGroups() != null) {
    return getHowToGroups().length > 0
  }else{
    return false
  }
}
