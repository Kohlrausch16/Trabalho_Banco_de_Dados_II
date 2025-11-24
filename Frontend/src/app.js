import { initUI } from './ui.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    await initUI();
  } catch (err) {
    console.error('Erro iniciando app', err);
    alert('Erro ao iniciar: ' + err.message);
  }
});