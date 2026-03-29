<template>
  <div v-if="person" class="person-page grid grid-cols-1 gap-6 lg:grid-cols-12">
    <section class="profile-pane card rounded-xl2 p-6 lg:col-span-4">
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
          {{ locale === "zh" ? "发送邮件" : "Email" }}
        </a>
        <a
          v-if="person.websiteUrl"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="person.websiteUrl"
          target="_blank"
          rel="noreferrer"
        >
          {{ locale === "zh" ? "个人主页" : "Website" }}
        </a>
      </div>

      <RouterLink class="btn btn-primary mt-6 w-full rounded-lg px-4 py-2 text-sm" to="/people">
        {{ locale === "zh" ? "返回人员列表" : "Back to People" }}
      </RouterLink>
    </section>

    <section class="lg:col-span-8 space-y-5">
      <div class="intro-band card rounded-xl2 p-5">
        <div class="text-xs uppercase tracking-[0.18em] opacity-70">
          {{ locale === "zh" ? "个人信息" : "Profile" }}
        </div>
        <div class="mt-2 text-lg font-semibold leading-8">
          {{ summaryLine }}
        </div>
      </div>

      <div v-if="isTeacher" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock
          :title="locale === 'zh' ? '个人简历' : 'Biography'"
          :content="pickText(person, 'teacherResume')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '主要研究领域' : 'Research Areas'"
          :content="pickText(person, 'teacherResearch')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '代表性成果' : 'Representative Achievements'"
          :content="pickText(person, 'teacherAchievements')"
          class="sm:col-span-2"
        />
      </div>

      <div v-else-if="isStudent" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock
          :title="locale === 'zh' ? '主研方向' : 'Research Focus'"
          :content="pickText(person, 'studentResearch')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '获得奖项' : 'Awards'"
          :content="pickText(person, 'studentAwards')"
        />
        <InfoBlock
          :title="locale === 'zh' ? '就业情况' : 'Employment'"
          :content="pickText(person, 'studentEmployment')"
          class="sm:col-span-2"
        />
      </div>

      <InfoBlock
        v-else
        :title="locale === 'zh' ? '成员介绍' : 'Member Profile'"
        :content="pickText(person, 'bio')"
      />

      <div v-if="awards.length" class="card rounded-xl2 p-6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold">{{ locale === "zh" ? "获奖记录" : "Awards & Honors" }}</h2>
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
    {{ locale === "zh" ? "加载中或未找到该成员。" : "Loading or not found." }}
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
    content: { type: String, default: "" }
  },
  setup(props) {
    return () =>
      h("article", { class: "card info-block rounded-xl2 p-5" }, [
        h("div", { class: "text-xs uppercase tracking-[0.14em] font-semibold opacity-70" }, props.title),
        h(
          "div",
          { class: "mt-3 text-sm leading-7 whitespace-pre-line opacity-90" },
          props.content?.trim() || "-"
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

const fallbackTitle = computed(() => (locale.value === "zh" ? "未填写头衔" : "Title not specified"));

const roleText = computed(() => {
  if (locale.value !== "zh") return person.value?.role ?? "Member";
  if (isTeacher.value) return "教师";
  if (isStudent.value) return "学生";
  return person.value?.role ?? "成员";
});

const summaryLine = computed(() => {
  if (locale.value === "zh") {
    if (isTeacher.value) return "聚焦科研方向、教学经历与代表性成果。";
    if (isStudent.value) return "展示研究方向、奖项与发展路径。";
    return "查看该成员的个人信息与相关经历。";
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

<style scoped>
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
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.info-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.11);
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
}
</style>
