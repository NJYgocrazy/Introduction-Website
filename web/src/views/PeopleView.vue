<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold mt-2">People</h1>
      </div>

      <input v-model="q" class="input rounded-lg px-4 py-2 text-sm w-full sm:w-72"
        :placeholder="locale === 'zh' ? '\u641c\u7d22\u59d3\u540d/\u5934\u8854...' : 'Search name/title...'" />
    </div>

    <!-- 教师部分 - 单独一行 -->
    <section class="mt-6">
      <div class="flex items-baseline justify-between">
        <h2 class="text-xl font-semibold">Faculty</h2>
        <div class="text-xs opacity-60">{{ teachers.length }}</div>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-4">
        <component v-for="p in teachers" :key="p.id" :is="p.websiteUrl ? 'a' : 'div'"
          class="card rounded-xl2 p-5 hover:opacity-95 transition-opacity" :href="p.websiteUrl || undefined"
          :target="p.websiteUrl ? '_blank' : undefined" :rel="p.websiteUrl ? 'noreferrer' : undefined">
          <div class="flex flex-col sm:flex-row gap-4 sm:items-start">
            <div class="w-full sm:w-36 h-28 overflow-hidden rounded-lg" style="background: rgba(148, 163, 184, 0.20)">
              <img v-if="p.avatarUrl" :src="p.avatarUrl" alt="avatar" class="h-full w-full object-cover" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold opacity-80">{{ pickText(p, 'title') || teacherRoleLabel }}</div>
              <div class="text-2xl font-semibold mt-1 teacher-name truncate">{{ pickText(p, 'name') }}</div>

              <div v-if="p.email" class="text-sm mt-3 inline-flex items-center gap-2"
                style="color: rgb(var(--c-muted))">
                <Mail class="h-4 w-4" />
                <span class="truncate">{{ p.email }}</span>
              </div>
              <div v-else class="text-sm mt-3 opacity-75 line-clamp-2">{{ pickText(p, 'bio') }}</div>
            </div>
          </div>
        </component>

        <div v-if="!teachers.length" class="card rounded-xl2 p-5 text-sm opacity-75">
          {{ locale === 'zh' ? '\u6682\u65e0\u6559\u5e08\u4fe1\u606f\u3002' : 'No faculty data yet.' }}
        </div>
      </div>
    </section>

    <!-- 学生部分 - 单独一行 -->
    <section class="mt-8">
      <div class="flex items-baseline justify-between">
        <h2 class="text-xl font-semibold">Students</h2>
        <div class="text-xs opacity-60">{{ students.length }}</div>
      </div>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="p in students" :key="p.id" class="card rounded-xl2 p-5">
          <div class="font-semibold truncate">{{ pickText(p, 'name') }}</div>
          <div class="text-sm opacity-80 truncate mt-2 inline-flex items-center gap-2">
            <GraduationCap class="h-4 w-4" />
            <span>{{ pickText(p, 'title') || fallbackGrade }}</span>
          </div>
        </div>

        <div v-if="!students.length" class="card rounded-xl2 p-5 text-sm opacity-75">
          {{ locale === 'zh' ? '\u6682\u65e0\u5b66\u751f\u4fe1\u606f\u3002' : 'No student data yet.' }}
        </div>
      </div>
    </section>

    <!-- 其他人员 - 单独一行 -->
    <section v-if="others.length" class="mt-8">
      <div class="flex items-baseline justify-between">
        <h2 class="text-xl font-semibold">Others</h2>
        <div class="text-xs opacity-60">{{ others.length }}</div>
      </div>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="p in others" :key="p.id" class="card rounded-xl2 p-5">
          <div class="font-semibold truncate">{{ pickText(p, 'name') }}</div>
          <div class="text-sm opacity-75 truncate mt-1">{{ pickText(p, 'title') || roleLabel(p.role) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { GraduationCap, Mail } from "lucide-vue-next";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Person = {
  id: number;
  role: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string | null;
  titleEn?: string | null;
  bioZh?: string | null;
  bioEn?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
};

const locale = computed(() => getLocale());
const rows = ref<Person[]>([]);
const q = ref("");

onMounted(async () => {
  rows.value = await apiGet<Person[]>("/public/people").catch(() => []);
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return rows.value;
  return rows.value.filter((p) => {
    const parts = [pickText(p, "name"), pickText(p, "title"), pickText(p, "bio")]
      .join(" ")
      .toLowerCase();
    return parts.includes(query);
  });
});

const teachers = computed(() => filtered.value.filter((p) => isTeacherRole(p.role)));
const students = computed(() => filtered.value.filter((p) => isStudentRole(p.role)));
const others = computed(() => filtered.value.filter((p) => !isTeacherRole(p.role) && !isStudentRole(p.role)));

const fallbackGrade = computed(() => (locale.value === "zh" ? "\u672a\u586b\u5199" : "N/A"));
const teacherRoleLabel = computed(() => (locale.value === "zh" ? "\u8001\u5e08" : "Faculty"));

function isStudentRole(role: string) {
  const r = role.toLowerCase();
  return r === "student" || r === "phd" || r === "master";
}

function isTeacherRole(role: string) {
  const r = role.toLowerCase();
  return r === "teacher" || r === "faculty";
}

function roleLabel(role: string) {
  const r = role.toLowerCase();
  if (locale.value === "zh") {
    if (r === "teacher" || r === "faculty") return "Faculty";
    if (r === "student" || r === "phd" || r === "master") return "Students";
    if (r === "alumni") return "\u6821\u53cb";
    return "\u6210\u5458";
  }

  if (r === "teacher") return "Faculty";
  if (r === "faculty") return "Faculty";
  if (r === "student") return "Students";
  if (r === "phd") return "PhD Students";
  if (r === "master") return "Master Students";
  if (r === "alumni") return "Alumni";
  return "People";
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.teacher-name {
  color: #743481;
}
</style>