const BASE = "http://127.0.0.1:5000";

export const newGame = (rows, cols) =>
  fetch(`${BASE}/new_game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows, cols }),
  }).then(r => r.json());

export const moveAgent = (pos) =>
  fetch(`${BASE}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pos }),
  }).then(r => r.json());

export const getSuggestion = () =>
  fetch(`${BASE}/suggest`).then(r => r.json());