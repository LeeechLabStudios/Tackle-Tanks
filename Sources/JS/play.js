var host_data = {
  com: "mapvote",
  ms: "small",
  sm: "grasslands",
  gm: "teamdeathmatch",
  tl: 15,
  noppt: 100,
  syt: true,
  at: "101112131415161718192021222324",
  bots: true,
  ds: false,
  hm: true,
  ppg: true,
  supposed_2_B_peer: false,
  room_name: "",
};
var exit = true;
var checker = false;
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDM;
const DBDeleteRequest = indexedDB.deleteDatabase("c3-localstorage-29j20n49g4z");
const DBDeleteRequest2 = indexedDB.deleteDatabase(
  "c3-localstorage-7d0thul63rw"
);
window.addEventListener('beforeunload', (event) => {
  if (exit){
    event.preventDefault();
    event.returnValue = '';
  }
});
DBDeleteRequest.onsuccess = function (event) {
  const request = indexedDB.open("c3-localstorage-29j20n49g4z", 2);
  var data = JSON.parse(localStorage.getItem("TT_Data"));
  var data = JSON.stringify(data).replace(/\"/g, "'");
  request.onerror = function (event) {};
  request.onupgradeneeded = function (event) {
    const db = request.result;
    db.createObjectStore("keyvaluepairs", {
      autoIncrement: false,
    });
  };
  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("keyvaluepairs", "readwrite");
    const store = transaction.objectStore("keyvaluepairs");
    store.add(data, "a1");
    host_data["room_name"] = "";
    SAVE_LINE("host_data", host_data);
    transaction.oncomplete = function () {
      db.close();
    };
  };
};
function ScrapAdder() {
  return new Promise(function (resolve) {
    var open = indexedDB.open("c3-localstorage-29j20n49g4z", 2);
    open.onsuccess = function () {
      const db = open.result;
      const transaction = db.transaction("keyvaluepairs", "readwrite");
      const store = transaction.objectStore("keyvaluepairs");
      store.get("Scraps").onsuccess = function (event) {
        var b = event.target.result;
        if (checker == false){
          if (b != null){
            SAVE_LINE("Score", Math.round(GET_FILE("Score") + b-1));
            store.delete("Scraps");
          }
          checker = true;
        }
      };
      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}
function Leave() {
  return new Promise(function (resolve) {
    var open = indexedDB.open("c3-localstorage-29j20n49g4z", 2);
    open.onsuccess = function () {
      const db = open.result;
      const transaction = db.transaction("keyvaluepairs", "readwrite");
      const store = transaction.objectStore("keyvaluepairs");
      store.get("leaveReason").onsuccess = function (event) {
        var b = event.target.result;
        if (b != null){
          exit = false;
          if (b != "game done") {
            if (b.includes("disconnect")) {
              host_data["room_name"] = "Disconnected from Signaling Server!";
            } else if (b.includes("Host kicked")) {
              host_data["room_name"] = "Host kicked you!";
            } else if (b.includes("own volition")) {
              host_data["room_name"] = "";
            } else if (b.includes("host new game not detected")) {
              host_data["room_name"] = "Host new game not detected (Rare Error!)";
            }else{
              host_data["room_name"] = "An error has occurred!";
            }
            SAVE_LINE("host_data", host_data);
            window.location.href = "index.html";
          }else{
            let data = ScrapAdder();
          }
        }
        store.delete("leaveReason");
        return resolve(event);
      };
      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}
function SAVE_LINE(id, data) {
  var change = JSON.parse(localStorage.getItem("TT_Data"));
  change[id] = data;
  localStorage.setItem("TT_Data", JSON.stringify(change));
}
function GET_FILE(id) {
  var data = JSON.parse(localStorage.getItem("TT_Data"));
  return data[id];
}
async function endless_checker() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    checker = false;
    exit = true;
    let leave = await Leave();
  }
}
document.getElementById("wrapper").src = "Game/game.html";
endless_checker();
