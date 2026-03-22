<template>
  <footer
    class="mt-12 border-t"
    style="border-color: rgb(var(--c-border)); background: rgb(var(--c-surface))"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-8 py-10">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <div class="text-xs tracking-widest uppercase" style="color: rgb(var(--c-muted))">Contact</div>
          <div class="text-base font-semibold mt-2">{{ emailOrPlaceholder }}</div>
          <div class="text-sm mt-2" style="color: rgb(var(--c-muted))">{{ addressText }}</div>
          <div class="text-sm mt-1" style="color: rgb(var(--c-muted))" v-if="contact?.phone">
            {{ contact.phone }}
          </div>
        </div>

        <!-- <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm" v-if="linkEntries.length">
          <a
            v-for="[k, v] in linkEntries"
            :key="k"
            class="footer-link"
            :href="String(v)"
            target="_blank"
            rel="noreferrer"
          >
            {{ k }}
          </a>
        </div> -->
      </div>

      <div class="mt-8 text-xs" style="color: rgb(var(--c-muted))">
        © {{ new Date().getFullYear() }} Lab Website
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

<style scoped>
.footer-link {
  color: rgb(var(--c-accent));
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
