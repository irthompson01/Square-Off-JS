function displayRadioValue() {
  var ele = document.getElementsByName("players");
  let numPlayers;
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      numPlayers = ele[i].value;
      // console.log(numPlayers);
    }
  }
  let defaultColors = [
    "#0583D2",
    "#FF3131",
    "#50C878",
    "#ee8329",
    "#9933ff",
    "#66ffff",
    "#ff99ff",
    "#006600",
    "#990000",
    "#3333ff",
  ];
  let datalist = document.createElement("datalist");
  datalist.setAttribute("id", "presets");
  for (i = 0; i < defaultColors.length; i++) {
    let option = document.createElement("option");
    option.value = defaultColors[i];
    datalist.appendChild(option);
  }

  let currPlayerInputs = document.getElementsByClassName("player-input");
  //console.log(currPlayerInputs.length);
  var div = document.getElementById("all-player-inputs");

  if (numPlayers > currPlayerInputs.length) {
    for (i = currPlayerInputs.length + 1; i <= numPlayers; i++) {
      console.log(i);
      let divInput = document.createElement("div");
      divInput.setAttribute("class", "player-input");

      let textInput = document.createElement("input");
      textInput.setAttribute("class", "player-text");
      let textId = "player-text-" + i.toString(10);
      textInput.setAttribute("id", textId);
      textInput.setAttribute("type", "text");
      let length = textInput.value.length;
      textInput.setSelectionRange(length, length);
      let value = "Player" + i.toString(10);
      textInput.setAttribute("value", value);

      let colorInput = document.createElement("input");
      colorInput.setAttribute("class", "player-color");
      let colorId = "player-color-" + i.toString(10);
      colorInput.setAttribute("id", colorId);
      colorInput.setAttribute("type", "color");
      colorInput.setAttribute("value", defaultColors[i - 1]);
      colorInput.setAttribute("list", "presets");

      divInput.appendChild(textInput);
      divInput.appendChild(colorInput);
      divInput.appendChild(datalist);

      div.appendChild(divInput);
    }
  } else if (numPlayers < currPlayerInputs.length) {
    for (i = 0; i < currPlayerInputs.length - numPlayers; i++) {
      div.removeChild(div.lastChild);
    }
  }
}

function darkenColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R / 10) * 10;
  G = Math.round(G / 10) * 10;
  B = Math.round(B / 10) * 10;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function setPlayerInputs() {
  let boardSize = document.getElementById("boardSizeSelect").value;
  let timer = document.getElementById("timerSelect").value;
  sessionStorage.setItem("boardSize", boardSize);
  sessionStorage.setItem("timer", timer);

  // get num players
  var ele = document.getElementsByName("players");
  let numPlayers;
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      numPlayers = ele[i].value;
    }
  }

  sessionStorage.setItem("numPlayers", numPlayers);

  // Set player data
  let playerData = [];

  for (i = 0; i < numPlayers; i++) {
    let textId = "player-text-" + (i + 1).toString(10);
    let colorId = "player-color-" + (i + 1).toString(10);

    let name = document.getElementById(textId).value;
    let color = document.getElementById(colorId).value;
    let outlineColor = darkenColor(color, -30);

    playerData.push([name, [outlineColor, color]]);
  }

  sessionStorage.setItem("playerData", JSON.stringify(playerData));
}
