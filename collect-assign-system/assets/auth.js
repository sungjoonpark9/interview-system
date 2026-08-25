/* ============================================================
   VM 인터뷰 배정 시스템 (수집·배정형) — 인터뷰어·관리자 로그인
   실제 인증 서버 없이, VM부가 미리 등록해 둔 운영 코드 목록과 대조하는
   방식을 흉내 낸 시연용 로그인입니다.
   - 자원봉사자(지원자) 화면: 로그인 없이 누구나 접속
   - 인터뷰어 화면: 등록된 인터뷰어 코드로 접속, 인터뷰어·FAQ만 이용
   - VM 관리자 화면: 등록된 관리자 코드로 접속, 모든 화면 이용 가능
   - 로그인이 성공하면 접속 로그를 남깁니다 (관리자 워크북의 "최근 활동 로그"에 표시)
   ============================================================ */
window.CAAuth = (function () {
  var SESSION_KEY = "vm2027_ca_code_session_v2";
  var LOG_KEY = "vm2027_ca_code_accesslog_v2";

  // 시연용 코드입니다. 실제 운영 시에는 승인된 방식으로 별도 발급·회수해야 합니다.
  var WHITELIST = [
    { code: "INT-2027-01", label: "인터뷰어 01", role: "interviewer" },
    { code: "INT-2027-02", label: "인터뷰어 02", role: "interviewer" },
    { code: "INT-2027-03", label: "인터뷰어 03", role: "interviewer" },
    { code: "INT-2027-04", label: "인터뷰어 04", role: "interviewer" },
    { code: "CALL-2027-01", label: "콜센터 자원봉사자 01", role: "helpdesk" },
    { code: "VM-ADMIN-27", label: "VM 운영 관리자", role: "admin" },
    { code: "SYS-ADMIN-27", label: "시스템 관리자", role: "system" }
  ];

  function normalize(code) {
    return (code || "").trim().toUpperCase();
  }

  function findAccount(code) {
    var n = normalize(code);
    for (var i = 0; i < WHITELIST.length; i++) {
      if (WHITELIST[i].code === n) return WHITELIST[i];
    }
    return null;
  }

  function recordLog(account) {
    // 별도 접속 로그 저장소 (프로그램적으로 조회 가능)
    try {
      var raw = localStorage.getItem(LOG_KEY);
      var logs = raw ? JSON.parse(raw) : [];
      logs.unshift({ code: account.code, label: account.label, role: account.role, at: Date.now() });
      if (logs.length > 200) logs.length = 200;
      localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch (e) {}

    // 관리자 워크북의 "최근 활동 로그"에도 함께 남겨서 관리자가 바로 확인할 수 있게 합니다.
    try {
      if (window.CAStore) {
        var state = window.CAStore.load();
        var roleLabel = account.role === "admin" ? "VM 운영 관리자" : account.role === "system" ? "시스템 관리자" : account.role === "helpdesk" ? "콜센터 자원봉사자" : "인터뷰어";
        window.CAStore.addLog(state, "[접속] " + account.label + "(" + roleLabel + ") 코드로 로그인했습니다.");
        window.CAStore.save(state);
      }
    } catch (e) {}
  }

  function login(code) {
    var account = findAccount(code);
    if (!account) return null;
    var session = { code: account.code, label: account.label, role: account.role, at: Date.now() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
    recordLog(account);
    return session;
  }

  // 자원봉사자는 운영 사용자 명단과 별도로, 발급받은 예약코드로 세션을 만듭니다.
  // 이 세션에는 이름·회중·연락처를 넣지 않습니다.
  function loginVolunteer(code) {
    var n = normalize(code);
    if (!/^VM27-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(n)) return null;
    var session = { code: n, label: "자원봉사자 " + n.slice(-4), role: "volunteer", at: Date.now() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
    return session;
  }

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function getAccessLogs() {
    try {
      var raw = localStorage.getItem(LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  return {
    WHITELIST: WHITELIST,
    findAccount: findAccount,
    login: login,
    loginVolunteer: loginVolunteer,
    logout: logout,
    getSession: getSession,
    getAccessLogs: getAccessLogs
  };
})();
