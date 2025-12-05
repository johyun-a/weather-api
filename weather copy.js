// ========================================
// 1. HTML 요소들을 JavaScript 변수로 가져오기
// ========================================

// document: HTML 문서 전체를 의미하는 객체
// querySelector(): HTML에서 특정 요소를 찾아오는 메서드
// "input": input 태그를 찾아라는 의미 (CSS 선택자와 같은 방식)
// let: 변수를 선언하는 키워드 (값을 변경할 수 있음)
// input이라는 변수에 HTML의 input 태그를 저장
let input = document.querySelector("input");

// "#searchBtn": id가 "searchBtn"인 요소를 찾아라는 의미 (#은 id를 의미)
// button이라는 변수에 검색 버튼을 저장
let button = document.querySelector("#searchBtn");

// "#location": id가 "location"인 요소 (도시 이름이 표시될 p 태그)
// place라는 변수에 저장 (나중에 여기에 도시 이름을 넣을 것)
let place = document.querySelector("#location");

// querySelectorAll(): 조건에 맞는 모든 요소를 찾아옴 (여러 개)
// "li .temp": li 태그 안에 있는 class가 "temp"인 모든 요소
// tempEls 변수에 7개의 온도 div를 배열처럼 저장
// tempEls[0], tempEls[1], ... tempEls[6]으로 각각 접근 가능
let tempEls = document.querySelectorAll("li .temp");

// "li img": li 태그 안에 있는 모든 img 태그 (날씨 아이콘)
// iconEls 변수에 7개의 img 태그를 배열처럼 저장
let iconEls = document.querySelectorAll("li img");

// "li p": li 태그 안에 있는 모든 p 태그 (시간 표시)
// timeEls 변수에 7개의 p 태그를 배열처럼 저장
let timeEls = document.querySelectorAll("li p");

// ========================================
// 2. OpenWeatherMap API 키 설정
// ========================================

// APIkey: OpenWeatherMap에서 발급받은 고유 키
// 이 키가 있어야 날씨 데이터를 받아올 수 있음
// 무료 계정으로 발급 가능 (openweathermap.org에서 회원가입 후 발급)
let APIkey = "e6e537c91b0474fb5a8c3cf6964f06fe";

// ========================================
// 3. 페이지 로드 시 현재 위치 날씨 가져오기
// ========================================

// getLocation() 함수를 즉시 호출
// 페이지가 열리자마자 사용자의 현재 위치를 기반으로 날씨를 가져옴
getLocation();

// getLocation 함수 정의
// function: 함수를 만드는 키워드
// getLocation: 함수 이름
// (): 매개변수 없음
// {}: 함수 본문 시작
function getLocation() {
  // navigator: 브라우저 정보를 담고 있는 객체
  // .geolocation: 위치 정보 기능에 접근
  // .getCurrentPosition(): 현재 위치를 가져오는 메서드
  // success: 위치를 성공적으로 가져왔을 때 실행할 함수 이름
  // 브라우저가 사용자에게 "위치 정보 사용을 허용하시겠습니까?" 팝업을 띄움
  navigator.geolocation.getCurrentPosition(success);
}

// success 함수 정의
// async: 비동기 함수라는 표시 (시간이 걸리는 작업을 처리)
// position: getCurrentPosition이 넘겨주는 위치 정보 객체
async function success(position) {
  // position.coords: 좌표 정보가 담긴 객체
  // .latitude: 위도 (남북 위치, 예: 서울은 약 37.5)
  // let lat: 위도를 lat 변수에 저장
  let lat = position.coords.latitude;

  // .longitude: 경도 (동서 위치, 예: 서울은 약 127.0)
  // let lon: 경도를 lon 변수에 저장
  let lon = position.coords.longitude;

  // console.log(): 개발자 도구 콘솔에 값을 출력 (확인용)
  // F12를 눌러 Console 탭에서 확인 가능
  console.log(lat, lon);

  // fetch(): 인터넷에서 데이터를 가져오는 함수 (API 호출)
  // await: fetch가 완료될 때까지 기다림 (데이터를 받을 때까지)
  // 백틱(`): 템플릿 리터럴 (문자열 안에 변수를 넣을 수 있음)
  // ${lat}, ${lon}: 위에서 받은 위도와 경도 값을 문자열에 삽입
  // API 주소 구성:
  //   - api.openweathermap.org/data/2.5/forecast: 예보 데이터 API
  //   - lat=${lat}: 위도 전달
  //   - lon=${lon}: 경도 전달
  //   - appid=${APIkey}: API 인증 키 전달
  //   - units=metric: 섭씨 온도로 받기 (기본은 켈빈, imperial은 화씨)
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
  );

  // response: fetch로 받은 응답 객체
  // .json(): 응답 데이터를 JSON 형식으로 변환하는 메서드
  // await: 변환이 완료될 때까지 기다림
  // data: 변환된 날씨 데이터 객체 (도시 이름, 온도, 날씨 아이콘 등 포함)
  let data = await response.json();

  // render() 함수를 호출하면서 날씨 데이터를 전달
  // render 함수가 화면에 날씨 정보를 표시함
  render(data);
}

