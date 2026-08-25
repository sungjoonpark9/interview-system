/* ============================================================
   VM 인터뷰 예약·헬프데스크 — 연동 데모용 공유 저장소
   브라우저 localStorage를 실제 저장소(시트·DB)를 흉내낸 임시 데이터베이스로
   사용합니다. 같은 브라우저 안에서 화면을 옮겨 다니면 여기서 바뀐 내용이
   이어서 보입니다.
   ※ 실제 서버·DB가 아닌 시연용 시뮬레이션입니다.
   ============================================================ */
window.DemoStore = (function () {
  var KEY = "vm2027_interview_demo_v2";
  var SCHEMA_VERSION = 3;
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];

  function seed() {
    return {
      schemaVersion: SCHEMA_VERSION,
      volunteerCodes: ["VM27-A7K9-P2Q4", "VM27-N4D8-K6R2", "VM27-H3M5-T9W7"],
      interviewTimes: [
        { id:"TIME-20260902-1900", date:"2026-09-02", start:"19:00", end:"21:30", teams:3 },
        { id:"TIME-20260903-1900", date:"2026-09-03", start:"19:00", end:"21:30", teams:2 }
      ],
      slots: [
        { id:"20260902_1900", date:"2026-09-02", time:"19:00", status:"마감임박", plannedCap:3, cap:3, booked:2, interviewTimeId:"TIME-20260902-1900", interviewer:"김민수" },
        { id:"20260902_1940", date:"2026-09-02", time:"19:40", status:"모집중", plannedCap:3, cap:3, booked:1, interviewTimeId:"TIME-20260902-1900", interviewer:"김민수" },
        { id:"20260902_2020", date:"2026-09-02", time:"20:20", status:"모집중", plannedCap:3, cap:3, booked:0, interviewTimeId:"TIME-20260902-1900", interviewer:"김민수" },
        { id:"20260902_2100", date:"2026-09-02", time:"21:00", status:"마감", plannedCap:3, cap:3, booked:3, interviewTimeId:"TIME-20260902-1900", interviewer:"김민수" },
        { id:"20260903_1900", date:"2026-09-03", time:"19:00", status:"모집중", plannedCap:2, cap:2, booked:0, interviewTimeId:"TIME-20260903-1900", interviewer:"이수진" },
        { id:"20260903_1940", date:"2026-09-03", time:"19:40", status:"모집중", plannedCap:2, cap:2, booked:0, interviewTimeId:"TIME-20260903-1900", interviewer:"이수진" },
        { id:"20260903_2020", date:"2026-09-03", time:"20:20", status:"모집중", plannedCap:2, cap:2, booked:0, interviewTimeId:"TIME-20260903-1900", interviewer:"이수진" },
        { id:"20260903_2100", date:"2026-09-03", time:"21:00", status:"모집중", plannedCap:2, cap:2, booked:0, interviewTimeId:"TIME-20260903-1900", interviewer:"이수진" }
      ],
      reservations: [
        { id:"R-1001", volunteerCode:"VM27-DEMO-0001", slotId:"20260902_1900", slotLabel:"09.02(수) 19:00", status:"확정", zoomSent:true, at:"08.24 09:10" },
        { id:"R-1002", volunteerCode:"VM27-DEMO-0002", slotId:"20260902_1900", slotLabel:"09.02(수) 19:00", status:"확정", zoomSent:true, at:"08.24 09:14" },
        { id:"R-1003", volunteerCode:"VM27-DEMO-0003", slotId:"20260902_1940", slotLabel:"09.02(수) 19:40", status:"확정", zoomSent:true, at:"08.24 09:18" }
      ],
      // 인터뷰어에게는 실제 이름 대신 예약코드 기준으로 배정 대상을 표시합니다.
      // 실제 인물 ↔ 예약코드 연결은 로컬 관리도구에서만 관리하는 구조를 가정합니다.
      assignments: [
        { id:"A-1001", applicantCode:"VM27-DEMO-0001", slotId:"20260902_1900", interviewer:"김민수", status:"대기" },
        { id:"A-1002", applicantCode:"VM27-DEMO-0002", slotId:"20260902_1900", interviewer:"김민수", status:"대기" },
        { id:"A-1003", applicantCode:"VM27-DEMO-0003", slotId:"20260902_1940", interviewer:"김민수", status:"대기" }
      ],
      // 인터뷰어가 등록한 "날짜별 최대 가능 횟수" — 관리자가 이 한도 안에서 실제 시간대(슬롯)를 만듭니다.
      capacity: [
        { id: "CAP-20260805-김민수", date: "2026-08-05", interviewer: "김민수", email: "interviewer1@jw.org", maxCount: 4, used: 0, at: "07.30 10:00" },
        { id: "CAP-20260806-이수진", date: "2026-08-06", interviewer: "이수진", email: "interviewer2@jw.org", maxCount: 3, used: 0, at: "07.30 10:05" }
      ],
      helpdesk: [],
      faq: [
        { id: "F-1", q: "예약 가능한 기간은 언제까지인가요?", a: "오늘로부터 최대 2개월 이내의 날짜만 예약하실 수 있습니다. 그 이후 기간은 아직 준비 중입니다.", at: "" },
        { id: "F-2", q: "제출한 예약을 수정하고 싶습니다.", a: "이 화면에서는 직접 수정할 수 없습니다. 문의하기 화면으로 변경 내용을 남겨 주시면 담당자가 반영해 드립니다.", at: "" },
        { id: "F-3", q: "인터뷰 예약은 어떻게 확인하나요?", a: "예약코드로 다시 로그인하면 확정된 날짜와 시간을 확인할 수 있습니다.", at: "" }
      ],
      log: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed.schemaVersion !== SCHEMA_VERSION) throw new Error("schema migration");
        if (!parsed.capacity) parsed.capacity = [];
        if (!parsed.assignments) parsed.assignments = seed().assignments;
        if (!parsed.faq) parsed.faq = seed().faq;
        if (!parsed.helpdesk) parsed.helpdesk = [];
        return parsed;
      }
    } catch (e) {}
    var s = seed();
    save(s);
    return s;
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    var s = seed();
    save(s);
    return s;
  }

  function addLog(state, msg) {
    state.log.unshift({ msg: msg, at: nowLabel() });
    if (state.log.length > 40) state.log.length = 40;
  }

  function nowLabel() {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : "" + n; }
    return p(d.getMonth() + 1) + "." + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function fmtDateLabel(dstr) {
    var d = new Date(dstr + "T00:00:00");
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일(" + DOW[d.getDay()] + ")";
  }

  function fmtDateShort(dstr) {
    var d = new Date(dstr + "T00:00:00");
    function p(n) { return n < 10 ? "0" + n : "" + n; }
    return p(d.getMonth() + 1) + "." + p(d.getDate()) + "(" + DOW[d.getDay()] + ")";
  }

  // 슬롯ID 규칙 — 날짜+시간을 그대로 ID로 사용
  function slotIdFor(dstr, t) {
    var mmdd = dstr.slice(0, 4) + dstr.slice(5, 7) + dstr.slice(8, 10);
    return mmdd + "_" + t.replace(":", "");
  }

  function findSlot(state, id) {
    for (var i = 0; i < state.slots.length; i++) if (state.slots[i].id === id) return state.slots[i];
    return null;
  }

  function findVolunteerCode(state, code) {
    var normalized = (code || "").trim().toUpperCase();
    return (state.volunteerCodes || []).indexOf(normalized) !== -1 ? normalized : null;
  }

  // 가용성(용량) ID 규칙 — 날짜+인터뷰어이름
  function capacityIdFor(dstr, name) {
    var mmdd = dstr.slice(0, 4) + dstr.slice(5, 7) + dstr.slice(8, 10);
    return "CAP-" + mmdd + "-" + name;
  }

  function findCapacity(state, id) {
    for (var i = 0; i < state.capacity.length; i++) if (state.capacity[i].id === id) return state.capacity[i];
    return null;
  }

  // 오늘부터 최대 N개월 뒤까지의 연·월(YYYYMM 숫자) 범위
  function monthRange(monthsAhead) {
    var now = new Date();
    var minYM = now.getFullYear() * 12 + now.getMonth();
    var future = new Date(now.getFullYear(), now.getMonth() + monthsAhead, now.getDate());
    var maxYM = future.getFullYear() * 12 + future.getMonth();
    return { minYM: minYM, maxYM: maxYM, todayYear: now.getFullYear(), todayMonth: now.getMonth(), todayDate: now.getDate() };
  }

  return {
    load: load, save: save, reset: reset, seed: seed,
    addLog: addLog, nowLabel: nowLabel,
    fmtDateLabel: fmtDateLabel, fmtDateShort: fmtDateShort,
    slotIdFor: slotIdFor, findSlot: findSlot, findVolunteerCode: findVolunteerCode,
    capacityIdFor: capacityIdFor, findCapacity: findCapacity,
    monthRange: monthRange, DOW: DOW
  };
})();
