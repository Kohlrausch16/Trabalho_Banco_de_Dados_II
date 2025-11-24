// compromisso.js - criar/editar com autocomplete de pessoas inline
// Funções globais já disponíveis via window (api.js e utils.js)

let usersCache = [];
let selectedPeople = [];

async function init() {
  // carrega usuários para autocomplete
  usersCache = await listUsers().catch(()=>[]);

  const id = getQueryParam("id");
  if (id) {
    document.getElementById("pageTitle").textContent = "Editar compromisso";
    await loadExisting(id);
  } else {
    document.getElementById("pageTitle").textContent = "Novo compromisso";
  }

  bindAutocomplete();
  bindSave(id);
}

// carrega compromisso existente
async function loadExisting(id) {
  const data = await getActivity(id);
  if (!data) return;
  document.getElementById("titleInput").value = data.title || "";
  document.getElementById("descInput").value = data.description || "";
  document.getElementById("startDate").value = toLocalDateInput(data.activityDateTime);
  document.getElementById("endDate").value = toLocalDateInput(data.endDate || data.activityDateTime);
  if (data.startTime) document.getElementById("startTime").value = data.startTime;
  if (data.endTime) document.getElementById("endTime").value = data.endTime;

  // Preenche os participantes selecionados
  if (data.userList && data.userList.length) {
    selectedPeople = usersCache.filter(u => data.userList.includes(u.id));
    renderSelectedPeople();
  }
}

// autocomplete behavior: cria uma lista sob o input que sugere usuários,
// ou sugere "Adicionar: <texto>" caso não encontre nada.
function bindAutocomplete() {
  const input = document.getElementById("addPersonInline");
  // cria container para sugestões
  const container = document.createElement("div");
  container.id = "peopleSuggestions";
  container.className = "mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50";
  input.parentNode.insertBefore(container, input.nextSibling);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    container.innerHTML = "";
    if (!q) return;
    // encontra correspondências por nome
    const matches = usersCache.filter(u => (u.name||"").toLowerCase().includes(q) && !selectedPeople.some(p => p.id === u.id));
    if (matches.length) {
      matches.forEach(m => {
        const el = document.createElement("div");
        el.className = "px-3 py-2 cursor-pointer hover:bg-gray-100";
        el.textContent = m.name;
        el.onclick = () => {
          selectedPeople.push(m);
          renderSelectedPeople();
          input.value = "";
          container.innerHTML = "";
        };
        container.appendChild(el);
      });
    } else {
      // se não houver matches, mostra opção de adicionar
      const el = document.createElement("div");
      el.className = "px-3 py-2 cursor-pointer text-blue-600 hover:bg-gray-100";
      el.textContent = `Adicionar: "${input.value.trim()}"`;
      el.onclick = async () => {
        const name = input.value.trim();
        if (!name) return;
        try {
          const created = await createUser({ name });
          usersCache.push(created);
          selectedPeople.push(created);
          renderSelectedPeople();
          input.value = "";
          container.innerHTML = "";
        } catch (err) {
          alert('Erro ao criar usuário: ' + err.message);
        }
      };
      container.appendChild(el);
    }
  });

  // Permite adicionar ao pressionar Enter
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const q = input.value.trim().toLowerCase();
      const match = usersCache.find(u => (u.name||"").toLowerCase() === q);
      if (match && !selectedPeople.some(p => p.id === match.id)) {
        selectedPeople.push(match);
        renderSelectedPeople();
        input.value = "";
        container.innerHTML = "";
      } else if (!match) {
        try {
          const created = await createUser({ name: input.value.trim() });
          usersCache.push(created);
          selectedPeople.push(created);
          renderSelectedPeople();
          input.value = "";
          container.innerHTML = "";
        } catch (err) {
          alert('Erro ao criar usuário: ' + err.message);
        }
      }
    }
  });

  // fecha sugestões ao clicar fora
  document.addEventListener("click", (e) => {
    if (e.target !== input && !container.contains(e.target)) container.innerHTML = "";
  });
}


// salva (create ou update) com o corpo exatamente no formato pedido
function bindSave(id) {
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value.trim();
    const desc = document.getElementById("descInput").value.trim();
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    // se não houver hora, a função toIsoWithMsFromDateAndTime garante 00:00
    const iso = toIsoWithMsFromDateAndTime(startDate, startTime);

    const selectedIds = selectedPeople.map(p => p.id);

    const payload = {
      id: id || "",
      title: title,
      description: desc,
      userList: selectedIds,
      activityDateTime: iso
    };
// Renderiza os participantes selecionados como pills
function renderSelectedPeople() {
  const container = document.getElementById("selectedPeople");
  container.innerHTML = "";
  selectedPeople.forEach(person => {
    const pill = document.createElement("span");
    pill.className = "inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2";
    pill.textContent = person.name;
    const removeBtn = document.createElement("button");
    removeBtn.className = "ml-2 text-blue-500 hover:text-red-600 font-bold";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => {
      selectedPeople = selectedPeople.filter(p => p.id !== person.id);
      renderSelectedPeople();
    };
    pill.appendChild(removeBtn);
    container.appendChild(pill);
  });
}

    try {
      if (id) {
        await updateActivity(id, payload);
      } else {
        await createActivity(payload);
      }
      // sucesso -> volta para index
      window.location.href = "index.html";
    } catch (err) {
      alert("Erro ao salvar compromisso: " + err.message);
    }
  });
}

init();