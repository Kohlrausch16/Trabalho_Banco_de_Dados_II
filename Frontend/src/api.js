// api.js
const BASE_URL = "http://localhost:8080";

async function handleResponse(res) {
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return text ? JSON.parse(text) : null;
}

// Usuários
async function listUsers() {
  const res = await fetch(`${BASE_URL}/usuario`);
  return handleResponse(res);
}

async function createUser(body) {
  const res = await fetch(`${BASE_URL}/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handleResponse(res);
}

async function getUser(id) {
  const res = await fetch(`${BASE_URL}/usuario/${id}`);
  return handleResponse(res);
}

// Atividades
async function listActivities() {
  const res = await fetch(`${BASE_URL}/compromisso`);
  return handleResponse(res);
}

async function getActivity(id) {
  const res = await fetch(`${BASE_URL}/compromisso/${id}`);
  return handleResponse(res);
}

async function createActivity(body) {
  const res = await fetch(`${BASE_URL}/compromisso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handleResponse(res);
}

async function updateActivity(id, body) {
  const res = await fetch(`${BASE_URL}/compromisso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handleResponse(res);
}

async function deleteActivity(id) {
  const res = await fetch(`${BASE_URL}/compromisso/${id}`, {
    method: "DELETE"
  });
  return handleResponse(res);
}

// Torna todas as funções globais
window.listUsers = listUsers;
window.createUser = createUser;
window.getUser = getUser;
window.listActivities = listActivities;
window.getActivity = getActivity;
window.createActivity = createActivity;
window.updateActivity = updateActivity;
window.deleteActivity = deleteActivity;