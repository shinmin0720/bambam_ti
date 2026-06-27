const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "웹앱 프로젝트": "92점",
      "디지털 윤리 퀴즈": "88점",
      "수업 참여도": "상",
    },
    traits: [
      "문제 해결 과정을 차분히 설명합니다.",
      "새 도구를 시도할 때 기록을 꼼꼼히 남깁니다.",
      "제출 전 확인 습관을 더 연습하면 좋습니다.",
    ],
    teacherMemo: "프론트엔드 구조 이해가 빠르며, 팀원 질문에 답하는 태도가 좋습니다.",
  },
  {
    id: "10102",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "웹앱 프로젝트": "86점",
      "디지털 윤리 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    traits: [
      "협업 중 역할 분담을 잘 지킵니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    teacherMemo: "기능 구현 의욕이 높고, 오류가 날 때 원인을 함께 추적하려는 태도가 좋습니다.",
  },
  {
    id: "10103",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "웹앱 프로젝트": "89점",
      "디지털 윤리 퀴즈": "95점",
      "수업 참여도": "상",
    },
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    teacherMemo: "질문의 초점이 좋고, 개선 방향을 토의하는 데 적극적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>

    <!-- 보안 점검용 주석 -->
    <!-- 1. 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있다. -->
    <!-- 2. Gemini API 호출은 Vercel Serverless Function에서 처리한다. -->
    <!-- 3. .env 파일은 GitHub에 올리지 않는다. -->
    <!-- 4. Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 한다. -->
    <!-- 5. Gemini로 전송하는 데이터는 이름, 학번, 사진 경로를 제외한 최소 정보로 제한한다. -->
    <section class="counseling-panel" id="counselingPanel" style="margin-top: 40px; padding: 24px; border: 2px solid var(--line); border-radius: 8px; background: var(--surface); box-shadow: var(--shadow);">
      <h3 style="margin-top: 0; color: var(--ink); font-size: 24px;">AI 학생 상담 전략 도우미</h3>
      <p id="counselingEmpty" style="color: var(--muted);">학생 카드의 "상담 전략 요청" 버튼을 클릭하여 학생을 선택해주세요.</p>
      
      <div id="counselingContent" class="hidden">
        <div style="margin-bottom: 20px; padding: 18px; background: var(--surface-strong); border-radius: 8px;">
          <h4 style="margin-top: 0;">선택된 학생 정보 (화면 표시용)</h4>
          <p style="margin: 8px 0;"><strong>이름:</strong> <span id="counselingStudentName"></span> / <strong>학번:</strong> <span id="counselingStudentId"></span></p>
          
          <h4 style="margin: 20px 0 8px;">Gemini 전송용 데이터 (미리보기)</h4>
          <pre id="counselingPreview" style="background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 14px; margin: 0;"></pre>
        </div>

        <div style="margin-bottom: 20px;">
          <label for="teacherConcernInput" style="display: block; font-weight: 800; margin-bottom: 10px; color: var(--ink);">교사 고민 입력</label>
          <textarea id="teacherConcernInput" rows="4" style="width: 100%; padding: 14px; border: 2px solid var(--line); border-radius: 8px; font-family: inherit; font-size: 15px; resize: vertical;" placeholder="수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?"></textarea>
        </div>

        <button id="requestCounselingBtn" class="primary-button" style="width: 100%;">AI 상담 전략 받기</button>
        <p id="counselingStatus" style="margin-top: 12px; font-weight: 800; color: var(--primary); min-height: 24px;"></p>
        
        <div id="counselingResultArea" class="hidden" style="margin-top: 24px; padding: 24px; border: 2px solid var(--primary); border-radius: 8px; background: #eff6ff;">
          <h4 style="margin-top: 0; color: var(--primary-dark); font-size: 20px;">AI 상담 전략 제안</h4>
          <div id="counselingResultContent" style="white-space: pre-wrap; line-height: 1.7; color: var(--ink); font-size: 15px;"></div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--primary); font-size: 13px; color: var(--muted); font-weight: 800;">
            ※ AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
          </div>
        </div>
      </div>
    </section>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");

  setupCounselingPanel();
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
        <button class="primary-button select-student-btn" data-id="${student.id}" style="width: 100%; margin-top: 15px;">상담 전략 요청</button>
      </div>
    </article>
  `;
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

function setupCounselingPanel() {
  const selectBtns = document.querySelectorAll('.select-student-btn');
  const counselingEmpty = document.getElementById('counselingEmpty');
  const counselingContent = document.getElementById('counselingContent');
  const studentNameEl = document.getElementById('counselingStudentName');
  const studentIdEl = document.getElementById('counselingStudentId');
  const previewEl = document.getElementById('counselingPreview');
  const concernInput = document.getElementById('teacherConcernInput');
  const requestBtn = document.getElementById('requestCounselingBtn');
  const statusEl = document.getElementById('counselingStatus');
  const resultArea = document.getElementById('counselingResultArea');
  const resultContent = document.getElementById('counselingResultContent');

  selectBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      const studentId = e.target.getAttribute('data-id');
      const student = STUDENTS.find(s => s.id === studentId);
      if (!student) return;

      const alias = "학생 " + String.fromCharCode(65 + index); // 학생 A, 학생 B...

      counselingEmpty.classList.add('hidden');
      counselingContent.classList.remove('hidden');
      resultArea.classList.add('hidden');
      statusEl.textContent = '';
      
      studentNameEl.textContent = student.name;
      studentIdEl.textContent = student.id;

      const gradeSummary = Object.entries(student.grades).map(entry => entry[0] + ": " + entry[1]).join(', ');
      const learningTraits = student.traits.join(' ') + ' ' + student.teacherMemo;

      const previewData = {
        studentAlias: alias,
        gradeSummary: gradeSummary,
        learningTraits: learningTraits,
        teacherConcern: concernInput.value
      };
      
      previewEl.textContent = JSON.stringify(previewData, null, 2);

      concernInput.oninput = () => {
        previewData.teacherConcern = concernInput.value;
        previewEl.textContent = JSON.stringify(previewData, null, 2);
      };

      requestBtn.onclick = async () => {
        if (!concernInput.value.trim()) {
          statusEl.textContent = '상담 고민을 먼저 입력해주세요.';
          statusEl.style.color = 'var(--danger)';
          return;
        }

        statusEl.textContent = 'AI가 상담 전략을 생성하는 중입니다.';
        statusEl.style.color = 'var(--primary)';
        resultArea.classList.add('hidden');
        requestBtn.disabled = true;
        
        try {
          const response = await fetch('/api/gemini-counseling', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              studentAlias: previewData.studentAlias,
              gradeSummary: previewData.gradeSummary,
              learningTraits: previewData.learningTraits,
              teacherConcern: previewData.teacherConcern
            })
          });

          const resultData = await response.json();

          if (response.ok && resultData.success) {
            statusEl.textContent = '';
            resultContent.textContent = resultData.result;
            resultArea.classList.remove('hidden');
          } else {
            statusEl.textContent = 'AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.';
            statusEl.style.color = 'var(--danger)';
            console.error(resultData.error);
          }
        } catch (error) {
          statusEl.textContent = 'AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.';
          statusEl.style.color = 'var(--danger)';
          console.error(error);
        } finally {
          requestBtn.disabled = false;
        }
      };
      
      counselingContent.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

showOnly(loginView);
