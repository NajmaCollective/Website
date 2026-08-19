"use strict";

(() => {
  const lessonTabs = document.getElementById("lesson-tabs");

  function renderLessonTabs(selectedId) {
    lessonTabs.innerHTML = LESSON_TYPES.map((lesson) => `<button class="chip" type="button" role="tab" data-lesson-id="${lesson.id}" aria-selected="${lesson.id === selectedId}">${escapeHtml(lesson.label)}</button>`).join("");
    lessonTabs.querySelectorAll("[data-lesson-id]").forEach((button) => {
      button.addEventListener("click", () => renderLesson(button.dataset.lessonId));
    });
  }

  function renderLesson(id) {
    const lesson = LESSON_TYPES.find((item) => item.id === id) || LESSON_TYPES[0];
    renderLessonTabs(lesson.id);
    document.getElementById("lesson-icon").textContent = lesson.icon;
    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-description").textContent = lesson.description;
    document.getElementById("lesson-examples").innerHTML = lesson.examples.map((example) => `<li>${icon("arrow_right_alt")}<span>${escapeHtml(example)}</span></li>`).join("");
    document.getElementById("lesson-takeaway").textContent = lesson.takeaway;
  }

  renderLesson(LESSON_TYPES[0].id);
})();
