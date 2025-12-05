// html 요소 가져오기
let input = document.querySelector("input");
let button = document.querySelector("#searchBtn");
let place = document.querySelector("#location");
let tempEls = document.querySelectorAll("li .temp");
let iconEls = document.querySelectorAll("li img");
let timeEls = document.querySelectorAll("li p");

// api key
let APIkey = "e6e537c91b0474fb5a8c3cf6964f06fe";

// 현재 위치를 기반으로 날씨 가져오기
getLocation(); // 함수호출

function getLocation() {
  navigator.geolocation.getCurrentPosition(success);
}

async function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat, lon);

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
  );

  let data = await response.json();
  //   console.log(data);
  render(data);
}
// 도시 이름 검색
weather = async (cityname) => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
  );
  let data = await response.json();
  console.log(data);

  render(data);
};
button.addEventListener("click", () => {
  //   console.log("클릭");
  let city = input.value;
  //   console.log(city);
  input.value = ""; //아무것도 안넣는다는 뜻
  weather(city);
});
//   검색 버튼을 마우스로 굳이 누르지 않고 검색하고 싶은 도시 이름 입력 후 엔터키로 바로 검색하게 할 수 있는 함수 (숫자맞추기 게임에 있음 input 태그로)
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    // 만약 이벤트에 해당한 키가 엔터와 같다면
    city = input.value;
    console.log(city);
    input.value = "";
    weather(city);
    //  input.value = "" weather(city) == 전에 검색한거 지우고 검색한 도시의 날씨 보여줌 / 여기까지 이름이랑 날씨 아이콘은 바뀌는데 밑에 차트는 검색한 도시로 안바뀜
  }
});

// 화면에 날씨 정보 나타냄

function render(data) {
  console.log("render", data);
  place.textContent = data.city.name;

  //   차트 만들기
  let temps = []; //[온도 들어갈것]
  let labels = []; // [시간 들어갈것]

  for (let i = 0; i < tempEls.length; i++) {
    // 온도
    // console.log(data.list[i].main.temp);
    let temp = Math.round(data.list[i].main.temp); //Math.round = 소수점 없애기
    tempEls[i].textContent = temp;

    // 아이콘
    let icon = data.list[i].weather[0].icon;
    console.log(icon);
    let iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
    iconEls[i].src = iconUrl;
    // 시간
    let label = data.list[i].dt_txt.slice(11, 16 - 1); //11번째부터 16번째 이전까지 불러옴
    console.log(label);
    timeEls[i].textContent = label;

    // 온도를 temps 배열에 추가
    // 시간을 labels 배열에 추가
    temps.push(temp);
    labels.push(label);
  }
  //   그래프함수 호출(온도, 시간)
  drawChart(labels, temps);
}

let chart; //차트라는 변수 선언

function drawChart(labels, temps) {
  //   console.log("차트");
  let ctx = document.querySelector("#weatherChart").getContext("2d");

  if (chart) {
    chart.destroy(); //기존차트 삭제
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // x축 시간
      datasets: [
        {
          label: "시간별 온도",
          data: temps,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          //   beginAtZero: true,
          min: 0,
          max: 20,
          ticks: {
            stepSize: 5,
          },
          title: {
            display: true,
            text: "온도",
            color: "orange",
            font: {
              size: 14,
            },
          },
        },
      },
    },
  });
}
