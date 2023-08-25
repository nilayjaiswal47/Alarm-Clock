// refrences
let currentTimer = document.querySelector(".current-time");

const hoursInput = document.querySelector(".alarm-hours");
const minuteInput = document.querySelector(".alarm-minutes");
const secondsInput = document.querySelector(".alarm-seconds");

const setAlarmBtn = document.querySelector(".set-alarm-btn");
const deleteAllBtn = document.querySelector(".delete-all-btn");

const stopAlarmContainer = document.querySelector(".stop-alarm-container");
const alarmContainer = document.querySelector(".display-alarms-container");
const alarmsList = document.querySelector(".alarm-list");
const stopAlarmTime = document.querySelector(".stop-alarm-time");

const alarmAudio = new Audio("Alarm-ringtone.mp3");

// appending Zero for alarms list
const appendZero = (value) => (value < 10 ? "0" + value : value);

// setting time for display
const currentTime = function () {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];
  currentTimer.textContent = `${hours}:${minutes}:${seconds}`;

  alarmsArray.forEach((alarm) => {
    if (alarm.active) {
      if (alarm.time === `${hours}:${minutes}:${seconds}`) {
        alarmAudio.play();
        alarmAudio.loop = true;
        stopAlarmContainer.style.display = "flex";
        stopAlarmTime.innerText = `${alarm.time}`;
      }
    }
  });
};
// storing alarm in arrays
let alarmsArray = [];

// object for alarm details
const alarmObject = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  active: true,
  id: ``,
  time: "00:00:00",
};
// updating alarm list
function updateUI(arr) {
  let html;
  arr.forEach((alarm) => {
    html = `<li class="${alarm.id}-alarm" id="${alarm.id}">
          <div class="alarm-timer-${alarm.id}">${alarm.time}
    </div>
          <div class="toggle-container" id="${alarm.id}">
            <input type="checkbox" id="toggle-btn-${alarm.id}" checked />
            <label
              for="toggle-btn-${alarm.id}"
              class="toggle-btn-label label-${alarm.id}"
              onclick="toggleButton(event)"
            ></label>
          </div>
          <button class="delete-alarm-btn" id="${alarm.id}" onclick="deleteButton(event)">
            <i class="fa-solid fa-trash"></i>
          </button>
          </li>`;
  });
  alarmContainer.style.opacity = 1;
  alarmsList.insertAdjacentHTML("afterbegin", html);
}

let alarmIndex = 0;

alarmContainer.style.opacity = 0;
alarmsList.innerHTML = "";
deleteAllBtn.style.display = "none";
stopAlarmContainer.style.display = "none";

// setting alarm
setAlarmBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //   checking input conditions
  if (
    hoursInput.value >= 0 &&
    hoursInput.value <= 23 &&
    minuteInput.value >= 0 &&
    minuteInput.value <= 59 &&
    secondsInput.value >= 0 &&
    secondsInput.value <= 59
  ) {
    const alarmExist = alarmsArray.find((alarm) => {
      return (
        alarm.hours === +hoursInput.value &&
        alarm.minutes === +minuteInput.value &&
        alarm.seconds === +secondsInput.value
      );
    });
    // checking if alarm already exist or not
    if (alarmExist) {
      alert("Alarm already exists!!!");
      hoursInput.value = minuteInput.value = secondsInput.value = "";
    } else {
      // copying data to object
      alarmIndex++;
      alarmObject.hours = +hoursInput.value;
      alarmObject.minutes = +minuteInput.value;
      alarmObject.seconds = +secondsInput.value;
      alarmObject.active = true;
      alarmObject.id = `${alarmIndex}_${hoursInput.value}_${minuteInput.value}_${secondsInput.value}`;
      alarmObject.time = `${appendZero(+hoursInput.value)}:${appendZero(
        +minuteInput.value
      )}:${appendZero(+secondsInput.value)}`;
      // pushing object copy to array
      alarmsArray.push({ ...alarmObject });
      // updating UI
      updateUI(alarmsArray);
      hoursInput.value = minuteInput.value = secondsInput.value = "";

      // getting visible delete all button
      deleteAllBtn.style.display = "block";
    }
  }
  //   if alarm is not valid
  else {
    alert("Not a valid Time!!!");
    e.preventDefault();
    // claering input feild for setting alarm
    hoursInput.value = minuteInput.value = secondsInput.value = "";
  }
});

// for delete button in alarms list
function deleteButton(e) {
  e.preventDefault();
  // finding id of particular  element
  let searchID = e.target.parentElement.getAttribute("id");
  // removing alarm in alarmsArray
  alarmsArray = alarmsArray.filter((alarmArr) => alarmArr.id !== searchID);
  // removing alarm from UI
  e.target.parentElement.parentElement.remove();
  // for hiding alarms list if 0 alarms are there
  if (alarmsArray.length === 0) {
    alarmContainer.style.opacity = 0;
    alarmsList.innerHTML = "";
    deleteAllBtn.style.display = "none";
  }
}

// for toggle button in alarms list
function toggleButton(e) {
  console.log("!working");
  // finding id of particular  element
  let searchID = e.target.parentElement.getAttribute("id");
  // for making active and inactive alarms
  let alarm = alarmsArray.find((alarm) => alarm.id === searchID);
  if (alarm.active === true) alarm.active = false;
  else alarm.active = true;
}

// delete all button
deleteAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // clearing alarm from array
  alarmsArray = [];
  alarmContainer.style.opacity = 0;
  alarmsList.innerHTML = "";
  deleteAllBtn.style.display = "none";
});

// for stopping alarm
function stopAlarm(e) {
  e.preventDefault();
  alarmAudio.pause();
  stopAlarmContainer.style.display = "none";
}

setInterval(currentTime, 1000);
