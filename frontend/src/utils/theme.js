// src/utils/theme.js

const THEME_KEY = "theme";

/**
 * Alterna entre dark e light
 */
export function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "light";
  const next = current === "light" ? "dark" : "light";

  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);

  return next;
}

/**
 * Aplica o tema no HTML inteiro
 */
export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Carrega tema ao iniciar app
 */
export function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(theme);
  return theme;
}