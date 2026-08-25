/* ============================================================
   VM 인터뷰 예약 운영 데모 공유 저장소
   외부에서 전달된 인터뷰어 운영타임을 2인 팀과 예약 슬롯 정원으로 연결하고,
   자원봉사자가 직접 확정한 예약 상태를 브라우저 localStorage로 흉내 냅니다.
   ============================================================ */
window.CAStore = (function () {
  var KEY = "vm2027_collectassign_code_demo_v6";
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  /* 승인 운영계획과 인터뷰어 개인 응답은 각각 로컬 관리도구/API에서
     독립적으로 전달될 수 있는 데이터입니다. 개별 운영일은 기간·요일 규칙에서 생성합니다. */
  function seedApprovedInterviewSchedule() {
    return {
      startDate:"2026-10-05", endDate:"2026-10-31", source:"approved-operating-plan",
      weekdayTimes:{
        "1":[{start:"19:00",end:"21:30"}], "2":[{start:"19:00",end:"21:30"}],
        "3":[{start:"19:00",end:"21:30"}], "4":[{start:"19:00",end:"21:30"}],
        "5":[{start:"19:00",end:"21:30"}],
        "6":[{start:"09:00",end:"11:30"},{start:"13:00",end:"15:30"},{start:"16:00",end:"18:30"},{start:"19:30",end:"22:00"}]
      },
      additionalTimes:[]
    };
  }
  function interviewTimeId(date,start) { return "IT-"+date.replace(/-/g,"")+"-"+start.replace(":",""); }
  function generateApprovedInterviewTimes(plan) {
    var rows=[], seen={};
    function add(date,time){
      var id=interviewTimeId(date,time.start); if(seen[id])return; seen[id]=true;
      rows.push({id:id,date:date,start:time.start,end:time.end,source:plan.source||"approved-operating-plan"});
    }
    var cursor=new Date(plan.startDate+"T00:00:00"), end=new Date(plan.endDate+"T00:00:00");
    while(cursor<=end){
      var date=cursor.getFullYear()+"-"+pad2(cursor.getMonth()+1)+"-"+pad2(cursor.getDate());
      ((plan.weekdayTimes||{})[String(cursor.getDay())]||[]).forEach(function(time){add(date,time);});
      cursor.setDate(cursor.getDate()+1);
    }
    (plan.additionalTimes||[]).forEach(function(time){add(time.date,time);});
    return rows.sort(function(a,b){return (a.date+a.start).localeCompare(b.date+b.start);});
  }
  function seedInterviewerAvailability(interviewTimes) {
    var byId={}; (interviewTimes||[]).forEach(function(it){byId[it.id]=it;});
    function row(code,timeIds){
      return {interviewerCode:code,timeIds:timeIds.slice(),times:timeIds.map(function(id){var it=byId[id];return it.date+" "+it.start;}),source:"imported",at:nowLabel()};
    }
    return [
      row("INT-2027-01",["IT-20261005-1900","IT-20261010-0900"]),
      row("INT-2027-02",["IT-20261005-1900","IT-20261010-0900"]),
      row("INT-2027-03",["IT-20261005-1900","IT-20261007-1900"]),
      row("INT-2027-04",["IT-20261005-1900","IT-20261007-1900"])
    ];
  }
  function seedConfirmedInterviewTeams() {
    return [
      {teamCode:"TEAM-01",operatingTimeId:"IT-20261005-1900",interviewerCodes:["INT-2027-01","INT-2027-03"],status:"확정",reviewStatus:"",source:"local-tool-api"},
      {teamCode:"TEAM-02",operatingTimeId:"IT-20261005-1900",interviewerCodes:["INT-2027-02","INT-2027-04"],status:"확정",reviewStatus:"",source:"local-tool-api"},
      {teamCode:"TEAM-03",operatingTimeId:"IT-20261010-0900",interviewerCodes:["INT-2027-01","INT-2027-02"],status:"확정",reviewStatus:"",source:"local-tool-api"}
    ];
  }
  function markTeamReviewNeeds(state) {
    var availability=state.interviewerAvailability||state.availability||[];
    (state.confirmedInterviewTeams||[]).forEach(function(team){
      var conflict=(team.interviewerCodes||[]).some(function(code){
        var row=availability.find(function(a){return a.interviewerCode===code;});
        return !row||(row.timeIds||[]).indexOf(team.operatingTimeId)<0;
      });
      team.reviewStatus=conflict?"재검토 필요":"";
    });
    return state;
  }
  function minutes(t) { var p=t.split(":"); return Number(p[0])*60+Number(p[1]); }
  function timeText(n) { return pad2(Math.floor(n/60))+":"+pad2(n%60); }
  function seedSlots(interviewTimes, confirmedTeams) {
    var slots=[];
    (interviewTimes||[]).forEach(function (it) {
      var teams=(confirmedTeams||[]).filter(function(team){return team.operatingTimeId===it.id&&team.status==='확정';});
      if(!teams.length)return;
      var teamCodes=teams.map(function(team){return team.teamCode;});
      var interviewerCodes=[]; teams.forEach(function(team){(team.interviewerCodes||[]).forEach(function(code){if(interviewerCodes.indexOf(code)<0)interviewerCodes.push(code);});});
      for(var m=minutes(it.start); m+30<=minutes(it.end); m+=40){
        var t=timeText(m), id=it.date.replace(/-/g,"")+"_"+t.replace(":","");
        slots.push({ id:id, date:it.date, time:t, blockId:it.id,
          blockLabel:t+" 인터뷰", cap:teams.length, booked:0, opened:true,
          teamCodes:teamCodes.slice(), interviewerCodes:interviewerCodes.slice(),
          status:"모집중", duration:30, transition:10 });
      }
    });
    return slots;
  }

  function seedApplicants(slots) {
    var rows=[
      {id:"A-DEMO-1",reservationCode:"VM27-A7K9-P2Q4",demoGroup:"reserved",slotId:"20261005_1900"},
      {id:"A-DEMO-2",reservationCode:"VM27-B3M8-R6T1",demoGroup:"reserved",slotId:"20261005_1940"},
      {id:"A-DEMO-3",reservationCode:"VM27-C5N2-X8W7",demoGroup:"reserved",slotId:"20261010_0900"},
      {id:"A-DEMO-4",reservationCode:"VM27-D4P6-Y2K8",demoGroup:"open",slotId:""},
      {id:"A-DEMO-5",reservationCode:"VM27-E7R3-H5N1",demoGroup:"open",slotId:""},
      {id:"A-DEMO-6",reservationCode:"VM27-F8T4-J6M2",demoGroup:"open",slotId:""},
      {id:"A-DEMO-7",reservationCode:"VM27-G9V5-L7P3",demoGroup:"close-test",slotId:""},
      {id:"A-DEMO-8",reservationCode:"VM27-H2W6-N8R4",demoGroup:"manual",slotId:"",exceptionStatus:"수동배정 필요"}
    ];
    rows.forEach(function(row){
      row.times=[]; row.periods=[]; row.status=row.slotId?"예약확정":"예약전"; row.at=nowLabel();
      if(row.slotId){var slot=(slots||[]).find(function(s){return s.id===row.slotId;});if(slot)slot.booked+=1;}
    });
    (slots||[]).forEach(function(slot){slot.status=!slot.opened?"예약 미오픈":(slot.booked>=slot.cap?"마감":((slot.cap-slot.booked)/slot.cap<=0.34?"마감임박":"모집중"));});
    return rows;
  }

  function reconcileReservations(state) {
    var used={}; (state.slots||[]).forEach(function(slot){slot.booked=0;});
    (state.applicants||[]).forEach(function(row){
      if(!row.slotId)return;
      var slot=(state.slots||[]).find(function(s){return s.id===row.slotId;});
      if(!slot){row.exceptionStatus="수동배정 필요";return;}
      var key=slot.id, occupied=used[key]||(used[key]=[]), valid=(slot.teamCodes||[]).indexOf(row.teamCode)>=0&&occupied.indexOf(row.teamCode)<0;
      if(!valid)row.teamCode=(slot.teamCodes||[]).find(function(code){return occupied.indexOf(code)<0;})||"";
      if(row.teamCode)occupied.push(row.teamCode); else row.exceptionStatus="수동배정 필요";
      slot.booked+=1;
    });
    (state.slots||[]).forEach(function(slot){slot.status=slot.booked>=slot.cap?"마감":((slot.cap-slot.booked)/slot.cap<=0.34?"마감임박":"모집중");});
    return state;
  }

  function seedFaq() {
    return [
      { id: "F-2", audience:"volunteer", q: "인터뷰 시간은 어떻게 예약하나요?", a: "예약코드로 로그인한 뒤 현재 정원이 남은 날짜와 시작시간 중 하나를 직접 선택합니다.", at: nowLabel() },
      { id: "F-3", audience:"all", q: "예약시간은 어떤 기준으로 만들어지나요?", a: "Excel/로컬 관리도구에서 전달된 2시간 30분 운영 타임을 30분 인터뷰와 10분 전환 간격으로 나누어 표시합니다.", at: nowLabel() },
      { id: "F-4", audience:"volunteer", q: "확정한 예약은 어디에서 확인하나요?", a: "같은 예약코드로 로그인하면 예약 확인 화면에서 확정된 날짜와 시작시간을 확인할 수 있습니다.", at: nowLabel() },
      { id: "F-5", audience:"volunteer", q: "가족과 함께 인터뷰를 받을 수 있나요?", a: "자원봉사자 면접은 개별 면접이 원칙입니다. 각자 예약코드로 가능한 시간을 제출해 주십시오.", at: nowLabel() },
      { id: "F-6", audience:"all", q: "예약을 변경하고 싶습니다.", a: "예약 확정 후 변경이 필요하면 문의하기에서 예약코드 기준으로 요청해 주십시오.", at: nowLabel() },
      { id: "F-7", audience:"interviewer", q: "인터뷰어 가용시간을 변경하려면 어떻게 하나요?", a: "제출 마감 전에는 같은 인터뷰어 코드로 다시 접속해 수정할 수 있습니다. 배정 후에는 헬프데스크로 요청해 주십시오.", at: nowLabel() }
    ];
  }

  function seedNotices() {
    var now = Date.now();
    return [
      { id:"N-1", audience:"all", title:"인터뷰 예약 안내", body:"예약코드로 로그인해 현재 예약 가능한 인터뷰 시간 하나를 선택해 주십시오.", createdAt:now, endsAt:"" },
      { id:"N-2", audience:"interviewer", title:"인터뷰어 가용시간 확인", body:"기존에 제출한 가용시간을 확인하고 변경이 있으면 수정해 주십시오.", createdAt:now, endsAt:"" }
    ];
  }

  function seed() {
    var approvedInterviewSchedule=seedApprovedInterviewSchedule();
    var approvedInterviewTimes=generateApprovedInterviewTimes(approvedInterviewSchedule);
    var interviewerAvailability=seedInterviewerAvailability(approvedInterviewTimes);
    var confirmedInterviewTeams=seedConfirmedInterviewTeams();
    var slots=seedSlots(approvedInterviewTimes,confirmedInterviewTeams);
    var applicants=seedApplicants(slots);
    var state={
      dataModelVersion:2,
      approvedInterviewSchedule: approvedInterviewSchedule,
      approvedInterviewTimes: approvedInterviewTimes,
      interviewerAvailability: interviewerAvailability,
      confirmedInterviewTeams: confirmedInterviewTeams,
      interviewTimes: approvedInterviewTimes, // 이전 화면 호환 별칭
      slots: slots,
      availability: interviewerAvailability, // 이전 화면 호환 별칭
      applicants: applicants,
      helpdesk: [],     // ⑤시트
      faq: seedFaq(),   // 자주 묻는 질문 (수작업 등록/삭제 가능)
      notices: seedNotices(), // 공통·역할별 공지사항
      log: [],
      lastRun: null
    };
    reconcileReservations(state); markTeamReviewNeeds(state); return state;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        normalizeSeparatedData(parsed);
        if (!parsed.faq) parsed.faq = seedFaq(); // 이전 버전 데모 데이터와의 호환
        if (!parsed.notices) parsed.notices = seedNotices();
        save(parsed);
        return parsed;
      }
    } catch (e) {}
    var s = seed();
    save(s);
    return s;
  }
  function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} var s = seed(); save(s); return s; }

  function nowLabel() {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : "" + n; }
    return p(d.getMonth() + 1) + "." + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function addLog(state, msg) {
    state.log.unshift({ msg: msg, at: nowLabel() });
    if (state.log.length > 40) state.log.length = 40;
  }
  function fmtDateShort(dstr) {
    var d = new Date(dstr + "T00:00:00");
    function p(n) { return n < 10 ? "0" + n : "" + n; }
    return p(d.getMonth() + 1) + "." + p(d.getDate()) + "(" + DOW[d.getDay()] + ")";
  }

  function maskCode(code) {
    var value = String(code || "");
    if (value.length <= 4) return value;
    return "••••-" + value.slice(-4);
  }

  function reserveSlot(state, reservationCode, slotId) {
    var code=String(reservationCode||"").trim().toUpperCase();
    var row=(state.applicants||[]).find(function(r){return r.reservationCode===code;});
    if(row && row.slotId) return {ok:false, reason:"already", row:row};
    if(row && row.exceptionStatus==='수동배정 필요') return {ok:false, reason:"manual", row:row};
    var slot=(state.slots||[]).find(function(s){return s.id===slotId;});
    if(!slot || !slot.opened || slot.status==="예약 미오픈" || slot.status==="마감" || slot.booked>=slot.cap) return {ok:false, reason:"full"};
    slot.booked+=1;
    slot.status=slot.booked>=slot.cap?"마감":((slot.cap-slot.booked)/slot.cap<=0.34?"마감임박":"모집중");
    if(!row){ row={id:"A-"+Date.now(),reservationCode:code,times:[],periods:[],slotId:"",status:""}; state.applicants.push(row); }
    var occupied=(state.applicants||[]).filter(function(r){return r!==row&&r.slotId===slot.id;}).map(function(r){return r.teamCode;});
    row.teamCode=(slot.teamCodes||[]).find(function(teamCode){return occupied.indexOf(teamCode)<0;})||"";
    row.slotId=slot.id; row.status="예약확정"; row.at=nowLabel();
    addLog(state,maskCode(code)+" 코드가 "+fmtDateShort(slot.date)+" "+slot.time+" 예약을 확정했습니다.");
    save(state);
    return {ok:true,row:row,slot:slot};
  }

  function rebuildSlotsFromConfirmedTeams(state) {
    var times=state.approvedInterviewTimes||state.interviewTimes||[];
    var availability=state.interviewerAvailability||state.availability||[];
    state.approvedInterviewTimes=times; state.interviewerAvailability=availability;
    state.interviewTimes=times; state.availability=availability;
    state.slots=seedSlots(times,state.confirmedInterviewTeams||[]);
    reconcileReservations(state); markTeamReviewNeeds(state); return state;
  }

  function normalizeSeparatedData(state) {
    if(!state.approvedInterviewSchedule) state.approvedInterviewSchedule=seedApprovedInterviewSchedule();
    if(!state.approvedInterviewTimes) state.approvedInterviewTimes=generateApprovedInterviewTimes(state.approvedInterviewSchedule);
    if(!state.interviewerAvailability) state.interviewerAvailability=state.availability||seedInterviewerAvailability(state.approvedInterviewTimes);
    state.interviewTimes=state.approvedInterviewTimes;
    state.availability=state.interviewerAvailability;
    if(state.dataModelVersion!==2){
      state.confirmedInterviewTeams=seedConfirmedInterviewTeams();
      state.dataModelVersion=2;
      rebuildSlotsFromConfirmedTeams(state);
    }else{
      if(!state.confirmedInterviewTeams)state.confirmedInterviewTeams=[];
      markTeamReviewNeeds(state);
    }
    return state;
  }

  return {
    load: load, save: save, reset: reset, seed: seed, addLog: addLog, nowLabel: nowLabel, fmtDateShort: fmtDateShort, maskCode: maskCode,
    reserveSlot: reserveSlot, rebuildTeamCapacity: rebuildSlotsFromConfirmedTeams, rebuildSlotsFromConfirmedTeams: rebuildSlotsFromConfirmedTeams,
    markTeamReviewNeeds: markTeamReviewNeeds, generateApprovedInterviewTimes: generateApprovedInterviewTimes, DOW: DOW
  };
})();
