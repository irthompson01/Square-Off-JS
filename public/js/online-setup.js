function createRoom() {
  // <! -- Redirect to host.html -->

  let baseLink = location.href.split("html/online-setup")[0];
  baseLink = baseLink.replace("www.", "");
  let link = baseLink + "html/host.html";

  location.assign(link);
}

function joinRoom() {
  let baseLink = location.href.split("html/online-setup")[0];
  baseLink = baseLink.replace("www.", "");
  console.log(baseLink);
  let input = document.getElementById("room-input").value;
  // split the input on ?= to get the room id
  let roomId = input.split("?=").pop();

  // console.log(input)

  let link = baseLink + "html/guest.html?=" + roomId;

  location.assign(link);
  console.log(location.href);
}
