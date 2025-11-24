async function loadMonthView() {
  const container = document.getElementById("content");
  container.innerHTML = "";

  const month = window.currentMonth || new Date();
  const year = month.getFullYear();
  const m = month.getMonth();

  let activities = [];
  const grouped = {};
  try {
    activities = await listActivities();
    activities.forEach(a => {
      const key = new Date(a.activityDateTime).toISOString().slice(0, 10);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
  } catch (err) {
    // Se falhar, apenas mostra o calendário vazio
    console.warn('Falha ao buscar compromissos:', err);
  }

  const matrix = buildMonthMatrix(year, m);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-7 gap-2";

  matrix.forEach(week => {
    week.forEach(day => {
      const cell = document.createElement("div");
      cell.className = "bg-white rounded shadow p-2 min-h-[110px]";

      if (!day) {
        cell.classList.add("bg-gray-50");
        grid.appendChild(cell);
        return;
      }

      const num = document.createElement("div");
      num.textContent = day.getDate();
      num.className = "text-sm font-semibold mb-1";
      cell.appendChild(num);

      const iso = day.toISOString().slice(0, 10);
      const events = grouped[iso] || [];

      events.forEach(e => {
        const pill = document.createElement("div");
        pill.className = "mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer truncate";
        pill.textContent = e.title;
        pill.onclick = () => {
          window.location.href = `compromisso.html?id=${e.id}`;
        };
        cell.appendChild(pill);
      });
        // Permite agendar compromisso com duplo clique
        cell.ondblclick = () => {
          window.location.href = `compromisso.html?date=${iso}`;
        };

      grid.appendChild(cell);
    });
  });

  container.appendChild(grid);
}

function buildMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = first.getDay();
  const days = last.getDate();

  const matrix = [];
  let week = [];

  for (let i = 0; i < start; i++) week.push(null);

  for (let d = 1; d <= days; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
}