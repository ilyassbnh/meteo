function GetInfo() {
    const newName = document.getElementById("cityInput").value;
    const cityName = document.getElementById("cityName");
    cityName.innerHTML = "--" + newName + "--";

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + newName + "&appid=a987af9b8821469fce7c51e760858a2d")
        .then(response => response.json())
        .then(data => {
    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i + 1)).innerHTML = weekday[Checkday(i)];
        document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min:" + Number(data.list[i].main.temp_min - 273.15).toFixed(1) + "°";
        document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max:" + Number(data.list[i].main.temp_max - 273.15).toFixed(1) + "°";
    }
    for (let i = 0; i < 5; i++) {
        document.getElementById("img" + (i + 1)).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
    }
})

        .then(data => {
            for (let i = 0; i < 5; i++) {
                document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min:" + Number(data.list[i].main.temp_min - 273.15).toFixed(1) + "°";
            }
            for (let i = 0; i < 5; i++) {
                document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max:" + Number(data.list[i].main.temp_max - 273.15).toFixed(1) + "°";
            }
            for (let i = 0; i < 5; i++) {
                document.getElementById("img" + (i + 1)).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
            }
        })
        .catch(err => alert("something went wrong"));
}

function defaultScreen() {
    document.getElementById("cityInput").defaultValue = "London";
    GetInfo();
}

const d = new Date();
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Checkday(day) {
    if (day + d.getDay() > 6) {
        return day + d.getDay() - 7;
    } else {
        return day + d.getDay();
    }
}

for (let i = 0; i < 5; i++) {
    document.getElementById("day" + (i + 1)).innerHTML = weekday[Checkday(i)];
}
