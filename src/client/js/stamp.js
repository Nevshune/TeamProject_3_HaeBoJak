let stampListInfo = [];

//스탬프 찍기 : 방문qr => 스탬프 1개 / 체험qr => 스탬프 2개 
//스탬프 찍히는 총 개수는 6개 : 실제 스탬프 합산 개수 6개가 넘더라도 6개까지만 스탬프가 찍힘
const makeStampHtml = () => {
    const stampBox = document.getElementById("stamp_box");
    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    let stamp_completed = stamp_visited.length + stamp_experienced.length*2
    if(stamp_completed >= 6 ){
        stamp_completed = 6;
    }
    // console.log(stamp_completed)
    let html = "";

        for(let i = 0; i < stamp_completed; i++){
            html += `<div class="stamp_complete w-28 h-28 flex justify-center items-center">`
            html += `<img src="../file/stamp/stamp_complete.png" alt="stamp_complete" class="w-full h-full">`
            html += `</div>`
        }
        for(let i = 0; i < (6-stamp_completed); i++){
            html += `<div class="stamp_preset w-28 h-28 flex justify-center items-center">`
            html += `<img src="../file/stamp/stamp_preset.png" alt="stamp_preset" class="w-full h-full">`
            html += `</div>`
        }   
    stampBox.innerHTML = html;
    // console.log(stampBox)
}

//스탬프 6개 다 모으면 미션완료! => 쿠폰보기 메뉴 나옴
const missionComplete = () => {
    const missionBox = document.getElementById("mission_box");
    const couponBox = document.getElementById("coupon_box");
    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    const stamp_completed = stamp_visited.length + stamp_experienced.length*2
    let html = "";
    let couponHtml = "";

    if(stamp_completed >= 6){
        //미션완료
        html += `<div class="w-[160px] h-[40px] flex justify-center items-center bg-[#FFAA2C]">`
        html += `미션 완료!!`
        html += `</div>`

        //쿠폰보기
        couponHtml += `<button 
                            data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button" 
                            class="w-[160px] h-[40px] flex justify-center items-center bg-[#292929] text-white">`
        couponHtml += `쿠폰 보기`
        couponHtml += `</button>`
    }else{
        html += `<div class="w-[160px] h-[40px] flex justify-center items-center border-2 border-gray-300 text-gray-300">`
        html += `완료 버튼`
        html += `</div>`
    }
    missionBox.innerHTML = html;
    couponBox.innerHTML = couponHtml;
}

//스탬프 갯수 카운트하기
const stampCount = () => {
    const stampCountBox = document.getElementById("stamp_count_box");
    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    let stamp_completed = stamp_visited.length + stamp_experienced.length*2
    if(stamp_completed >= 6 ){
        stamp_completed = 6;
    }
    let html = "";

    html+= `<div>${stamp_completed}/6`;

    stampCountBox.innerHTML = html;
    console.log(stamp_completed);
}   

//백엔드 서버로 스탬프정보 요청
const getStampListFetch = async () => {
    const response = await fetch("/api/stamp",{
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
        }
    });
    const result = await response.json();
    stampListInfo = result;

    if (response.status === 200) {
      console.log("getStampList api 연동 성공");
      console.log(stampListInfo)
      makeStampHtml(); 
      missionComplete(); 
    } else {
      console.log("getStampList api 연동 에러");
    }
  };

  //백엔드 서버로 스탬프정보 요청
const getStampCountFetch = async () => {
    const response = await fetch("/api/stamp",{
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
        }
    });
    const result = await response.json();
    stampListInfo = result;

    if (response.status === 200) {
      console.log("getStampCount api 연동 성공");
    //   console.log(stampListInfo)
      stampCount(); 
    } else {
      console.log("getStampCount api 연동 에러");
    }
  };
  
  getStampListFetch();
  getStampCountFetch();