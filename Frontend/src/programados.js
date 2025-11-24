async function loadProgramadosView() {
  const container = document.getElementById("content");
  container.innerHTML = "";

  const list = await listActivities();
  list.sort((a, b) => new Date(a.activityDateTime) - new Date(b.activityDateTime));

  const wrap = document.createElement("div");
  wrap.className = "space-y-2";

  list.forEach(ev => {
    const row = document.createElement("div");
    row.className = "bg-white p-3 rounded shadow flex justify-between";

    const left = document.createElement("div");
    left.innerHTML = `<strong>${escapeHtml(ev.title)}</strong><br><span class="text-sm">${escapeHtml(ev.description)}</span>`;

    const right = document.createElement("button");
    right.className = "px-3 py-1 bg-blue-500 text-white rounded";
    right.textContent = "Editar";
    right.onclick = () => window.location.href = `compromisso.html?id=${ev.id}`;

    row.appendChild(left);
    row.appendChild(right);
    wrap.appendChild(row);
  });

  container.appendChild(wrap);
}