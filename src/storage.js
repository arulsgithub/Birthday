const KEY = "hp_game_state";

export function loadGame() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveGame(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearGame() {
  localStorage.removeItem(KEY);
}