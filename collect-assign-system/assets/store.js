/* ============================================================
   VM 인터뷰 배정 — 수집·배정형 데모 공유 저장소
   실제로는 Excel 워크북 5개 시트(①슬롯마스터~⑤헬프데스크)가 하는 역할을
   브라우저 localStorage로 흉내 냅니다. "배정 실행" 버튼은
   scripts/assignment-office-script.ts와 동일한 로직을 자바스크립트로 옮긴 것입니다.
   ※ 실제 Excel Office Script가 아닌 시연용 시뮬레이션입니다.
   ============================================================ */
window.CAStore = (function () {
  var KEY = "vm2027_collectassign_code_demo_v3";
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];

  /* ---------- 요일별 고정 인터뷰 가능 블록 (1차 인터뷰어 활동 기간 기준) ----------
     월~금 19:00-21:30, 토/일요일 각 4개 블록. 이 블록들이 활동 기간(PERIOD_START~PERIOD_END)
     동안 해당 요일마다 반복되며, 반복되는 매 날짜가 각각 하나의 배정 슬롯이 됩니다. */
  var PERIOD_START = "2026-10-01";
  var PERIOD_END = "2026-10-31";
  var WEEKLY_BLOCKS = [
    { id: "mon", dow: 1, label: "월요일", range: "19:00-21:30", start: "19:00" },
    { id: "tue", dow: 2, label: "화요일", range: "19:00-21:30", start: "19:00" },
    { id: "wed", dow: 3, label: "수요일", range: "19:00-21:30", start: "19:00" },
    { id: "thu", dow: 4, label: "목요일", range: "19:00-21:30", start: "19:00" },
    { id: "fri", dow: 5, label: "금요일", range: "19:00-21:30", start: "19:00" },
    { id: "sat1", dow: 6, label: "토요일", range: "09:00-11:30", start: "09:00" },
    { id: "sat2", dow: 6, label: "토요일", range: "13:00-15:30", start: "13:00" },
    { id: "sat3", dow: 6, label: "토요일", range: "16:00-18:30", start: "16:00" },
    { id: "sat4", dow: 6, label: "토요일", range: "19:30-22:00", start: "19:30" },
    { id: "sun1", dow: 0, label: "일요일", range: "09:00-11:30", start: "09:00" },
    { id: "sun2", dow: 0, label: "일요일", range: "13:00-15:30", start: "13:00" },
    { id: "sun3", dow: 0, label: "일요일", range: "16:00-18:30", start: "16:00" },
    { id: "sun4", dow: 0, label: "일요일", range: "19:30-22:00", start: "19:30" }
  ];
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function blockById(id) {
    for (var i = 0; i < WEEKLY_BLOCKS.length; i++) if (WEEKLY_BLOCKS[i].id === id) return WEEKLY_BLOCKS[i];
    return null;
  }
  function blockLabel(id) {
    var b = blockById(id);
    return b ? (b.label + " " + b.range) : id;
  }
  function periodDates() {
    var out = [];
    var d = new Date(PERIOD_START + "T00:00:00");
    var end = new Date(PERIOD_END + "T00:00:00");
    while (d <= end) {
      out.push(d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  function blockOccurrenceDates(blockId) {
    var b = blockById(blockId);
    if (!b) return [];
    return periodDates().filter(function (dstr) {
      return new Date(dstr + "T00:00:00").getDay() === b.dow;
    });
  }
  // 선택한 블록ID들을 "그 블록이 활동 기간 동안 반복되는 모든 날짜 + 시작시간" 목록으로 펼침
  function expandBlockIds(blockIds) {
    var out = [];
    (blockIds || []).forEach(function (id) {
      var b = blockById(id);
      if (!b) return;
      blockOccurrenceDates(id).forEach(function (dstr) { out.push(dstr + " " + b.start); });
    });
    return out;
  }
  // 특정 날짜(dstr)의 요일에 해당하는 고정 시간대 블록 목록 (달력에서 날짜를 고르면 이걸로 보여줌)
  function blockRangeForDate(dstr) {
    var dow = new Date(dstr + "T00:00:00").getDay();
    return WEEKLY_BLOCKS.filter(function (b) { return b.dow === dow; });
  }

  // 자원봉사자 화면은 개별 시간 대신 오전·오후 단위로 간단히 선택합니다.
  // 선택된 오전·오후는 배정 시 실제 인터뷰 블록으로 펼쳐집니다.
  function applicantPeriodsForDate(dstr) {
    var blocks = blockRangeForDate(dstr);
    var periods = [];
    var am = blocks.filter(function (b) { return Number(b.start.slice(0, 2)) < 12; });
    var pm = blocks.filter(function (b) { return Number(b.start.slice(0, 2)) >= 12; });
    if (am.length) periods.push({ id: "AM", label: "오전", blocks: am });
    if (pm.length) periods.push({ id: "PM", label: "오후", blocks: pm });
    return periods;
  }
  // 날짜+시작시간으로 사람이 읽을 블록 라벨 찾기 (예: "월요일 19:00-21:30")
  function blockLabelForDateTime(dstr, t) {
    var blocks = blockRangeForDate(dstr);
    for (var i = 0; i < blocks.length; i++) if (blocks[i].start === t) return blocks[i].label + " " + blocks[i].range;
    return t;
  }

  function seedSlots() {
    var slots = [];
    WEEKLY_BLOCKS.forEach(function (b) {
      blockOccurrenceDates(b.id).forEach(function (dstr) {
        var mmdd = dstr.slice(0, 4) + dstr.slice(5, 7) + dstr.slice(8, 10);
        slots.push({
          id: mmdd + "_" + b.start.replace(":", ""),
          date: dstr, time: b.start, blockId: b.id, blockLabel: b.label + " " + b.range,
          cap: 3, booked: 0, interviewer: "", status: "배정검토중"
        });
      });
    });
    return slots;
  }

  function seedFaq() {
    return [
      { id: "F-2", q: "1순위 희망만 기록해도 됩니까?", a: "가능합니다. 다만 2~3순위까지 함께 알려주시면 일정 조율이 더 수월합니다.", at: nowLabel() },
      { id: "F-3", q: "제출한 가능 시간이 왜 바로 확정되지 않나요?", a: "이 시스템은 예약형이 아니라 수집·배정형입니다. 여러 사람이 제출한 가능 시간을 담당자가 모아서 한 번에 배정하기 때문에, 제출 즉시가 아니라 배정 실행 이후에 결과가 정해집니다.", at: nowLabel() },
      { id: "F-4", q: "언제 배정 결과를 알 수 있나요?", a: "담당자가 배정을 실행하고 최종 확인을 마친 뒤 승인된 별도 채널 또는 JW Hub를 통해 안내드립니다. 자동 발송은 사용하지 않습니다.", at: nowLabel() },
      { id: "F-5", q: "가족과 함께 인터뷰를 받을 수 있나요?", a: "자원봉사자 면접은 개별 면접이 원칙입니다. 각자 예약코드로 가능한 시간을 제출해 주십시오.", at: nowLabel() },
      { id: "F-6", q: "제출 후 내용을 수정하고 싶습니다.", a: "제출 마감 전에는 같은 예약코드로 다시 접속해 수정할 수 있습니다. 배정 확정 후에는 문의하기에서 변경을 요청해 주십시오.", at: nowLabel() }
    ];
  }

  function seed() {
    return {
      slots: seedSlots(),
      availability: [], // 인터뷰어 제출 원본 (②시트)
      applicants: [],   // 지원자 제출 원본 (③시트)
      helpdesk: [],     // ⑤시트
      faq: seedFaq(),   // 자주 묻는 질문 (수작업 등록/삭제 가능)
      log: [],
      lastRun: null
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (!parsed.faq) parsed.faq = seedFaq(); // 이전 버전 데모 데이터와의 호환
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

  /* ---------- 배정 실행 — assignment-office-script.ts 와 동일 로직 ---------- */
  function runAssignment(state) {
    var slotByKey = {};
    state.slots.forEach(function (s) { slotByKey[s.date + "_" + s.time] = s; });

    // 1) 인터뷰어 가용시간(요일별 블록이 활동 기간 동안 펼쳐진 날짜/시간 목록) -> 슬롯 배정
    state.availability.forEach(function (a) {
      var dailyCount = {}; // 같은 인터뷰어의 "하루 최대 가능횟수" 제한용 (날짜 기준)
      (a.times || []).forEach(function (w) {
        var spaceIdx = w.indexOf(" ");
        if (spaceIdx === -1) return;
        var d = w.slice(0, spaceIdx), t = w.slice(spaceIdx + 1);
        var already = dailyCount[d] || 0;
        if (already >= (a.maxDay || 99)) return;
        var slot = slotByKey[d + "_" + t];
        if (!slot) return;
        if (slot.interviewer) return;
        slot.interviewer = a.interviewerCode;
        slot.cap = Math.max(1, Number((a.capacities || {})[w]) || Number(a.defaultCapacity) || Number(a.maxDay) || 1);
        slot.status = "모집중";
        dailyCount[d] = already + 1;
      });
    });

    // 2) 지원자 배정 (가능시간 적은 순)
    var order = state.applicants
      .map(function (row, i) { return { row: row, count: (row.times || []).length }; })
      .sort(function (a, b) { return a.count - b.count; });

    order.forEach(function (o) {
      var row = o.row;
      if (row.slotId) return;
      var assigned = false;
      (row.times || []).some(function (w) {
        var spaceIdx = w.indexOf(" ");
        if (spaceIdx === -1) return false;
        var d = w.slice(0, spaceIdx), t = w.slice(spaceIdx + 1);
        var slot = slotByKey[d + "_" + t];
        if (!slot) return false;
        if (!slot.interviewer) return false;
        // 정원의 일부를 예외·변경 대응 여유로 남깁니다. 초기값은 70%이며 운영 중 조정 가능합니다.
        var targetCap = Math.max(1, Math.floor(slot.cap * 0.7));
        if (slot.booked >= targetCap) return false;
        slot.booked += 1;
        var remain = targetCap - slot.booked;
        slot.status = remain <= 0 ? "자동배정완료" : (remain / targetCap <= 0.34 ? "마감임박" : "모집중");
        row.slotId = slot.id;
        row.status = "배정완료";
        assigned = true;
        return true;
      });
      if (!assigned) row.status = "수동조율필요";
    });

    var successCount = state.applicants.filter(function (r) { return r.status === "배정완료"; }).length;
    var manualCount = state.applicants.filter(function (r) { return r.status === "수동조율필요"; }).length;
    state.lastRun = nowLabel();
    addLog(state, "배정 실행 — 배정완료 " + successCount + "건 · 수동조율필요 " + manualCount + "건");
    return { successCount: successCount, manualCount: manualCount };
  }

  return {
    load: load, save: save, reset: reset, seed: seed, addLog: addLog, nowLabel: nowLabel, fmtDateShort: fmtDateShort, maskCode: maskCode,
    runAssignment: runAssignment, DOW: DOW,
    WEEKLY_BLOCKS: WEEKLY_BLOCKS, PERIOD_START: PERIOD_START, PERIOD_END: PERIOD_END,
    blockById: blockById, blockLabel: blockLabel, blockOccurrenceDates: blockOccurrenceDates, expandBlockIds: expandBlockIds,
    blockRangeForDate: blockRangeForDate, applicantPeriodsForDate: applicantPeriodsForDate, blockLabelForDateTime: blockLabelForDateTime
  };
})();