// ========================================
// 4. 도시 이름으로 날씨 검색하는 함수
// ========================================

// weather: 함수 이름
// =: 함수를 변수에 할당
// async: 비동기 함수 선언
// (cityname): 매개변수 (검색할 도시 이름을 받음)
// =>: 화살표 함수 (function 키워드를 간단하게 쓴 형태)
// {}: 함수 본문 시작
weather = async (cityname) => {
  // fetch로 API 호출
  // 위치(위도/경도) 대신 도시 이름으로 검색
  // q=${cityname}: 도시 이름 전달 (q는 query의 약자)
  // lang=kr: 날씨 설명을 한국어로 받기 (예: "맑음", "흐림")
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
  );

  // 받은 데이터를 JSON으로 변환
  let data = await response.json();

  // 콘솔에 데이터 출력 (어떤 데이터가 왔는지 확인용)
  console.log(data);

  // render 함수 호출하여 화면에 날씨 정보 표시
  render(data);
};

// ========================================
// 5. 검색 버튼 클릭 이벤트 리스너
// ========================================

// button: 위에서 가져온 검색 버튼
// .addEventListener(): 이벤트 리스너를 추가하는 메서드
// "click": 클릭 이벤트를 감지
// (): 매개변수 없음
// =>: 화살표 함수 (클릭했을 때 실행할 내용)
// {}: 실행할 코드 블록
button.addEventListener("click", () => {
  // input.value: input 태그에 사용자가 입력한 값
  // 예: 사용자가 "Seoul"을 입력했다면 city = "Seoul"
  let city = input.value;

  // input.value에 빈 문자열("")을 할당하여 입력창을 비움
  // 다음 검색을 위해 입력창을 깨끗하게 만듦
  input.value = "";

  // weather 함수를 호출하면서 도시 이름을 전달
  // 예: weather("Seoul")
  weather(city);
});

// ========================================
// 6. 엔터키로 검색하는 이벤트 리스너
// ========================================

// input: 위에서 가져온 input 태그
// "keydown": 키보드를 눌렀을 때 발생하는 이벤트
// (e): 이벤트 객체 (어떤 키를 눌렀는지 등의 정보가 담김)
input.addEventListener("keydown", (e) => {
  // if: 조건문 (조건이 참이면 {} 안의 코드 실행)
  // e.key: 누른 키의 이름 (예: "Enter", "a", "Space")
  // ==: 같은지 비교하는 연산자
  // "Enter": 엔터키
  // 만약 엔터키를 눌렀다면 아래 코드 실행
  if (e.key == "Enter") {
    // input에 입력한 값을 city 변수에 저장
    city = input.value;

    // 콘솔에 도시 이름 출력 (확인용)
    console.log(city);

    // input 입력창 비우기
    input.value = "";

    // weather 함수 호출하여 날씨 검색
    weather(city);
  }
});

// ========================================
// 7. 커스텀 PNG 아이콘 경로를 반환하는 함수
// ========================================

function getCustomIconPath(iconCode) {
  // 아이콘 코드를 실제 파일 이름으로 매핑하는 객체
  // API 코드 : 실제 파일 이름
  const iconMap = {
    "01d": "sun", // 맑음 (낮)
    "01n": "sun", // 맑음 (밤) - sun으로 대체
    "02d": "few clouds", // 구름 조금 (낮)
    "02n": "few clouds", // 구름 조금 (밤)
    "03d": "clouds", // 구름 많음 (낮)
    "03n": "clouds", // 구름 많음 (밤)
    "04d": "clouds", // 흐림 (낮)
    "04n": "clouds", // 흐림 (밤)
    "09d": "showerrain", // 소나기 (낮) - mist로 대체
    "09n": "showerrain", // 소나기 (밤)
    "10d": "rain", // 비 (낮)
    "10n": "rain", // 비 (밤)
    "11d": "severe-weather", // 천둥번개 (낮)
    "11n": "severe-weather", // 천둥번개 (밤)
    "13d": "snowflake", // 눈 (낮)
    "13n": "snowflake", // 눈 (밤)
    "50d": "mist", // 안개 (낮)
    "50n": "mist", // 안개 (밤)
  };

  // iconMap에서 해당 코드의 파일 이름 찾기
  // 만약 없으면 "sun"을 기본값으로 사용
  const fileName = iconMap[iconCode] || "sun";

  // 파일 경로 반환
  return `/weather-icons/${fileName}.png`;
}

// ========================================
// 8. 화면에 날씨 정보를 표시하는 render 함수
// ========================================

