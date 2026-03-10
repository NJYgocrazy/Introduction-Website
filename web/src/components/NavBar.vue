<template>
  <header class="sticky top-0 z-50">
    <div class="mx-auto max-w-6xl px-4 sm:px-8 py-4">
      <div class="card rounded-xl2 px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="flex items-baseline gap-2">
          <span class="text-xl font-semibold tracking-tight">Lab</span>
          <span class="text-xs opacity-70">Site</span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-5 text-sm">
          <RouterLink class="hover:opacity-80" to="/">{{ t("nav.home") }}</RouterLink>
          <RouterLink class="hover:opacity-80" to="/publications">{{ t("nav.publications") }}</RouterLink>
          <RouterLink class="hover:opacity-80" to="/people">{{ t("nav.people") }}</RouterLink>
          <RouterLink class="hover:opacity-80" to="/awards">{{ t("nav.awards") }}</RouterLink>
          <RouterLink class="hover:opacity-80" to="/recruitment">{{ t("nav.recruitment") }}</RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <button
            class="btn rounded-lg px-3 py-1.5 text-xs hover:opacity-90"
            @click="toggleLocale"
          >
            {{ localeLabel }}
          </button>

          <RouterLink
            class="btn btn-primary rounded-lg px-3 py-1.5 text-xs hover:opacity-90"
            :to="adminHref"
          >
            {{ t("nav.admin") }}
          </RouterLink>
        </div>
      </div>

      <div class="md:hidden mt-3 flex flex-wrap gap-2 text-sm">
        <RouterLink class="btn rounded-lg px-3 py-2" to="/">{{ t("nav.home") }}</RouterLink>
        <RouterLink class="btn rounded-lg px-3 py-2" to="/publications">{{ t("nav.publications") }}</RouterLink>
        <RouterLink class="btn rounded-lg px-3 py-2" to="/people">{{ t("nav.people") }}</RouterLink>
        <RouterLink class="btn rounded-lg px-3 py-2" to="/awards">{{ t("nav.awards") }}</RouterLink>
        <RouterLink class="btn rounded-lg px-3 py-2" to="/recruitment">{{ t("nav.recruitment") }}</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";

import { getLocale, setLocale } from "../i18n";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const { t } = useI18n();

const adminHref = computed(() => (auth.isAuthed ? "/admin/dashboard" : "/admin/login"));

const localeLabel = computed(() => (getLocale() === "zh" ? "EN" : "中文"));

function toggleLocale() {
  const next = getLocale() === "zh" ? "en" : "zh";
  setLocale(next);
}
</script>
