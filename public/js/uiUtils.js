// uiUtils.js
export function setupScoreDisplay(board, p, local = true) {
    var div = document.getElementById('scoreDisplay');
    let titleAnchor = document.createElement("a");
    titleAnchor.setAttribute("href", "/html/index.html");
    let title = document.createElement('h1');
    title.setAttribute("class", "title");
    title.setAttribute("id", "h1-title");
    title.innerText = "Square-Off";
    titleAnchor.appendChild(title)
    div.appendChild(titleAnchor);

    if (local) {
        board.players.forEach(player =>{

            addPlayerDisplay(board, player, p);
            
          });
    }
}

export function resetScoreDisplay(board) {
    board.players.forEach(player => {
      let playerNameId = "playerName" + player.id;
      let playerDivId = 'player' + player.id + "div";
  
      let scoreDisplayId = "scoreDisplay" + player.id;
      let multDisplayId = "multDisplay" + player.id;
  
      // Update score and multiplier display
      document.getElementById(scoreDisplayId).innerText = player.getScoreDisplay();
      document.getElementById(multDisplayId).innerText = player.getMultiplierDisplay();
  
      // Highlight the current player
      if (player === board.current_player) {
        document.getElementById(playerDivId).style.backgroundColor = player.fillStyle;
        document.getElementById(playerNameId).style.color = "#ffffff";
        document.getElementById(scoreDisplayId).style.color = "#ffffff";
        document.getElementById(multDisplayId).style.color = "#ffffff";
      } else {
        document.getElementById(playerDivId).style.backgroundColor = "#dcdcdc";
        document.getElementById(playerNameId).style.color = "#000000";
        document.getElementById(scoreDisplayId).style.color = "#000000";
        document.getElementById(multDisplayId).style.color = "#000000";
      }
    });
  }

export function addPlayerDisplay(board, player, p){

    var div = document.getElementById('scoreDisplay');
    player.sprites = new p.Group();
    // create button toggle
    let button = document.createElement('button');
    let button_id = '#b'+player.id;
    button.setAttribute("id", button_id);
    button.setAttribute("class", "line-button");
    button.style.backgroundColor = player.outlineFillstyle;
    button.addEventListener("click", lineToggle, false);
    button.player = player;
    button.color = player.outlineFillstyle;
    button.p = p;

    function lineToggle(evt){
        evt.currentTarget.player.lineToggle = !evt.currentTarget.player.lineToggle;
        if(evt.currentTarget.player.lineToggle == false){

          player.sprites.visible = false;
          button.style.backgroundColor = '#DCDCDC'
          button.style.setProperty("--color", evt.currentTarget.color);
          button.style.outlineColor = evt.currentTarget.color;
        }
        else {
          player.sprites.visible = true;
          button.style.backgroundColor = evt.currentTarget.color;
          button.style.setProperty("--color", "#DCDCDC");
          button.style.outlineColor = "#dcdcdc";

        };
        evt.currentTarget.p.redraw();
      };
    let playerDivId = 'player'+player.id + "div";
    let playerDiv = document.createElement('div');
    playerDiv.setAttribute("class", "player-div");
    playerDiv.setAttribute("id", playerDivId);
    // Setup left and right divs
    let leftDiv = document.createElement('div');
    leftDiv.setAttribute("class", "player-div-left");
    let rightDiv = document.createElement('div');
    rightDiv.setAttribute("class", "player-div-right");

    // Initialize display info
    let playerNameId = "playerName" + player.id;
    let playerName = document.createElement('h3');
    playerName.setAttribute("class", "player");
    playerName.setAttribute("id", playerNameId);
    // playerName.innerText = "Player " + player.id.toString(10);
    playerName.innerText = player.name;

    let scoreDisplayId = "scoreDisplay" + player.id;
    let scoreDisplay = document.createElement('h3');
    scoreDisplay.setAttribute("class", "player");
    scoreDisplay.setAttribute("id", scoreDisplayId);
    scoreDisplay.innerText = player.getScoreDisplay();
    
    let multDisplayId = "multDisplay" + player.id;
    let multDisplay = document.createElement('h3');
    multDisplay.setAttribute("class", "player");
    multDisplay.setAttribute("id", multDisplayId);
    multDisplay.innerText = player.getMultiplierDisplay();

    // add items to left div  
    leftDiv.appendChild(playerName);
    leftDiv.appendChild(button);
    // add items to right div  
    rightDiv.appendChild(scoreDisplay);
    rightDiv.appendChild(multDisplay);
    // Add left and right divs to player div
    playerDiv.appendChild(leftDiv);
    playerDiv.appendChild(rightDiv);
    // add player div to score div
    div.appendChild(playerDiv);
    
    if(player.id == board.current_player.id){
      playerDiv.style.backgroundColor = player.fillStyle;
      document.getElementById(playerNameId).style.color = "#ffffff";
      document.getElementById(scoreDisplayId).style.color = "#ffffff";
      document.getElementById(multDisplayId).style.color = "#ffffff";

    
    }
    else{
      playerDiv.style.backgroundColor = "#dcdcdc";
      document.getElementById(playerNameId).style.color = "#000000";
      document.getElementById(scoreDisplayId).style.color = "#000000";
      document.getElementById(multDisplayId).style.color = "#000000";
    };

  }
