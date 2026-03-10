import { defineStore } from "pinia";

const TOKEN_KEY = "lab_site_admin_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) ?? ""
  }),
  getters: {
    isAuthed: (s) => Boolean(s.token)
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    },
    logout() {
      this.setToken("");
    }
  }
});
