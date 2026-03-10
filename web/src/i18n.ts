import { createI18n } from "vue-i18n";

const STORAGE_KEY = "lab_site_locale";

function getInitialLocale(): "zh" | "en" {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "en" ? "en" : "zh";
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: "zh",
  messages: {
    zh: {
      nav: {
        home: "首页",
        publications: "文章",
        people: "人员",
        awards: "奖项成就",
        recruitment: "招聘",
        admin: "管理"
      },
      common: {
        search: "搜索",
        save: "保存",
        cancel: "取消",
        create: "新增",
        edit: "编辑",
        delete: "删除",
        logout: "退出登录",
        login: "登录"
      },
      admin: {
        dashboard: "后台管理",
        sections: {
          lab: "实验室信息",
          carousel: "轮播图",
          areas: "研究方向",
          publications: "文章",
          people: "人员",
          awards: "奖项",
          recruitment: "招聘",
          contact: "联系方式",
          upload: "上传"
        }
      }
    },
    en: {
      nav: {
        home: "Home",
        publications: "Publications",
        people: "People",
        awards: "Awards",
        recruitment: "Recruitment",
        admin: "Admin"
      },
      common: {
        search: "Search",
        save: "Save",
        cancel: "Cancel",
        create: "Create",
        edit: "Edit",
        delete: "Delete",
        logout: "Logout",
        login: "Login"
      },
      admin: {
        dashboard: "Admin Dashboard",
        sections: {
          lab: "Lab Profile",
          carousel: "Carousel",
          areas: "Research Areas",
          publications: "Publications",
          people: "People",
          awards: "Awards",
          recruitment: "Recruitment",
          contact: "Contact",
          upload: "Upload"
        }
      }
    }
  }
});

export function setLocale(locale: "zh" | "en") {
  // vue-i18n stores locale as a ref in composition mode
  // @ts-expect-error - vue-i18n typing
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function getLocale(): "zh" | "en" {
  // @ts-expect-error - vue-i18n typing
  return i18n.global.locale.value as "zh" | "en";
}
