<template>
  <div class="card rounded-xl2 p-5">
    <div class="text-xs tracking-widest uppercase opacity-70">{{ label }}</div>
    <div class="text-sm opacity-80 mt-2">
      {{ locale === "zh" ? "上传图片后可复制 URL 填入表单。" : "Upload then copy the URL into forms." }}
    </div>

    <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <input type="file" accept="image/*" @change="onPick" />
      <button
        type="button"
        class="btn btn-primary rounded-lg px-4 py-2 text-sm"
        :disabled="!file || loading"
        @click.prevent="upload"
      >
        {{ loading ? "..." : locale === "zh" ? "上传" : "Upload" }}
      </button>
    </div>

    <div v-if="file" class="mt-2 text-xs opacity-70">
      {{ locale === "zh" ? "已选择：" : "Selected: " }}{{ file.name }}
    </div>

    <div v-if="result" class="mt-4">
      <div class="text-xs opacity-70">Relative</div>
      <div class="mono text-sm mt-1 select-all">{{ result.url }}</div>

      <div class="text-xs opacity-70 mt-3">Full</div>
      <div class="mono text-sm mt-1 select-all">{{ fullUrl }}</div>

      <div class="mt-3 flex gap-2">
        <button type="button" class="btn rounded-lg px-3 py-2 text-sm" @click.prevent="copy(result.url)">
          {{ locale === "zh" ? "复制相对地址" : "Copy Relative" }}
        </button>
        <button type="button" class="btn rounded-lg px-3 py-2 text-sm" @click.prevent="copy(fullUrl)">
          {{ locale === "zh" ? "复制完整地址" : "Copy Full" }}
        </button>
      </div>

      <div v-if="isImageUrl(fullUrl)" class="mt-4">
        <img :src="fullUrl" alt="uploaded" class="rounded-lg max-h-56" />
      </div>
    </div>

    <div v-if="error" class="mt-3 text-sm" style="color: rgb(160 30 30)">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { apiAdminUpload, apiBaseUrl } from "../../lib/api";
import { getLocale } from "../../i18n";

const props = defineProps<{ token: string; label?: string }>();

const file = ref<File | null>(null);
const loading = ref(false);
const error = ref("");
const result = ref<{ filename: string; url: string } | null>(null);

const locale = computed(() => getLocale());
const label = computed(() => props.label ?? (locale.value === "zh" ? "上传" : "Upload"));

const fullUrl = computed(() => {
  if (!result.value) return "";
  const url = String(result.value.url ?? "");
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl()}${url}`;
});

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  file.value = input.files?.[0] ?? null;
  if (file.value) {
    void upload();
  }
}

async function upload() {
  if (!file.value) return;
  if (!props.token) {
    error.value = locale.value === "zh" ? "未登录或登录已过期，请重新登录后台。" : "Not logged in. Please login again.";
    return;
  }

  error.value = "";
  loading.value = true;
  try {
    result.value = await apiAdminUpload("/admin/uploads", props.token, file.value);
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

function isImageUrl(url: string) {
  return /^https?:\/\//i.test(url) || /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(url) || url.includes("/uploads/");
}
</script>