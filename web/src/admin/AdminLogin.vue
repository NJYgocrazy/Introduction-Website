<template>
  <div class="max-w-md mx-auto">
    <div class="card rounded-xl2 p-6">
      <div class="text-xs tracking-widest uppercase opacity-70">Admin</div>
      <h1 class="text-2xl font-semibold mt-2">{{ t('common.login') }}</h1>
      <p class="text-sm opacity-80 mt-2">Bearer token auth (localStorage).</p>

      <form class="mt-6 space-y-3" @submit.prevent="submit">
        <input v-model="username" class="input rounded-lg px-4 py-2 w-full" placeholder="username" />
        <input
          v-model="password"
          type="password"
          class="input rounded-lg px-4 py-2 w-full"
          placeholder="password"
        />

        <button class="btn btn-primary rounded-lg px-4 py-2 text-sm w-full" :disabled="loading">
          {{ loading ? '...' : t('common.login') }}
        </button>

        <div v-if="error" class="text-sm" style="color: rgb(160 30 30)">
          {{ error }}
        </div>
      </form>

      <div class="mt-6 text-xs opacity-70">
        Seed account: <span class="mono">admin / admin123</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { apiJson } from "../lib/api";
import { useAuthStore } from "../stores/auth";

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();

const username = ref("admin");
const password = ref("admin123");
const loading = ref(false);
const error = ref("");

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    const res = await apiJson<{ token: string }>(
      "/admin/auth/login",
      "POST",
      { username: username.value, password: password.value }
    );
    auth.setToken(res.token);
    await router.push("/admin/dashboard");
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}
</script>
