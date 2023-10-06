const locationMap = document.getElementById("location-map");
let map;
let markers = []; 
let isMapDrawn = false;
let userLatitude;
let userLongitude;

let courseListInfo = [];
let clickCourseId = 0;

//지도 그리는 함수
const drawMap = (latitude, lognitude) => {
    const options = {
        center : new kakao.maps.LatLng(latitude, lognitude),
        level : 5
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(true);
}

//마커를 초기화하는 함수(유저 마커가 새로 생길 때 기존꺼를 지워버리기 위한 용도)
const deleteMakers = () => {
    for(let i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

//유저 마커 그리기
const addUserMarker = () =>{
    let usermarkerImage = "/file/marker/user_marker.png";
    let usermarkerSize = new kakao.maps.Size(35, 35);
    const image = new kakao.maps.MarkerImage(usermarkerImage, usermarkerSize);

    let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(35.86482240895294, 128.5933393643654),
        image : image
    });
    markers.push(marker);
}

//해당 위치로 지도를 이동한다
const panTo = (latitude, longitude) => {
    map.panTo(new kakao.maps.LatLng(35.86482240895294, 128.5933393643654));
}

//코스 마커 그리기
const addCourseMarker = (data) =>  {
    let markerImage = "";
    let markerSize = new kakao.maps.Size(35, 44);

    if (data.분류 == '도자기') {
        markerImage = "/file/marker/dojaki_marker.png";
    }
    if (data.분류 == '페인팅') {
        markerImage = "/file/marker/painting_marker.png";
    }
    if (data.분류 == '쿠킹베이킹') {
        markerImage = "/file/marker/cooking_marker.png";
    }
    if (data.분류 == '목공예라탄') {
        markerImage = "/file/marker/wood_marker.png";
    }
    if (data.분류 == '기타') {
        markerImage = "/file/marker/etc_marker.png";
    }
    const image = new kakao.maps.MarkerImage(markerImage, markerSize);

    const position = new kakao.maps.LatLng(data.위도, data.경도);
    new kakao.maps.Marker({
        map : map,
        position : position,
        title : data.상호,
        image : image
    })
    console.log(data.위도)
}

// 모든 코스를 돌면서 마커를 그리기 위한 함수
const allCourseMarker = () => {
    for (let i = 0; i < courseListInfo.length; i++) {
        addCourseMarker(courseListInfo[i]);
    }
}

//현재 위치 감시 함수 => 계속 내 위치 정보를 가져오는 허락이 있으면 위치정보가 갱신될 대마다 곗속 정보를 가지고 함수를 실행시켜줌
const configurationLocationWatch = () => {
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {

            deleteMakers();

            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            if(!isMapDrawn){
                drawMap(userLatitude,userLongitude);
                allCourseMarker();
                isMapDrawn  = true;
            }
            //유저 마커 그리기
            addUserMarker();
            if (clickCourseId === 0) {
                panTo(userLatitude, userLongitude);
            }
        })
    }
}



//백엔드 서버로 코스정보 요청
const getCourseListFetch = async () => {
    const response = await fetch("/api/courses");
    if (response.status === 200) {
      console.log("getCourseList api 연동 성공");
      const result = await response.json();
      courseListInfo = result;
      configurationLocationWatch();
    } else {
      console.log("getCourseList api 연동 에러")
    }
};

getCourseListFetch()