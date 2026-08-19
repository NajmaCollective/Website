"use strict";

(() => {
  const focusFilter = document.getElementById("focus-filter");
  const languageFilter = document.getElementById("language-filter");
  const teacherList = document.getElementById("teacher-list");
  const teacherProfile = document.getElementById("teacher-profile");
  const finderLayout = document.getElementById("finder-layout");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  let selectedTeacherId = TEACHERS[0].id;

  const darkSchemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const calendarThemeParams = () => (darkSchemeQuery && darkSchemeQuery.matches
    ? "background_color=10110e&text_color=e4e7e5&primary_color=9ed5b4"
    : "background_color=ffffff&text_color=191c1a&primary_color=386a50");

  function populateSelect(select, firstLabel, values) {
    select.innerHTML = `<option value="">${firstLabel}</option>` + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  }

  const allFocuses = [...new Set(TEACHERS.flatMap((teacher) => teacher.focus))].sort();
  const allLanguages = [...new Set(TEACHERS.flatMap((teacher) => teacher.languages))].sort();
  populateSelect(focusFilter, "All lesson goals", allFocuses);
  populateSelect(languageFilter, "All support languages", allLanguages);

  function visibleTeachers() {
    return TEACHERS.filter((teacher) => {
      const focusMatches = focusFilter.value === "" || teacher.focus.includes(focusFilter.value);
      const languageMatches = languageFilter.value === "" || teacher.languages.includes(languageFilter.value);
      return focusMatches && languageMatches;
    });
  }

  function renderTeacherList(list) {
    teacherList.innerHTML = list.map((teacher) => `
      <button class="teacher-list-card" type="button" data-teacher-id="${teacher.id}" aria-pressed="${teacher.id === selectedTeacherId}">
        <span class="avatar">${escapeHtml(teacher.initials)}</span>
        <span class="teacher-list-copy">
          <span class="teacher-name-row"><strong>${escapeHtml(teacher.name)}</strong>${teacher.live ? '<span class="status-badge">Booking open</span>' : ""}</span>
          <span>${escapeHtml(teacher.city)}</span>
          <span class="teacher-focus">${escapeHtml(teacher.focus.slice(0, 2).join(" · "))}</span>
        </span>
        <span class="teacher-price">£${teacher.rate}<small>per hour</small></span>
        ${icon("chevron_right")}
      </button>
    `).join("");

    teacherList.querySelectorAll("[data-teacher-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTeacherId = button.dataset.teacherId;
        renderFinder();
      });
    });
  }

  function renderTeacherProfile(teacher) {
    const specialisms = teacher.focus.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("");
    const supportLanguage = teacher.languages.length === 1 ? teacher.languages[0] : teacher.languages.join(" and ");
    const calendar = teacher.calendar ? `
      <div class="inline-booking">
        <div class="booking-heading">
          <div>
            <p class="profile-kicker">Book with ${escapeHtml(teacher.name.split(" ")[0])}</p>
            <h4>Choose a day and time.</h4>
            <p>The calendar is already shown in your local time zone.</p>
          </div>
          <a class="calendar-fallback" href="${escapeHtml(teacher.calendar)}" rel="noreferrer" target="_blank">Calendar help ${icon("open_in_new")}</a>
        </div>
        <div class="calendar-container">
          <iframe loading="eager" src="${escapeHtml(teacher.calendar)}?embed_type=Inline&hide_gdpr_banner=1&${calendarThemeParams()}" title="${escapeHtml(teacher.name)} booking calendar"></iframe>
          <p>Choose an available time above to continue the booking inside the calendar.</p>
        </div>
      </div>
    ` : `
      <div class="profile-draft-note">
        <div>${icon("event_busy")}<h4>Founding profile in preparation</h4><p>This example shows how the teacher’s approach and availability will appear. Booking will open after the teacher confirms their profile and calendar.</p></div>
      </div>
    `;

    teacherProfile.innerHTML = `
      <div class="profile-top">
        <span class="avatar avatar-large">${escapeHtml(teacher.initials)}</span>
        <div>
          <p class="profile-kicker">${teacher.live ? "Founding teacher" : "Illustrative founding profile"}</p>
          <h3>${escapeHtml(teacher.name)}</h3>
          <p class="profile-location">${icon("location_on")} ${escapeHtml(teacher.city)}</p>
        </div>
        <div class="profile-rate"><strong>£${teacher.rate}</strong><span>${teacher.live ? "current booking rate" : "illustrative rate"}</span></div>
      </div>
      <p class="credentials">${icon("verified", true)} ${escapeHtml(teacher.credentials)}</p>
      <p class="profile-bio">${escapeHtml(teacher.bio)}</p>
      <div class="chip-group" aria-label="Teaching specialisms">${specialisms}</div>
      <p class="language-note">${icon("translate")} Can explain key points in ${escapeHtml(supportLanguage)}.</p>
      ${calendar}
    `;
  }

  function renderFinder() {
    const list = visibleTeachers();
    resultCount.textContent = `${list.length} ${list.length === 1 ? "teacher" : "teachers"}`;

    if (list.length === 0) {
      finderLayout.hidden = true;
      emptyState.hidden = false;
      return;
    }

    finderLayout.hidden = false;
    emptyState.hidden = true;
    if (list.every((teacher) => teacher.id !== selectedTeacherId)) selectedTeacherId = list[0].id;
    const selectedTeacher = list.find((teacher) => teacher.id === selectedTeacherId);
    renderTeacherList(list);
    renderTeacherProfile(selectedTeacher);
  }

  focusFilter.addEventListener("change", renderFinder);
  languageFilter.addEventListener("change", renderFinder);
  document.getElementById("clear-filters").addEventListener("click", () => {
    focusFilter.value = "";
    languageFilter.value = "";
    renderFinder();
  });

  if (darkSchemeQuery) darkSchemeQuery.addEventListener("change", renderFinder);

  renderFinder();
})();
