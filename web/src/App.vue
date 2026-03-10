<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />

    <main class="flex-1 px-4 sm:px-8">
      <div class="max-w-6xl mx-auto py-8">
        <RouterView v-slot="{ Component }">
          <component :is="Component" class="page-enter" />
        </RouterView>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>
