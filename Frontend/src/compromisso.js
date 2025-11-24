let usersCache = [];
let selectedPeople = [];

async function init() {
  //carrega usuários para autocomplete
  usersCache = await listUsers().catch(()=>[]);

  const id = getQueryParam("id");
  const dateParam = getQueryParam("date");
  //Sempre esconde o botão de excluir ao abrir
  document.getElementById("deleteBtn").style.display = "none";
  if (id) {
    document.getElementById("pageTitle").textContent = "Editar compromisso";
    await loadExisting(id);
    //Exibe botão de excluir
    document.getElementById("deleteBtn").style.display = "inline-block";
    bindDelete(id);
  } else {
    document.getElementById("pageTitle").textContent = "Novo compromisso";
    if (dateParam) {
      //Garante formato yyyy-MM-dd para campo date
      let d = dateParam;
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        document.getElementById("startDate").value = d;
      } else {
        //Tenta converter se vier em outro formato
        const dt = new Date(d);
        if (!isNaN(dt)) {
          const f = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
          document.getElementById("startDate").value = f;
        }
      }
    }
  }
//Exclui compromisso pelo id
function bindDelete(id) {
  document.getElementById("deleteBtn").addEventListener("click", async () => {
    if (confirm("Tem certeza que deseja excluir este compromisso?")) {
      try {
        await deleteActivity(id);
        window.location.href = "index.html";
      } catch (err) {
        alert("Erro ao excluir compromisso: " + err.message);
      }
    }
  });
}

  bindAutocomplete();
  bindSave(id);
}

//Carrega compromisso existente
async function loadExisting(id) {
  const data = await getActivity(id);
  if (!data) return;
  document.getElementById("titleInput").value = data.title || "";
  document.getElementById("descInput").value = data.description || "";
  document.getElementById("startDate").value = toLocalDateInput(data.activityDateTime);
  //Preenche horário, seja pelo campo startTime ou pelo activityDateTime
  let timeValue = data.startTime;
  if (!timeValue && data.activityDateTime) {
    const dt = new Date(data.activityDateTime);
    timeValue = dt.toISOString().slice(11, 16);
  }
  if (timeValue) document.getElementById("startTime").value = timeValue;
  //Carrega participantes se vierem no payload
  selectedPeople = [];
  if (data.userList && Array.isArray(data.userList)) {
    for (const u of data.userList) {
      if (u && u.name) selectedPeople.push(u);
      else if (typeof u === 'number' || typeof u === 'string') {
        try {
          const usr = await getUser(u);
          if (usr) selectedPeople.push(usr);
        } catch (e) { /* ignore */ }
      }
    }
  }
  renderSelectedPeople();
}

function bindAutocomplete() {
  const input = document.getElementById("addPersonInline");
  //Cria container para sugestões
  const container = document.createElement("div");
  container.id = "peopleSuggestions";
  container.className = "mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50";
  //Insere o container logo abaixo do wrapper do input
  const wrapper = document.getElementById('addPersonWrapper') || input.parentNode;
  wrapper.parentNode.insertBefore(container, wrapper.nextSibling);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    container.innerHTML = "";
    if (!q) return;
    //Encontra correspondências por nome
    const matches = usersCache.filter(u => (u.name||"").toLowerCase().includes(q) && !selectedPeople.some(p => p.id === u.id));
    if (matches.length) {
      matches.forEach(m => {
        const el = document.createElement("div");
        el.className = "px-3 py-2 cursor-pointer hover:bg-gray-100";
        el.textContent = m.name;
        el.onclick = () => {
          selectedPeople.push(m);
          input.value = "";
          container.innerHTML = "";
          renderSelectedPeople();
        };
        container.appendChild(el);
      });
    } else {
      //Se não houver matches, mostra opção de adicionar
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
          input.value = "";
          container.innerHTML = "";
          renderSelectedPeople();
        } catch (err) {
          alert('Erro ao criar usuário: ' + err.message);
        }
      };
      container.appendChild(el);
    }
  });

  //Permite adicionar ao pressionar Enter
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const q = input.value.trim().toLowerCase();
      const match = usersCache.find(u => (u.name||"").toLowerCase() === q);
      if (match && !selectedPeople.some(p => p.id === match.id)) {
        selectedPeople.push(match);
        input.value = "";
        container.innerHTML = "";
        renderSelectedPeople();
      } else if (!match) {
        try {
          const created = await createUser({ name: input.value.trim() });
          usersCache.push(created);
          selectedPeople.push(created);
          input.value = "";
          container.innerHTML = "";
          renderSelectedPeople();
        } catch (err) {
          alert('Erro ao criar usuário: ' + err.message);
        }
      }
    }
  });

  //Fecha sugestões ao clicar fora
  document.addEventListener("click", (e) => {
    if (e.target !== input && !container.contains(e.target)) container.innerHTML = "";
  });
}

//Renderiza os participantes selecionados como pills
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

function bindSave(id) {
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value.trim();
    const desc = document.getElementById("descInput").value.trim();
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    //Se não houver hora, a função toIsoWithMsFromDateAndTime garante 00:00
    const iso = toIsoWithMsFromDateAndTime(startDate, startTime);

    const selectedIds = selectedPeople.map(p => p.id);

    const payload = {
      id: id || "",
      title: title,
      description: desc,
      userList: selectedIds,
      activityDateTime: iso
    };
    

    try {
      if (id) {
        await updateActivity(id, payload);
      } else {
        await createActivity(payload);
      }
      //Sucesso -> volta para index
      window.location.href = "index.html";
    } catch (err) {
      alert("Erro ao salvar compromisso: " + err.message);
    }
  });
}

init();