// render: 함수 이름
// function: 함수 선언 키워드
// (data): 매개변수 (API에서 받은 날씨 데이터 전체)
function render(data) {
  // "render": 문자열 출력
  // data: 받은 데이터 객체 출력
  // 콘솔에서 데이터 구조를 확인할 수 있음
  console.log("render", data);

  // place: 위에서 가져온 p 태그 (도시 이름이 들어갈 곳)
  // .textContent: 요소의 텍스트 내용을 설정하거나 가져오는 속성
  // data.city.name: API 데이터에서 도시 이름 추출
  // 예: "Seoul", "Busan", "Tokyo" 등
  place.textContent = data.city.name;

  let currentWeatherCode = data.list[0].weather[0].icon;
  let weatherType = currentWeatherCode.slice(0, 2);
  let backgroundImage = "";
  if (weatherType === "01") {
    backgroundImage = "weather-icons/clearsky.jpg";
  } else if (
    weatherType === "02" ||
    weatherType === "03" ||
    weatherType === "04"
  ) {
    // 구름 (조금, 많음, 흐림)
    backgroundImage = "weather-icons/cloudysky.jpg";
  } else if (weatherType === "09" || weatherType === "10") {
    // 비
    backgroundImage = "weather-icons/rainysky.jpg";
  } else if (weatherType === "11") {
    // 천둥번개
    backgroundImage = "weather-icons/thunderstorm.jpg";
  } else if (weatherType === "13") {
    // 눈
    backgroundImage = "weather-icons/snowsky.jpg";
  } else if (weatherType === "50") {
    // 안개
    backgroundImage = "backgrounds/mistsky.jpg";
  } else {
    // 기본값
    backgroundImage = "backgrounds/clear.jpg";
  }

  // body의 배경 이미지 변경
  document.body.style.backgroundImage = `url('${backgroundImage}')`;

  // ========================================
  // 9. 그래프에 사용할 배열 생성
  // ========================================

  // []: 빈 배열 생성
  // temps: 온도 값들을 저장할 배열 (나중에 그래프 y축에 사용)
  let temps = [];

  // labels: 시간 값들을 저장할 배열 (나중에 그래프 x축에 사용)
  let labels = [];

  // ========================================
  // 10. 7개 시간대의 날씨 정보를 처리하는 반복문
  // ========================================

  // for: 반복문 시작
  // let i = 0: 반복 변수 i를 0으로 초기화
  // i < tempEls.length: i가 tempEls의 길이(7)보다 작을 때까지 반복
  // i++: 매 반복마다 i를 1씩 증가 (0, 1, 2, 3, 4, 5, 6)
  // 총 7번 반복하면서 7개 시간대의 날씨를 처리
  for (let i = 0; i < tempEls.length; i++) {
    // ========================================
    // 11. 온도 처리
    // ========================================

    // data.list: API 데이터에서 시간대별 예보 배열
    // [i]: i번째 시간대 (0번째, 1번째, 2번째...)
    // .main.temp: 그 시간대의 온도
    // Math.round(): 소수점을 반올림하는 함수
    // 예: 15.7 → 16, 12.3 → 12, 18.5 → 19
    // temp 변수에 반올림된 온도를 저장
    let temp = Math.round(data.list[i].main.temp);

    // tempEls[i]: i번째 온도 div (첫 번째, 두 번째...)
    // .textContent = temp: 그 div에 온도 값을 텍스트로 넣음
    // 예: 첫 번째 카드의 온도 div에 "16" 표시
    tempEls[i].textContent = temp + "°C";

    // ========================================
    // 12. 커스텀 PNG 아이콘 처리 (수정된 부분!)
    // ========================================

    // data.list[i]: i번째 시간대 데이터
    // .weather: 날씨 정보 배열 (보통 1개 요소만 있음)
    // [0]: 첫 번째 날씨 정보
    // .icon: 날씨 아이콘 코드
    // 예: "01d" (맑음, 낮), "10n" (비, 밤), "02d" (구름 조금)
    let icon = data.list[i].weather[0].icon;

    // 콘솔에 아이콘 코드 출력 (어떤 아이콘인지 확인용)
    console.log("아이콘 코드:", icon);

    // getCustomIconPath() 함수 호출
    // icon 코드를 전달하면 해당 PNG 파일 경로를 반환받음
    // 예: icon이 "01d"이면 → customIconPath는 "./weather-icons/01d.png"
    let customIconPath = getCustomIconPath(icon);

    // 콘솔에 파일 경로 출력 (확인용)
    console.log("아이콘 경로:", customIconPath);

    // iconEls[i]: i번째 img 태그
    // .src: img 태그의 src 속성 (이미지 경로)
    // = customIconPath: 커스텀 PNG 파일 경로를 src에 할당
    // 이제 해당 PNG 아이콘 이미지가 화면에 표시됨
    iconEls[i].src = customIconPath;

    // .alt: img 태그의 대체 텍스트 (접근성을 위해 추가)
    // data.list[i].weather[0].description: 날씨 설명 (예: "맑음", "흐림")
    // 이미지가 로드되지 않을 때 이 텍스트가 표시됨
    iconEls[i].alt = data.list[i].weather[0].description;

    // ========================================
    // 13. 이미지 로드 실패 시 대체 처리 (선택사항, 안전장치)
    // ========================================

    // .onerror: 이미지 로드가 실패했을 때 실행되는 이벤트
    // function(): 익명 함수 (이름 없는 함수)
    iconEls[i].onerror = function () {
      // this: 현재 img 태그를 의미
      // 커스텀 PNG 파일이 없으면 OpenWeatherMap의 기본 아이콘 사용
      // @2x: 2배 크기의 아이콘 (더 선명함)
      this.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      // 콘솔에 에러 메시지 출력
      console.log(`커스텀 아이콘 없음: ${icon}, 기본 아이콘으로 대체`);
    };

    // ========================================
    // 14. 시간 처리
    // ========================================

    // data.list[i].dt_txt: 날짜와 시간 문자열
    // 예: "2024-01-15 12:00:00"
    // .slice(11, 16 - 1): 문자열의 일부분을 잘라내는 메서드
    //   - 11: 시작 인덱스 (11번째 문자부터)
    //   - 16 - 1: 15 (15번째 문자 이전까지)
    //   - 결과: "12:00"
    // 문자열 인덱스: "2024-01-15 12:00:00"
    //                01234567891011121314151617...
    //                           11번째부터 15번째 이전까지 = "12:00"
    let label = data.list[i].dt_txt.slice(11, 16);

    // 잘라낸 시간을 콘솔에 출력 (확인용)
    console.log(label);

    // timeEls[i]: i번째 p 태그 (시간이 들어갈 곳)
    // .textContent = label: p 태그에 시간 텍스트 넣기
    // 예: "12:00", "15:00", "18:00"
    timeEls[i].textContent = label;

    // ========================================
    // 15. 그래프용 배열에 데이터 추가
    // ========================================

    // temps: 위에서 만든 온도 배열
    // .push(temp): 배열의 끝에 온도 값을 추가
    // 반복하면서 계속 추가: [16, 18, 15, 13, 10, 8, 7]
    temps.push(temp);

    // labels: 위에서 만든 시간 배열
    // .push(label): 배열의 끝에 시간 값을 추가
    // 반복하면서 계속 추가: ["12:00", "15:00", "18:00", "21:00", "00:00", "03:00", "06:00"]
    labels.push(label);
  }
  // for 반복문 종료 (7번 반복 완료)

  // ========================================
  // 16. 그래프 그리기 함수 호출
  // ========================================

  // drawChart: 아래에 정의된 그래프 그리기 함수
  // (labels, temps): 시간 배열과 온도 배열을 함수에 전달
  drawChart(labels, temps);
}

