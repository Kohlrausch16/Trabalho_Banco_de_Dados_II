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
    //Filtra por usuários selecionados no filtro lateral (se houver)
    const selectedFilterIds = (window.selectedFilterUserIds || []).map(String);
    if (selectedFilterIds.length) {
      const setIds = new Set(selectedFilterIds);
      activities = activities.filter(a => {
        const ul = a.userList || [];
        return ul.some(u => {
          if (!u) return false;
          if (typeof u === 'object') return setIds.has(String(u.id));
          return setIds.has(String(u));
        });
      });
    }
    activities.forEach(a => {
      const key = new Date(a.activityDateTime).toISOString().slice(0, 10);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
  } catch (err) {
    //Se falhar, apenas mostra o calendário vazio
    console.warn('Falha ao buscar compromissos:', err);
  }

  const matrix = buildMonthMatrix(year, m);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-7 gap-2";

  matrix.forEach(week => {
    week.forEach(day => {
      const cell = document.createElement("div");
      cell.className = "bg-white rounded shadow p-2 min-h-[110px] cursor-pointer transition-colors duration-150";
      //Reduz opacidade para dias fora do mês atual
      if (day.getMonth() !== m) {
        cell.classList.add("opacity-40");
        cell.classList.add("bg-gray-400");
      }
      //Seleção visual do card do dia
      cell.addEventListener('click', function(e) {
        //Remove seleção de todos os cards
        const allCells = cell.parentNode.querySelectorAll('.bg-blue-100');
        allCells.forEach(c => c.classList.remove('bg-blue-100'));
        //Adiciona seleção ao card clicado
        cell.classList.add('bg-blue-100');
      });


      const num = document.createElement("div");
      num.textContent = day.getDate();
      num.className = "text-sm font-semibold mb-1 inline-block";
      //Destaca o dia atual
      const today = new Date();
      if (
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear()
      ) {
        num.className += " bg-blue-600 text-white rounded-full px-3 py-1";
      }
      cell.appendChild(num);

      const iso = day.toISOString().slice(0, 10);
      const events = grouped[iso] || [];

      //Container fixo para compromissos, com scroll apenas no hover
      const eventsContainer = document.createElement("div");
      eventsContainer.className = "flex flex-col gap-1 max-h-24 overflow-y-hidden hover:overflow-y-auto";

      events.slice(0, 3).forEach(e => {
        const pill = document.createElement("div");
        pill.className = "px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer flex items-center w-full overflow-hidden";

        //Título do compromisso
        const titleSpan = document.createElement("span");
        titleSpan.className = "truncate mr-2 flex-1";
        titleSpan.textContent = e.title;

        //Horário do compromisso
        const dt = new Date(e.activityDateTime);
        const hour = dt.getHours().toString().padStart(2, '0');
        const min = dt.getMinutes().toString().padStart(2, '0');
        const timeSpan = document.createElement("span");
        timeSpan.textContent = `${hour}:${min}`;
        timeSpan.className = "ml-auto pl-2 bg-blue-700 rounded px-2 py-0.5 whitespace-nowrap z-10";

        pill.appendChild(titleSpan);
        pill.appendChild(timeSpan);
        pill.onclick = () => {
          //Guarda o mês atual para retornar à mesma visualização após editar
          try { localStorage.setItem('calendarCurrentMonth', window.currentMonth.toISOString()); } catch(e) {}
          window.location.href = `compromisso.html?id=${e.id}`;
        };
        eventsContainer.appendChild(pill);
      });
      cell.appendChild(eventsContainer);
        //Permite agendar compromisso com duplo clique
        cell.ondblclick = () => {
          //Guarda o mês atual para retornar à mesma visualização após criar
          try { localStorage.setItem('calendarCurrentMonth', window.currentMonth.toISOString()); } catch(e) {}
          //Garante formato yyyy-MM-dd para campo date
          const formattedDate = day.getFullYear() + '-' + String(day.getMonth()+1).padStart(2,'0') + '-' + String(day.getDate()).padStart(2,'0');
          window.location.href = `compromisso.html?date=${formattedDate}`;
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

  //Dias do mês anterior
  const prevMonthLast = new Date(year, month, 0);
  const prevMonthDays = prevMonthLast.getDate();

  const matrix = [];
  let week = [];
  let dayCounter = 1;

  //Preenche dias do mês anterior
  for (let i = 0; i < start; i++) {
    week.push(new Date(year, month - 1, prevMonthDays - start + 1 + i));
  }

  //Preenche dias do mês atual
  for (let d = 1; d <= days; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  //Preenche dias do próximo mês
  let nextMonthDay = 1;
  if (week.length) {
    while (week.length < 7) {
      week.push(new Date(year, month + 1, nextMonthDay++));
    }
    matrix.push(week);
  }

  //Garante sempre 6 linhas (6 semanas)
  while (matrix.length < 6) {
    let extraWeek = [];
    for (let i = 0; i < 7; i++) {
      extraWeek.push(new Date(year, month + 1, nextMonthDay++));
    }
    matrix.push(extraWeek);
  }

  return matrix;
}