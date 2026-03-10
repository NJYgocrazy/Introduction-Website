<template>
  <footer class="mt-10">
    <div class="mx-auto max-w-6xl px-4 sm:px-8 pb-10">
      <div class="card rounded-xl2 p-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div class="text-sm opacity-70">Contact</div>
            <div class="text-lg font-semibold mt-1">{{ emailOrPlaceholder }}</div>
            <div class="text-sm opacity-80 mt-2">{{ addressText }}</div>
            <div class="text-sm opacity-80" v-if="contact?.phone">{{ contact.phone }}</div>
          </div>

          <div class="flex flex-wrap gap-2 items-center" v-if="linkEntries.length">
            <a
              v-for="[k, v] in linkEntries"
              :key="k"
              class="btn rounded-lg px-3 py-2 text-sm hover:opacity-90"
              :href="String(v)"
              target="_blank"
              rel="noreferrer"
            >
              {{ k }}
            </a>
          </div>
        </div>

        <div class="mt-6 text-xs opacity-60">
          © {{ new Date().getFullYear() }} Lab Website
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";

type ContactInfo = {
  id: number;
  addressZh?: string | null;
  addressEn?: string | null;
  email?: string | null;
  phone?: string | null;
  links?: Record<string, unknown> | null;
};

const contact = ref<ContactInfo | null>(null);

onMounted(async () => {
  try {
    contact.value = await apiGet<ContactInfo>("/public/contact");
  } catch {
    contact.value = null;
  }
});

const addressText = computed(() => (contact.value ? pickText(contact.value, "address") : ""));
const emailOrPlaceholder = computed(() => contact.value?.email ?? "lab@example.edu");

const linkEntries = computed(() => {
  const obj = contact.value?.links;
  if (!obj || typeof obj !== "object") return [] as Array<[string, unknown]>;
  return Object.entries(obj).filter(([, v]) => typeof v === "string" && String(v).startsWith("http"));
});
</script>