// ========================================
// 17. 차트 변수 전역 선언
// ========================================

// let chart: 차트 객체를 저장할 전역 변수 선언
// 처음에는 값이 없음 (undefined)
// 나중에 차트를 생성하면 이 변수에 저장됨
// 전역 변수로 선언하는 이유: 새로운 도시를 검색할 때 이전 차트를 지우기 위해
let chart;

// ========================================
// 18. 그래프를 그리는 drawChart 함수
// ========================================

// drawChart: 함수 이름
// (labels, temps): 매개변수
//   - labels: 시간 배열 (x축에 사용)
//   - temps: 온도 배열 (y축에 사용)
function drawChart(labels, temps) {
  let ctx = document.querySelector("#weatherChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  let minTemp = Math.min(...temps);
  let maxTemp = Math.max(...temps);
  let yMin = Math.floor(minTemp - 5);
  let yMax = Math.ceil(maxTemp + 5);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "시간별 온도",
          data: temps,
          borderWidth: 3,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          tension: 0.4,
          fill: {
            target: { value: yMin },
            above: "rgba(255, 99, 132, 0.1)",
          },
          pointRadius: 5,
          pointBackgroundColor: "white",
          pointBorderColor: "rgb(255, 99, 132)",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 40,
          top: 10,
          bottom: 10,
        },
      },
      scales: {
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            stepSize: 2,
            callback: function (value) {
              return value + "°C";
            },
          },
          title: {
            display: true,
            text: "온도 (°C)",
            color: "rgb(255, 99, 132)",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        x: {
          ticks: {
            maxRotation: 0, // 시간 라벨 회전 안 함
            autoSkip: false, // 모든 시간 표시
          },
          title: {
            display: true,
            text: "시간",
            color: "#666",
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}
