import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./views/HomeView.vue";
import PublicationsView from "./views/PublicationsView.vue";
import PeopleView from "./views/PeopleView.vue";
import PersonView from "./views/PersonView.vue";
import AwardsView from "./views/AwardsView.vue";
import RecruitmentView from "./views/RecruitmentView.vue";

import AdminLogin from "./admin/AdminLogin.vue";
import AdminDashboard from "./admin/AdminDashboard.vue";

const TOKEN_KEY = "lab_site_admin_token";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/publications", component: PublicationsView },
    { path: "/people", component: PeopleView },
    { path: "/people/:id", component: PersonView, props: true },
    { path: "/awards", component: AwardsView },
    { path: "/recruitment", component: RecruitmentView },

    { path: "/admin", redirect: "/admin/login" },
    { path: "/admin/login", component: AdminLogin },
    {
      path: "/admin/dashboard",
      component: AdminDashboard,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  if (!to.meta?.requiresAuth) return true;
  const token = localStorage.getItem(TOKEN_KEY) ?? "";
  if (token) return true;
  return { path: "/admin/login" };
});
