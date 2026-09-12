(function(){
  'use strict';
  var KEY='sic-demo-lang';
  var urlLang=(new URLSearchParams(location.search)).get('lang');
  var lang=(urlLang==='en'||urlLang==='ko')?urlLang:(localStorage.getItem(KEY)||'ko');
  localStorage.setItem(KEY,lang);

  var pairs = [
    ['2027 서울 국제대회 · 인터뷰 배정 앱','2027 Seoul International Convention · Interview Scheduling'],
    ['2027 서울 국제대회 · 자원봉사자관리부(VM) · 수집·배정형 데모','2027 Seoul International Convention · Volunteer Management (VM) · Scheduling Demo'],
    ['인터뷰 배정 앱 (데모) · 2027 SIC','Interview Scheduling App (Demo) · 2027 SIC'],
    ['인터뷰 배정 시스템 — 수집·배정형 데모','Interview Scheduling System — Scheduling Demo'],
    ['인터뷰 배정 · 수집·배정형 데모','Interview Scheduling · Demo'],
    ['수집·배정형 · 베델 계정 불필요 구조','Scheduling model · No Bethel account required'],
    ['수집·배정형 구조 한눈에 보기','Scheduling Model Overview'],
    ['수집·배정형(현재)','Scheduling Model (Current)'],
    ['예약형(이전)','Direct Booking Model (Previous)'],
    ['예약형 → 수집·배정형, 무엇이 달라졌나','What Changed: Direct Booking → Scheduling Model'],
    ['기존 예약형 데모 보기 →','View previous direct-booking demo →'],
    ['VM 운영 관리자 로그인','VM Operations Administrator Login'],
    ['콜센터 자원봉사자 로그인','Help Desk Volunteer Login'],
    ['인터뷰어 로그인','Interviewer Login'],
    ['운영 사용자 로그인 (수집·배정형 샘플)','Operations User Login (Demo)'],
    ['운영 사용자 로그인','Operations User Login'],
    ['인터뷰 예약 운영 관리','Interview Scheduling Administration'],
    ['인터뷰 예약 (샘플)','Interview Scheduling (Demo)'],
    ['인터뷰 예약','Interview Scheduling'],
    ['예약 확인','My Interview'],
    ['가능시간 입력','Submit Availability'],
    ['배정 확인','Interview Assignments'],
    ['관리자 워크북','Admin Workbook'],
    ['관리자','Administration'],
    ['콜센터 문의 처리','Help Desk Requests'],
    ['콜센터','Help Desk'],
    ['도움말','Help'],
    ['홈','Home'],
    ['로그아웃','Sign Out'],
    ['공지사항','Notices'],
    ['문의하기','Contact Support'],
    ['자주 묻는 질문','Frequently Asked Questions'],
    ['FAQ 관리','FAQ Administration'],
    ['공지 관리','Notice Administration'],
    ['역할별 FAQ','FAQ by Role'],
    ['역할별 공지사항','Notices by Role'],
    ['자원봉사자 제출','Volunteer Submission'],
    ['인터뷰어 제출','Interviewer Submission'],
    ['가능시간 제출하기','Submit Availability'],
    ['가능한 시간 알려주기','Submit Availability'],
    ['구조 한눈에 보기','Overview'],
    ['개요','Overview'],
    ['보기 →','View →'],
    ['열기 →','Open →'],
    ['앱 형태로 한 화면에서 보기','Open App View'],
    ['데모 초기화','Reset Demo'],
    ['시연 순서 (추천)','Suggested Demo Flow'],
    ['신청자 · 문의자','Volunteer · Requester'],
    ['인터뷰어','Interviewer'],
    ['자원봉사자','Volunteer'],
    ['VM 관리자','VM Administrator'],
    ['시스템 관리자','System Administrator'],
    ['콜센터 자원봉사자','Help Desk Volunteer'],
    ['누구신가요?','Select Your Role'],
    ['아래에서 해당하는 역할을 선택해 주세요.','Choose the role that applies to you.'],
    ['인터뷰이(자원봉사자)','Interviewee (Volunteer)'],
    ['관리자 코드로 로그인해 제출·배정 현황을 관리합니다','Sign in with an administrator code to manage submissions and assignments.'],
    ['발급받은 코드로 로그인해 가능시간과 배정을 확인합니다','Sign in with your issued code to submit availability and view assignments.'],
    ['예약코드로 로그인해 원하는 인터뷰 시간을 예약합니다','Sign in with your booking code to choose an interview time.'],
    ['콜센터 코드로 로그인해 문의를 확인하고 처리합니다','Sign in with a help desk code to review and respond to requests.'],
    ['현재 역할에 필요한 기능을 확인할 수 있습니다.','Use the features available for your current role.'],
    ['도움이 필요하신가요?','Need Help?'],
    ['문의 전에 자주 묻는 내용을 확인합니다','Review common questions before contacting support.'],
    ['해결되지 않은 내용을 문의합니다','Contact support for issues not resolved here.'],
    ['역할에 필요한 새 안내를 확인합니다','Review new notices for your role.'],
    ['내 홈','My Home'],
    ['로그인 중','Signed In'],
    ['샘플 · SAMPLE','Sample · SAMPLE'],
    ['데모용 샘플 로그인','Demo Sign-In Samples'],
    ['샘플 버튼을 누르면 코드가 자동으로 입력됩니다.','Select a sample button to fill in the code automatically.'],
    ['운영 코드','Operations Code'],
    ['인터뷰어 코드','Interviewer Code'],
    ['관리자 코드','Administrator Code'],
    ['콜센터 코드','Help Desk Code'],
    ['로그인','Sign In'],
    ['자원봉사자 코드 입력 화면으로 가기','Go to Volunteer Code Entry'],
    ['자원봉사자는 발급받은 예약코드로 접속합니다','Volunteers access the app with their issued booking code.'],
    ['VM부가 미리 발급한 운영 코드로만 접속할 수 있습니다. 이름이나 이메일은 입력하지 않습니다.','Access is limited to operations codes issued in advance by VM. Names and email addresses are not entered.'],
    ['콜센터 자원봉사자 약식 서약','Help Desk Volunteer Acknowledgment'],
    ['위 내용을 확인했으며 준수하겠습니다.','I have read and agree to follow the above.'],
    ['인터뷰 예약이 확정되었습니다','Interview Booking Confirmed'],
    ['확정된 인터뷰 예약','Confirmed Interview'],
    ['직접 선택해 확정한 인터뷰 일정을 확인합니다.','Review the interview time you selected and confirmed.'],
    ['아직 확정된 인터뷰 예약이 없습니다.','No interview has been confirmed yet.'],
    ['예약코드당 하나의 인터뷰 시간만 확정할 수 있습니다.','Only one interview time may be confirmed per booking code.'],
    ['예약시간 15분 전까지 Zoom 대기실에 입장해 주세요. 인터뷰 진행 상황에 따라 예정 시간보다 조금 일찍 시작하거나 늦게 시작할 수 있습니다.','Please enter the Zoom waiting room 15 minutes before your scheduled time. The interview may begin slightly earlier or later depending on progress.'],
    ['예약 확정 후 일정 변경이 필요하면','If you need to change your schedule after confirmation,'],
    ['문의하기를 이용해 주십시오.','please use Contact Support.'],
    ['예약 가능한 날짜','Available Dates'],
    ['예약 가능한 인터뷰 시간','Available Interview Times'],
    ['현재 예약 가능한 인터뷰 시간만 표시됩니다.','Only interview times currently available for booking are shown.'],
    ['예약코드','Booking Code'],
    ['발급받은 예약코드를 입력해 주세요.','Enter your issued booking code.'],
    ['코드 확인','Verify Code'],
    ['확인 중…','Checking…'],
    ['샘플 예약코드','Sample Booking Code'],
    ['원하는 시간 하나를 선택해 주세요.','Choose one preferred time.'],
    ['선택한 인터뷰 시간','Selected Interview Time'],
    ['아직 고른 시간이 없습니다.','No time selected yet.'],
    ['시작시간 선택','Select Start Time'],
    ['먼저 위 달력에서 날짜를 골라 주세요.','First select a date from the calendar above.'],
    ['이 날 빼기','Remove This Date'],
    ['이 시간으로 예약 확정','Confirm This Interview Time'],
    ['예약 가능','Available'],
    ['전체 마감','Fully Booked'],
    ['예약 가능한 시간 없음','No Available Times'],
    ['선택됨','Selected'],
    ['마감','Full'],
    ['자리','spots'],
    ['이름·회중·전화번호·이메일은 입력하거나 저장하지 않습니다.','Names, congregations, phone numbers, and email addresses are not entered or stored.'],
    ['예약코드와 확정된 슬롯만 저장합니다.','Only the booking code and confirmed slot are stored.'],
    ['연동 데모','Interactive Demo'],
    ['이 화면은 브라우저에 저장되는 연동 데모입니다.','This is an interactive demo that stores data only in the browser.'],
    ['운영 가능한 날짜','Available Operating Dates'],
    ['가능한 운영타임 고르기 (복수 선택 가능)','Select Available Operating Times (Multiple Selection)'],
    ['2시간 30분 운영타임','2.5-Hour Operating Time'],
    ['인터뷰 가능한 2시간 30분 운영타임을 모두 선택해 주세요.','Select all 2.5-hour operating times when you are available to interview.'],
    ['달력에서 운영일을 선택한 뒤 가능한 2시간 30분 타임을 선택해 주세요.','Select an operating date, then choose the 2.5-hour time blocks when you are available.'],
    ['이 운영타임으로 알려주기','Submit These Operating Times'],
    ['이렇게 알려드리면 될까요?','Submit These Times?'],
    ['잘 알려주셨습니다','Availability Submitted'],
    ['선택하신 시간은 인터뷰 배정을 매칭하는데만 사용됩니다.','Your selected times are used only for interview scheduling.'],
    ['알려주신 내용은 인터뷰 배정을 짜는 데에만 씁니다.','The information you provide is used only to schedule interviews.'],
    ['이 화면에는 이름·이메일을 입력하거나 저장하지 않습니다.','Names and email addresses are not entered or stored on this screen.'],
    ['배정 결과는 승인된 별도 채널로 안내합니다.','Assignment results will be communicated through an approved separate channel.'],
    ['전달된 운영타임이 없습니다.','No operating times have been submitted.'],
    ['운영 가능한 인터뷰어 팀 수에 반영되었습니다.','Your availability has been reflected in the interviewer team capacity.'],
    ['선택한 운영타임이 인터뷰어 팀 수와 슬롯 정원에 반영됩니다.','Selected operating times are reflected in interviewer team counts and slot capacity.'],
    ['인터뷰어 가능한 시간 알려주기','Submit Interviewer Availability'],
    ['인터뷰어 가능한 시간 알려주기 (수집·배정형 샘플)','Submit Interviewer Availability (Demo)'],
    ['지원자 배정에 앞서, 인터뷰어 형제들이 가능한 날짜와 시간을 먼저 알려주시는 곳입니다','Interviewers submit their available dates and times here before volunteers are assigned.'],
    ['인터뷰 예약 운영 관리','Interview Scheduling Administration'],
    ['인터뷰어 운영타임과 팀 수를 기준으로 슬롯 정원·예약 현황·예외 상황을 관리합니다','Manage slot capacity, bookings, and exceptions based on interviewer operating times and team counts.'],
    ['①운영타임','① Operating Times'],
    ['②확정 팀','② Confirmed Teams'],
    ['③슬롯 정원','③ Slot Capacity'],
    ['④예약 현황','④ Booking Status'],
    ['⑤예외 조정','⑤ Exception Adjustments'],
    ['현황 새로고침','Refresh Status'],
    ['상태 안내','Status Guide'],
    ['모집중','Open'],
    ['마감임박','Nearly Full'],
    ['예약확정','Booked'],
    ['재검토 필요','Review Required'],
    ['수동배정 필요','Manual Assignment Required'],
    ['예약 미오픈','Booking Not Open'],
    ['검토 상태','Review Status'],
    ['운영시간','Operating Time'],
    ['운영타임ID','Operating Time ID'],
    ['확정 팀 수','Confirmed Teams'],
    ['팀 기준 정원','Team-Based Capacity'],
    ['팀 수 기준 정원 적용 중','Capacity is based on the number of confirmed teams.'],
    ['슬롯 정원 반영','Apply Slot Capacity'],
    ['예외 정원 조정','Adjust Capacity Exception'],
    ['예약 현황 CSV','Booking Status CSV'],
    ['예약 해제','Release Booking'],
    ['최근 활동 로그','Recent Activity Log'],
    ['아직 확정된 예약이 없습니다.','No confirmed bookings yet.'],
    ['아직 활동이 없습니다.','No activity yet.'],
    ['로컬 관리도구에서 전달된 확정 팀이 없습니다.','No confirmed teams have been received from the local management tool.'],
    ['자원봉사자가 시간을 직접 예약했습니다','The volunteer selected and booked a time directly.'],
    ['현재 정원이 모두 찼습니다','All capacity is currently filled.'],
    ['남은 정원이 많지 않습니다','Only limited capacity remains.'],
    ['예약 가능한 정원이 남아 있습니다','Capacity is available for booking.'],
    ['아직 예약을 확정하지 않았습니다','The interview has not yet been booked.'],
    ['문의 유형','Request Type'],
    ['추가 설명 (선택)','Additional Details (Optional)'],
    ['문의 보내기','Send Request'],
    ['내 문의·답변','My Requests & Replies'],
    ['역할별 문의','Role-Based Support'],
    ['로그인한 역할에 맞는 문의를 접수합니다','Submit a support request appropriate to your signed-in role.'],
    ['먼저 역할별 자주 묻는 질문과 공지사항을 확인해 주세요.','Please review the FAQ and notices for your role first.'],
    ['이름·회중·연락처·이메일·건강 정보는 입력하지 마십시오.','Do not enter names, congregation information, contact details, email addresses, or health information.'],
    ['접수한 문의가 없습니다.','No requests submitted.'],
    ['답변','Reply'],
    ['추가 설명 없음','No additional details'],
    ['접수','Received'],
    ['처리 중','In Progress'],
    ['답변 완료','Completed'],
    ['처리 중 저장','Save as In Progress'],
    ['현재 처리할 문의가 없습니다. 새 문의가 접수되면 이곳에 표시됩니다.','There are no requests to process. New requests will appear here.'],
    ['개인정보 최소화 원칙','Data Minimization'],
    ['문의·FAQ만 처리하며 자원봉사자 명단과 배정표에는 접근할 수 없습니다','This role handles requests and FAQs only and cannot access volunteer lists or assignment rosters.'],
    ['질문','Question'],
    ['답변','Answer'],
    ['검색어 입력','Enter search terms'],
    ['등록','Add'],
    ['질문 삭제','Delete Question'],
    ['해당 FAQ가 없습니다.','No matching FAQ.'],
    ['공지 제목','Notice Title'],
    ['공지 내용','Notice Content'],
    ['공지 등록','Add Notice'],
    ['공지 삭제','Delete Notice'],
    ['현재 표시할 공지가 없습니다.','No notices to display.'],
    ['공통 공지와 로그인한 역할에 필요한 공지를 확인합니다','Review general notices and notices relevant to your signed-in role.'],
    ['인터뷰 배정 확인','Interview Assignment'],
    ['나에게 배정된 인터뷰 대상과 일정을 확인합니다. 대상을 누르면 JW Hub용 메모 작성 화면으로 이동합니다.','Review the volunteers and interview times assigned to you. Select a volunteer to open the JW Hub note helper.'],
    ['배정 결과는 관리자가 확정한 내용 기준으로 표시됩니다.','Assignments are shown based on the administrator-confirmed schedule.'],
    ['아직 배정된 인터뷰 대상이 없습니다.','No interview assignments yet.'],
    ['예약 대상 없음','No Volunteer Booked'],
    ['함께하는 인터뷰어:','Co-interviewer:'],
    ['확정팀','Confirmed Teams'],
    ['배정 0명','0 Assigned'],
    ['JW Hub 메모 도우미 열기','Open JW Hub Note Helper'],
    ['인터뷰 메모 작성','Interview Note Helper'],
    ['배정된 인터뷰 정보','Assigned Interview'],
    ['JW Hub 메모 입력 항목','JW Hub Note Fields'],
    ['JW Hub용 메모 미리보기','JW Hub Note Preview'],
    ['JW Hub용 메모 복사','Copy JW Hub Note'],
    ['면접 종료 · 메모 삭제','End Interview · Clear Note'],
    ['배정 확인으로 돌아가기','Back to Assignments'],
    ['개인정보 보호 안내','Privacy Notice'],
    ['서버 저장 안 함','Not Stored on Server'],
    ['입력한 내용이 여기에 정리됩니다.','Your formatted note will appear here.'],
    ['관찰한 사실과 실제 답변에 근거해 간결하게 작성합니다. 빈 항목은 최종 메모에서 자동 제외됩니다.','Write concise notes based on observed facts and actual responses. Blank fields are omitted automatically.'],
    ['이 메모 내용은 앱 서버나 DB로 전송하지 않습니다. 현재 브라우저 세션에서만 임시로 유지되며,','This note is not sent to an app server or database. It is held temporarily only in the current browser session, and'],
    ['JW Hub에 옮긴 뒤','after it is copied to JW Hub,'],
    ['접근할 수 없는 배정입니다.','You do not have access to this assignment.'],
    ['배정을 확인할 수 없습니다','Unable to Verify Assignment'],
    ['요청한 배정 정보 또는 접근 권한을 확인해 주세요.','Please check the requested assignment information or your access permissions.'],
    ['[가능한 시간]','[Availability]'],
    ['[관련 경험·기술]','[Relevant Experience & Skills]'],
    ['[기타]','[Other]'],
    ['[배정 의견-대회 전]','[Assignment Notes—Pre-Convention]'],
    ['[배정 의견-대회 중]','[Assignment Notes—During Convention]'],
    ['[수행 가능 업무]','[Suitable Assignments]'],
    ['[체력·조직 관리]','[Physical Capacity / Team Management]'],
    ['[희망 업무·사유]','[Preferred Assignment / Reason]'],
    ['메인으로','Main'],
    ['이전','Back'],
    ['다음','Next'],
    ['전체','All'],
    ['상태','Status'],
    ['날짜','Date'],
    ['시작시간','Start Time'],
    ['팀','Team'],
    ['잔여','Remaining'],
    ['예약전','Not Booked'],
    ['예약일','Interview Date'],
    ['예약코드 문제','Booking Code Issue'],
    ['앱 사용 방법','Using the App'],
    ['기타 문의','Other Request'],
    ['가능한 시간 수정','Change Availability'],
    ['확정 일정 확인·변경 요청','Confirmed Schedule / Change Request'],
    ['가용시간 수정','Change Availability'],
    ['배정 일정·인원 문의','Assignment Schedule / Volunteer Question'],
    ['인터뷰 진행 방법','Interview Procedure'],
    ['확정','Confirmed'],
    ['마감','Closed'],
    ['(선택)','(Optional)'],
    ['(수집·배정형)으로 다시 설계했습니다. 아래 5단계가 전체 흐름입니다.','It has been redesigned as a collection-and-assignment model. The five steps below show the full workflow.'],
    ['(지원자가 직접 특정 시간을 골라 즉시 확정) 구조는 Power Automate의 자동 흐름과 SharePoint 목록 관리 권한을 필요로 했습니다. 그런데 VM부가 사용하는 계정으로는 이 두 가지를 구성·관리할 수 없다는 점이 테크팀 답변으로 확정되었습니다.','The direct-booking model, where a volunteer selected a specific time and confirmed it immediately, required Power Automate flows and SharePoint list-management permissions. The Tech Team confirmed that the accounts used by VM cannot configure or manage those capabilities.'],
    ['0 / 1,000자','0 / 1,000 characters'],
    ['5단계 흐름과 예약형 대비 달라진 점을 정리한 안내 화면','Overview of the five-step workflow and the differences from the previous direct-booking model.'],
    ['Excel + Microsoft Forms + Teams 파일 탭만으로 구성한 새 운영 방식입니다. 베델 계정 없이 JWPUB 계정으로 운영 가능한 구조로 다시 설계했습니다.','A new operating model built with Excel, Microsoft Forms, and the Teams Files tab. It has been redesigned to work with JWPUB accounts without requiring a Bethel account.'],
    ['Excel 워크북 5개 시트를 흉내 낸 화면 · "배정 실행" 버튼으로 매칭 실행','A demo of the five-sheet Excel workbook. Use the “Run Assignment” button to perform matching.'],
    ['Excel 워크북 시트 5개','Five Excel workbook sheets'],
    ['Excel 파일을 채널에 올리고 파일 탭 추가','Upload the Excel file to the channel and add it as a Files tab.'],
    ['JWPUB 계정으로 가능','Available with a JWPUB account'],
    ['Office Script, 담당자가 수동 실행','Office Script, run manually by an authorized operator'],
    ['Power Automate 자동 흐름','Power Automate automated flow'],
    ['SharePoint 목록 4개','Four SharePoint lists'],
    ['SharePoint 연동 탭','SharePoint-connected tab'],
    ['Teams 통합','Teams integration'],
    ['← 기존 예약형 데모(interview-system)로 돌아가기','← Back to the previous direct-booking demo (interview-system)'],
    ['→ ①슬롯마스터에 인터뷰어가 채워지고, ③지원자가 짝지어져 ④배정결과 탭에 나타납니다','→ Interviewers populate ① Slot Master, volunteers are matched from ③ Volunteer Submissions, and the results appear in ④ Assignment Results.'],
    ['→ ③지원자접수 탭에 "배정대기" 상태로 쌓입니다','→ Entries are added to ③ Volunteer Submissions with the status “Awaiting Assignment.”'],
    ['→ 관리자 워크북 ②인터뷰어가용시간 탭에 쌓입니다 (아직 슬롯은 안 만들어짐)','→ Entries are added to ② Interviewer Availability in the Admin Workbook. Slots have not been created yet.'],
    ['→ 프로그램을 몰라도 담당자가 텍스트만 입력하면 바로 게시되는 방식입니다','→ An operator can publish content simply by entering text, without needing programming knowledge.'],
    ['가능시간 전용','Availability Only'],
    ['가능시간 제출 → 이후 결과 안내','Submit Availability → Receive Assignment Later'],
    ['가능한 시간을 먼저 모으고, 담당자가 정기적으로 한 번씩 배정을 실행하는 방식','Availability is collected first, and an authorized operator runs assignments periodically.'],
    ['가이드북의 표준 형식에 맞춰 자동 조합합니다.','The information is automatically formatted to match the standard guidebook structure.'],
    ['개별 통지','Individual Notification'],
    ['관리자 워크북에서 확인하기 →','View in Admin Workbook →'],
    ['구성 요소','Components'],
    ['그래서 이 폴더의 구조는','Therefore, this folder is structured as follows:'],
    ['기존에 만들었던','Previously developed'],
    ['날짜를 선택한 뒤 정원이 남아 있는 시작시간 하나를 골라 주십시오.','Select a date, then choose one start time with remaining capacity.'],
    ['담당자 검증 · 확정','Operator Review · Confirmation'],
    ['담당자가 Excel Online 워크북의 "자동화" 탭에서 배정 스크립트를 클릭 한 번으로 실행합니다. 가능시간이 적은 지원자부터 우선 배정하고, 끝내 배정받지 못한 사람은 "수동조율필요"로 표시됩니다.','An authorized operator runs the assignment script from the Automation tab in Excel Online with one click. Volunteers with fewer available times are prioritized, and any remaining unmatched volunteers are marked “Manual Coordination Required.”'],
    ['담당자가 배정결과 시트를 확인하고, 수동조율이 필요한 건을 개별 처리한 뒤 "확정" 표시를 남깁니다.','The operator reviews the Assignment Results sheet, resolves items requiring manual coordination, and then marks them as confirmed.'],
    ['담당자가 코드 없이 직접 질문·답변을 등록·삭제할 수 있는 화면','A screen where an authorized operator can add or delete questions and answers without entering a code.'],
    ['로그인한 역할에 맞는 질문과 답변을 보여 줍니다','Shows questions and answers relevant to the signed-in role.'],
    ['를 누르면 삭제됩니다.','to delete it.'],
    ['를 이용해 주십시오.','please use it.'],
    ['먼저 코드를 확인해 주세요','Please verify the code first.'],
    ['메모 권한이 없는 경우에는 VM이 안내하는 방식으로 제출','If note permissions are unavailable, submit the information using the method directed by VM.'],
    ['모든 화면은 브라우저에 저장되는 데이터로 서로 연동되어 있어, 실제 흐름처럼 눌러보며 확인하실 수 있습니다.','All screens are linked through browser-stored demo data, so you can click through the workflow as if it were operating live.'],
    ['문의에 이름·회중·연락처·건강 정보가 포함된 것으로 보이면 답변하지 말고 VM 운영 관리자에게 제한 검토를 요청하십시오. 답변 완료 문자는 답변 내용 없이 앱 주소만 안내합니다.','If a request appears to contain a name, congregation, contact details, or health information, do not respond. Ask a VM Operations Administrator to conduct a restricted review. Completion messages should provide only the app address, not the response content.'],
    ['문의하기 화면','Contact Support Screen'],
    ['배정 관리 워크북','Assignment Management Workbook'],
    ['배정 관리 워크북 (수집·배정형 샘플)','Assignment Management Workbook (Collection-and-Assignment Demo)'],
    ['배정 로직 실행','Run Assignment Logic'],
    ['배정 실행 (Office Script)','Run Assignment (Office Script)'],
    ['배정된 대상의 JW Hub 메모 입력 형식에 맞춰 필요한 내용만 정리합니다','Organizes only the information needed for the assigned volunteer in the JW Hub note format.'],
    ['베델 계정(관리 권한)','Bethel Account (Administrative Permission)'],
    ['복사했습니다','Copied'],
    ['불러오는 중…','Loading…'],
    ['슬롯ID','Slot ID'],
    ['슬롯을 직접 골라 즉시 확정','Select a slot and confirm immediately'],
    ['시연을 다시 처음부터 보여줘야 한다면 이 페이지의 "데모 초기화" 버튼을 눌러 리셋','To restart the demonstration from the beginning, use the “Reset Demo” button on this page.'],
    ['실제 Excel Online에 바로 붙여넣어 쓸 수 있는 배정 스크립트 코드는','The assignment script that can be pasted directly into Excel Online is located in'],
    ['앱에는 실제 이름 대신 예약코드만 표시합니다. 실제 인물과 예약코드의 연결정보는 승인된 사용자의 로컬 관리도구에서 관리합니다.','The app displays booking codes instead of actual names. The mapping between a person and a booking code is maintained in the local management tool by authorized users.'],
    ['업무 중 알게 된 정보는 문의 처리 목적에만 사용하고 외부에 공유하지 않으며, 개인정보 최소화 원칙과 콜센터 운영 지침을 준수하겠습니다.','I will use information learned during this work only to handle support requests, will not share it externally, and will follow data-minimization principles and Help Desk operating guidelines.'],
    ['에 있습니다. 설정 방법은 이 폴더의 README를 참고해 주세요.','For setup instructions, see the README in this folder.'],
    ['에서 문의를 하나 남긴 뒤, 다시 관리자 워크북으로 돌아가 ⑤헬프데스크 탭에서 확인','Submit a request there, then return to the Admin Workbook and review it in ⑤ Help Desk.'],
    ['예약 확정','Booking Confirmed'],
    ['로 접속 중',' signed in'],
    ['분 인터뷰','-minute interview'],
    ['예약코드로 로그인한 뒤 현재 예약 가능한 시간 하나를 선택합니다','Sign in with a booking code and select one currently available interview time.'],
    ['예약형','Direct Booking'],
    ['예외 조정','Exception Adjustment'],
    ['으로 이동해 상단 "배정 실행" 버튼 클릭','and click “Run Assignment” at the top.'],
    ['이 순서대로 눌러보시면 "가능시간 제출 → 배정 실행 → 결과 확인" 흐름이 자연스럽게 이어집니다.','Follow this sequence to see the workflow: “Submit Availability → Run Assignment → Review Results.”'],
    ['이 화면들은 브라우저에 저장되는 연동 데모입니다 ·','These are interactive demo screens using data stored in the browser ·'],
    ['이 화면은 브라우저에 저장되는 연동 데모입니다 ·','This is an interactive demo using data stored in the browser ·'],
    ['인터뷰 배정 시스템','Interview Scheduling System'],
    ['인터뷰 배정 앱 홈 (수집·배정형 샘플)','Interview Scheduling App Home (Collection-and-Assignment Demo)'],
    ['인터뷰 예약 확인','Interview Booking Details'],
    ['인터뷰어 가능시간 제출','Submit Interviewer Availability'],
    ['인터뷰어 형제들이 가능한 날짜·시간과 하루 최대 진행 건수를 알려줍니다. 이 단계에서는 슬롯이 즉시 만들어지지 않습니다 — 그냥 원본 데이터로만 쌓입니다.','Interviewers provide their available dates, times, and maximum number of interviews per day. At this stage, slots are not created immediately; the information is collected as source data.'],
    ['인터뷰어 화면','Interviewer Screen'],
    ['인터뷰어가 가능한 날짜·시간과 하루 최대 건수를 제출하는 화면','A screen where interviewers submit available dates, times, and the maximum number of interviews per day.'],
    ['일정 데이터 저장','Schedule Data Storage'],
    ['일정·배정 관련 문의를 남기는 화면','A screen for submitting schedule- and assignment-related requests.'],
    ['자료 출처','Data Source'],
    ['자원봉사자 가능시간 제출','Submit Volunteer Availability'],
    ['자원봉사자 화면','Volunteer Screen'],
    ['자원봉사자가 인터뷰 가능한 날짜의 오전·오후를 골라 제출하는 화면','A screen where volunteers select morning or afternoon availability on interview dates.'],
    ['자원봉사자는 예약코드로 접속해 최대 7일 범위에서 날짜별 오전·오후를 선택합니다. 면접은 개별 면접이며, 제출 마감 전에는 같은 코드로 수정할 수 있습니다.','Volunteers access the app with a booking code and select morning or afternoon availability for up to seven days. Interviews are individual, and submissions can be edited with the same code before the deadline.'],
    ['자원봉사자는 예약코드를 확인하고, 인터뷰어는 인터뷰어 코드로 로그인해 주십시오.','Volunteers should verify their booking code; interviewers should sign in with their interviewer code.'],
    ['지원자 경험','Volunteer Experience'],
    ['테크팀 답변(베델 계정 사용 불가 확정) 반영 이후의 새 운영 방식입니다','This is the revised operating model following the Tech Team’s confirmation that Bethel-account capabilities are unavailable.'],
    ['필요 계정 권한','Required Account Permissions'],
    ['현재 예약','Current Booking'],
    ['홈·자원봉사자·인터뷰어·콜센터·관리자·문의를 역할별로 확인하는 앱 데모','An app demo showing Home, Volunteer, Interviewer, Help Desk, Administration, and Support functions by role.'],
    ['홈으로','Go Home'],
    ['화면 보기 →','View Screen →'],
    ['화면에서 발급받은 예약코드 입력 후 가능한 날짜의 오전·오후를 골라 제출','Enter the issued booking code, then select available mornings or afternoons and submit.'],
    ['화면에서 발급받은 인터뷰어 코드 입력 후 날짜 하나와 시간 1~2개를 골라 제출','Enter the issued interviewer code, choose one date and one or two times, then submit.'],
    ['화면에서 자주 묻는 질문을 확인하고, "관리자 모드"에서 새 질문·답변을 직접 등록해보기','Review the FAQ, then use Administration mode to add a new question and answer.'],
    ['확정된 배정 결과를 담당자가 승인된 별도 채널 또는 JW Hub를 통해 자원봉사자·인터뷰어에게 안내합니다. 이 앱은 이름·연락처를 저장하거나 자동 발송하지 않습니다.','An authorized operator communicates confirmed assignments to volunteers and interviewers through an approved separate channel or JW Hub. This app does not store names or contact details and does not send messages automatically.'],
  ];

  // longest first so specific phrases win
  pairs.sort(function(a,b){ return b[0].length-a[0].length; });

  function enText(s){
    if(!s || !/[가-힣]/.test(s)) return s;
    var out=s;
    pairs.forEach(function(p){ if(out.indexOf(p[0])!==-1) out=out.split(p[0]).join(p[1]); });
    // Common Korean date forms
    out=out.replace(/(\d{4})년\s*(\d{1,2})월/g,'$1-$2');
    out=out.replace(/(\d{1,2})월\s*(\d{1,2})일\((일|월|화|수|목|금|토)\)/g,function(_,m,d,w){
      var wm={일:'Sun',월:'Mon',화:'Tue',수:'Wed',목:'Thu',금:'Fri',토:'Sat'}; return m+'/'+d+' ('+wm[w]+')';
    });
    out=out.replace(/(\d{1,2})월\s*(\d{1,2})일/g,'$1/$2');
    out=out.replace(/(\d{1,2})\.(\d{1,2})\((일|월|화|수|목|금|토)\)/g,function(_,m,d,w){
      var wm={일:'Sun',월:'Mon',화:'Tue',수:'Wed',목:'Thu',금:'Fri',토:'Sat'}; return m+'/'+d+' ('+wm[w]+')';
    });
    out=out.replace(/(\d+)분\s*인터뷰/g,'$1-minute interview');
    out=out.replace(/(\d+)개/g,'$1');
    out=out.replace(/(\d+)명/g,'$1 people');
    out=out.replace(/(\d+)건/g,'$1');
    return out;
  }

  function translateTextNode(node){
    if(lang!=='en') return;
    var parent=node.parentElement;
    if(!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(parent.tagName)) return;
    if(parent.tagName==='OPTION' && !parent.hasAttribute('value')) parent.setAttribute('value', node.nodeValue.trim());
    var before=node.nodeValue, after=enText(before);
    if(after!==before) node.nodeValue=after;
  }

  function translateAttrs(el){
    if(lang!=='en' || !el || el.nodeType!==1) return;
    ['placeholder','title','aria-label'].forEach(function(a){
      if(el.hasAttribute(a)) el.setAttribute(a,enText(el.getAttribute(a)));
    });
    if(el.tagName==='INPUT' && ['button','submit','reset'].indexOf((el.type||'').toLowerCase())>=0 && el.value){
      el.value=enText(el.value);
    }
  }

  function translateTree(root){
    if(lang!=='en') return;
    if(root.nodeType===3){ translateTextNode(root); return; }
    if(root.nodeType!==1 && root.nodeType!==9 && root.nodeType!==11) return;
    if(root.nodeType===1) translateAttrs(root);
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
    var n;
    while((n=walker.nextNode())){
      if(n.nodeType===3) translateTextNode(n); else translateAttrs(n);
    }
    if(document.title) document.title=enText(document.title);
    document.documentElement.lang='en';
  }

  function makeSwitch(){
    if(window.self!==window.top || document.getElementById('sicLangSwitch')) return;
    var wrap=document.createElement('div');
    wrap.id='sicLangSwitch';
    wrap.setAttribute('aria-label','Language');
    wrap.innerHTML='<button data-lang="ko">한국어</button><span>|</span><button data-lang="en">English</button>';
    var st=document.createElement('style');
    st.textContent='#sicLangSwitch{display:flex;align-items:center;gap:6px;font-family:inherit;font-size:11px;white-space:nowrap;z-index:10001}#sicLangSwitch button{border:0;background:none;padding:5px 2px;cursor:pointer;font:inherit;color:#6b7280}#sicLangSwitch button.on{font-weight:700;color:#0071e3}#sicLangSwitch span{color:#c4c7cc}.appbar #sicLangSwitch{margin-left:auto}.appbar #sicLangSwitch + .tag{margin-left:8px}body>#sicLangSwitch{position:fixed;right:14px;top:12px;background:rgba(255,255,255,.94);border:1px solid rgba(0,0,0,.10);padding:3px 9px;border-radius:999px;box-shadow:0 3px 12px rgba(0,0,0,.08)}';
    document.head.appendChild(st);
    var appbar=document.querySelector('.appbar');
    if(appbar){
      var tag=appbar.querySelector('.tag');
      if(tag) appbar.insertBefore(wrap,tag); else appbar.appendChild(wrap);
    } else document.body.appendChild(wrap);
    Array.prototype.forEach.call(wrap.querySelectorAll('button'),function(btn){
      btn.classList.toggle('on',btn.getAttribute('data-lang')===lang);
      btn.onclick=function(){
        var next=btn.getAttribute('data-lang');
        if(next===lang) return;
        localStorage.setItem(KEY,next);
        // Reload top-level page so Korean can be restored from source as well.
        location.reload();
      };
    });
  }

  // Public API so the app shell can force translation inside same-origin iframes.
  window.SICI18N={
    getLang:function(){return lang;},
    t:function(s){return lang==='en'?enText(String(s)):String(s);},
    apply:function(root){ if(lang==='en') translateTree(root||document); }
  };

  if(lang==='en'){
    var _alert=window.alert, _confirm=window.confirm, _prompt=window.prompt;
    window.alert=function(msg){ return _alert(enText(String(msg))); };
    window.confirm=function(msg){ return _confirm(enText(String(msg))); };
    window.prompt=function(msg,def){ return _prompt(enText(String(msg)),def); };
  }

  function init(){
    makeSwitch();
    if(lang==='en') translateTree(document);
    var mo=new MutationObserver(function(ms){
      if(lang!=='en') return;
      ms.forEach(function(m){
        if(m.type==='characterData') translateTextNode(m.target);
        Array.prototype.forEach.call(m.addedNodes||[],function(n){translateTree(n);});
      });
    });
    mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
