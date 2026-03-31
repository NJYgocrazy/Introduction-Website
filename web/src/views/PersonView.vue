<template>
  <div v-if="person" class="person-page grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
    <section class="profile-pane card rounded-xl2 p-6 lg:col-span-4 h-fit">
      <div class="profile-top">
        <div class="badge-row">
          <span class="role-chip">{{ roleText }}</span>
        </div>

        <div class="avatar-wrap">
          <img
            v-if="person.avatarUrl"
            :src="person.avatarUrl"
            :alt="pickText(person, 'name')"
            class="h-full w-full object-cover"
          />
          <span v-else class="avatar-fallback">{{ initials }}</span>
        </div>

        <h1 class="name-text">{{ pickText(person, "name") }}</h1>
        <p class="title-text">{{ pickText(person, "title") || fallbackTitle }}</p>

        <p v-if="pickText(person, 'bio')" class="bio-text">
          {{ pickText(person, "bio") }}
        </p>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <a
          v-if="person.email"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="`mailto:${person.email}`"
        >
          {{ locale === "zh" ? "\u53d1\u9001\u90ae\u4ef6" : "Email" }}
        </a>
        <a
          v-if="person.websiteUrl"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="person.websiteUrl"
          target="_blank"
          rel="noreferrer"
        >
          {{ locale === "zh" ? "\u4e2a\u4eba\u4e3b\u9875" : "Website" }}
        </a>
      </div>

      <RouterLink class="btn btn-primary mt-6 w-full rounded-lg px-4 py-2 text-sm" to="/people">
        {{ locale === "zh" ? "\u8fd4\u56de\u4eba\u5458\u5217\u8868" : "Back to People" }}
      </RouterLink>
    </section>

    <section class="lg:col-span-8 space-y-5">
      <div class="intro-band card rounded-xl2 p-5">
        <div class="text-xs uppercase tracking-[0.18em] opacity-70">
          {{ locale === "zh" ? "\u4e2a\u4eba\u4fe1\u606f" : "Profile" }}
        </div>
        <div class="mt-2 text-lg font-semibold leading-8">
          {{ summaryLine }}
        </div>
      </div>

      <div v-if="isTeacher" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock
          :title="locale === 'zh' ? '\u4e2a\u4eba\u7b80\u5386' : 'Biography'"
          tone="biography"
          :content="pickText(person, 'teacherResume')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '\u4e3b\u8981\u7814\u7a76\u9886\u57df' : 'Research Areas'"
          tone="research"
          :content="pickText(person, 'teacherResearch')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '\u4ee3\u8868\u6027\u6210\u679c' : 'Representative Achievements'"
          tone="achievement"
          :content="pickText(person, 'teacherAchievements')"
          class="sm:col-span-2"
        />
      </div>

      <div v-else-if="isStudent" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock
          :title="locale === 'zh' ? '\u4e3b\u7814\u65b9\u5411' : 'Research Focus'"
          :content="pickText(person, 'studentResearch')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '\u83b7\u5f97\u5956\u9879' : 'Awards'"
          :content="pickText(person, 'studentAwards')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '\u5c31\u4e1a\u60c5\u51b5' : 'Employment'"
          :content="pickText(person, 'studentEmployment')"
          class="sm:col-span-2"
        />
      </div>

      <InfoBlock
        v-else
        :title="locale === 'zh' ? '\u6210\u5458\u4ecb\u7ecd' : 'Member Profile'"
        :content="pickText(person, 'bio')"
      />

      <div v-if="awards.length" class="card rounded-xl2 p-6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold">{{ locale === "zh" ? "\u83b7\u5956\u8bb0\u5f55" : "Awards & Honors" }}</h2>
          <span class="text-xs opacity-65">{{ awards.length }}</span>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <article v-for="a in awards" :key="a.id" class="award-item rounded-lg p-4">
            <h3 class="text-base font-semibold">{{ pickText(a, "title") }}</h3>
            <p v-if="pickText(a, 'desc')" class="mt-1 text-sm opacity-80 leading-6 whitespace-pre-line">
              {{ pickText(a, "desc") }}
            </p>
            <p v-if="a.date" class="mt-2 text-xs opacity-60">{{ formatDate(a.date) }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="card rounded-xl2 p-6 text-sm opacity-80">
    {{ locale === "zh" ? "\u52a0\u8f7d\u4e2d\u6216\u672a\u627e\u5230\u8be5\u6210\u5458\u3002" : "Loading or not found." }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Award = {
  id: number;
  titleZh: string;
  titleEn: string;
  descZh?: string | null;
  descEn?: string | null;
  date?: string | null;
};

type PersonDetail = {
  id: number;
  role: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string | null;
  titleEn?: string | null;
  bioZh?: string | null;
  bioEn?: string | null;
  teacherResumeZh?: string | null;
  teacherResumeEn?: string | null;
  teacherResearchZh?: string | null;
  teacherResearchEn?: string | null;
  teacherAchievementsZh?: string | null;
  teacherAchievementsEn?: string | null;
  studentResearchZh?: string | null;
  studentResearchEn?: string | null;
  studentAwardsZh?: string | null;
  studentAwardsEn?: string | null;
  studentEmploymentZh?: string | null;
  studentEmploymentEn?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  awards: Award[];
};

const InfoBlock = defineComponent({
  name: "InfoBlock",
  props: {
    title: { type: String, required: true },
    tone: { type: String, default: "biography" },
    content: { type: String, default: "" }
  },
  setup(props) {
    const content = props.content?.trim() || "-";
    return () =>
      h("article", { class: `card info-block info-block--${props.tone} rounded-xl2 p-5` }, [
        h("div", { class: "info-block-head" }, [
          h("h3", { class: "info-block-title" }, props.title)
        ]),
        h(
          "div",
          { class: "info-block-body", "data-empty": content === "-" ? "true" : "false" },
          content
        )
      ]);
  }
});

const route = useRoute();
const locale = computed(() => getLocale());

const person = ref<PersonDetail | null>(null);
const awards = computed(() => person.value?.awards ?? []);

const role = computed(() => String(person.value?.role ?? "").toLowerCase());
const isTeacher = computed(() => role.value === "teacher" || role.value === "faculty");
const isStudent = computed(() => role.value === "student" || role.value === "phd" || role.value === "master");

const fallbackTitle = computed(() => (locale.value === "zh" ? "\u672a\u586b\u5199\u5934\u8854" : "Title not specified"));

const roleText = computed(() => {
  if (locale.value !== "zh") return person.value?.role ?? "Member";
  if (isTeacher.value) return "\u6559\u5e08";
  if (isStudent.value) return "\u5b66\u751f";
  return person.value?.role ?? "\u6210\u5458";
});

const summaryLine = computed(() => {
  if (locale.value === "zh") {
    if (isTeacher.value) return "\u805a\u7126\u79d1\u7814\u65b9\u5411\u3001\u6559\u5b66\u7ecf\u5386\u4e0e\u4ee3\u8868\u6027\u6210\u679c\u3002";
    if (isStudent.value) return "\u5c55\u793a\u7814\u7a76\u65b9\u5411\u3001\u5956\u9879\u4e0e\u53d1\u5c55\u8def\u5f84\u3002";
    return "\u67e5\u770b\u8be5\u6210\u5458\u7684\u4e2a\u4eba\u4fe1\u606f\u4e0e\u76f8\u5173\u7ecf\u5386\u3002";
  }

  if (isTeacher.value) return "Focuses on research themes, teaching background, and representative outcomes.";
  if (isStudent.value) return "Highlights research interests, awards, and career progression.";
  return "Explore this member's profile and background.";
});

const initials = computed(() => {
  const name = pickText(person.value ?? {}, "name").trim();
  if (!name) return "?";

  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    return `${tokens[0][0] ?? ""}${tokens[1][0] ?? ""}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale.value === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

async function load() {
  person.value = null;
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) return;
  person.value = await apiGet<PersonDetail>(`/public/people/${id}`).catch(() => null);
}

onMounted(load);
watch(() => route.params.id, load);
</script>

<style >
.person-page {
  position: relative;
}

.profile-pane {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 10%, rgba(15, 58, 120, 0.12), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.94));
}

.profile-pane::after {
  content: "";
  position: absolute;
  inset: auto -56px -56px auto;
  width: 170px;
  height: 170px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(15, 58, 120, 0.20), rgba(15, 58, 120, 0));
  pointer-events: none;
}

.profile-top {
  position: relative;
  z-index: 1;
}

.badge-row {
  margin-bottom: 0.9rem;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(15, 58, 120, 0.28);
  background: rgba(15, 58, 120, 0.08);
  color: rgb(15 58 120);
  border-radius: 999px;
  padding: 0.32rem 0.72rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.avatar-wrap {
  width: 6.7rem;
  height: 6.7rem;
  border-radius: 999px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
  background: linear-gradient(135deg, rgba(15, 58, 120, 0.3), rgba(71, 85, 105, 0.45));
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-fallback {
  color: rgba(255, 255, 255, 0.94);
  font-size: 1.45rem;
  letter-spacing: 0.06em;
  font-weight: 700;
}

.name-text {
  margin-top: 1rem;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
}

.title-text {
  margin-top: 0.45rem;
  font-size: 0.98rem;
  opacity: 0.8;
}

.bio-text {
  margin-top: 1rem;
  font-size: 0.95rem;
  line-height: 1.75;
  opacity: 0.88;
  white-space: pre-line;
}

.intro-band {
  background:
    linear-gradient(120deg, rgba(15, 58, 120, 0.09), rgba(15, 58, 120, 0.02)),
    rgb(var(--c-surface));
}

.info-block {
  position: relative;
  overflow: hidden;
  border-color: rgba(148, 163, 184, 0.38);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.info-block::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  opacity: 0.9;
}

.info-block-head {
  display: flex;
  flex-direction: column;
  gap: 0.58rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.34);
  padding-bottom: 0.82rem;
}

.info-block-title {
  margin: 0;
  display: inline-flex;
  align-self: flex-start;
  padding: 0.28rem 0.7rem;
  border-radius: 0.7rem;
  /* font-size: 1.34rem !important; */
  line-height: 1.2;
  font-weight: 900 !important;
  letter-spacing: 0.01em;
  color: rgba(15, 23, 42, 1);
  background: rgba(15, 23, 42, 0.05);
  /* font-weight: bold; */
}

.info-block-body {
  margin-top: 0.82rem;
  padding-top: 0.05rem;
  font-size: 0.96rem;
  line-height: 1.72;
  font-weight: 500;
  white-space: pre-line;
  color: rgba(71, 85, 105, 0.92);
}

.info-block-body[data-empty="true"] {
  color: rgba(100, 116, 139, 0.92);
  font-style: italic;
}

.info-block--biography .info-block-title {
  color: rgba(30, 64, 175, 1);
  background: rgba(30, 64, 175, 0.12);
}

.info-block--biography::before {
  background: linear-gradient(180deg, rgba(30, 64, 175, 0.95), rgba(30, 64, 175, 0.35));
}

.info-block--research .info-block-title {
  color: rgba(6, 95, 70, 1);
  background: rgba(6, 95, 70, 0.12);
}

.info-block--research::before {
  background: linear-gradient(180deg, rgba(6, 95, 70, 0.92), rgba(6, 95, 70, 0.34));
}

.info-block--achievement .info-block-title {
  color: rgba(146, 64, 14, 1);
  background: rgba(146, 64, 14, 0.12);
}

.info-block--achievement::before {
  background: linear-gradient(180deg, rgba(146, 64, 14, 0.94), rgba(146, 64, 14, 0.35));
}

.info-block:hover {
  transform: translateY(-3px);
  border-color: rgba(15, 58, 120, 0.35);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
}

.award-item {
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.95));
}

@media (prefers-reduced-motion: reduce) {
  .info-block {
    transition: none;
  }
}

@media (max-width: 1023px) {
  .name-text {
    font-size: 1.55rem;
  }

  .avatar-wrap {
    width: 5.9rem;
    height: 5.9rem;
  }

  .info-block-title {
    font-size: 1.2rem !important;
    line-height: 1.2;
  }

  .info-block-body {
    font-size: 0.92rem;
    line-height: 1.74;
  }
}
</style>