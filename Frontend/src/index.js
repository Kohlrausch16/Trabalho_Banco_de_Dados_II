window.currentMonth = new Date();

document.addEventListener("DOMContentLoaded", async () => {
  //Se existe mês salvo (voltando da tela de edição), usa-o para manter a visualização
  try {
    const stored = localStorage.getItem('calendarCurrentMonth');
    if (stored) {
      const d = new Date(stored);
      if (!isNaN(d)) window.currentMonth = d;
    }
  } catch (e) {
    //ignore
  }
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebarContent');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    let sidebarOpen = true;
    toggleSidebarBtn.addEventListener('click', () => {
      sidebarOpen = !sidebarOpen;
      if (!sidebarOpen) {
        sidebar.classList.remove('w-72');
        sidebar.classList.add('w-16');
        sidebarContent.style.display = 'none';
        toggleSidebarBtn.classList.remove('fixed');
        toggleSidebarBtn.classList.remove('top-4');
        toggleSidebarBtn.classList.remove('right-4');
        toggleSidebarBtn.classList.add('absolute');
        toggleSidebarBtn.classList.add('top-2');
        toggleSidebarBtn.classList.add('left-2');
        toggleSidebarBtn.classList.add('transition-all');
        toggleSidebarBtn.classList.add('duration-300');
        toggleSidebarBtn.style.left = '50%';
        toggleSidebarBtn.style.transform = 'translateX(-50%)';
      } else {
        sidebar.classList.add('w-72');
        sidebar.classList.remove('w-16');
        sidebarContent.style.display = '';
        toggleSidebarBtn.classList.remove('bg-blue-700');
        toggleSidebarBtn.classList.remove('absolute');
        toggleSidebarBtn.classList.remove('top-2');
        toggleSidebarBtn.classList.remove('left-2');
        toggleSidebarBtn.classList.remove('transition-all');
        toggleSidebarBtn.classList.remove('duration-300');
      }
    });
  document.getElementById("currentMonth").textContent = formatMonthYear(window.currentMonth);

  //Configura filtro de usuários (autocomplete) na sidebar
  window.selectedFilterUsers = [];
  window.selectedFilterUserIds = [];
  try {
    const usersCache = await listUsers().catch(()=>[]);
    const input = document.getElementById('searchPeople');
    if (input) {
      const wrapper = input.parentNode;
      const sugg = document.createElement('div');
      sugg.id = 'searchPeopleSuggestions';
      sugg.className = 'mt-1 bg-white text-black border rounded shadow max-h-40 overflow-auto z-50';
      wrapper.parentNode.insertBefore(sugg, wrapper.nextSibling);

      const selectedContainer = document.createElement('div');
      selectedContainer.id = 'selectedFilterPeople';
      selectedContainer.className = 'flex flex-wrap gap-2 mt-2 mb-2';
      wrapper.parentNode.insertBefore(selectedContainer, sugg.nextSibling);

      function renderFilterPills() {
        selectedContainer.innerHTML = '';
        window.selectedFilterUsers.forEach(u => {
          const pill = document.createElement('span');
          pill.className = 'inline-flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm mr-2 mb-2';
          pill.textContent = u.name;
          const btn = document.createElement('button');
          btn.className = 'ml-2 text-gray-600 font-bold';
          btn.textContent = '×';
          btn.onclick = async () => {
            window.selectedFilterUsers = window.selectedFilterUsers.filter(x => x.id !== u.id);
            window.selectedFilterUserIds = window.selectedFilterUsers.map(x=>x.id);
            renderFilterPills();
            await loadMonthView();
          };
          pill.appendChild(btn);
          selectedContainer.appendChild(pill);
        });
      }

      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        sugg.innerHTML = '';
        if (!q) return;
        const matches = usersCache.filter(u => (u.name||'').toLowerCase().includes(q) && !window.selectedFilterUserIds.includes(u.id));
        matches.forEach(m => {
          const el = document.createElement('div');
          el.className = 'flex items-center justify-between px-3 py-2 hover:bg-gray-100';

          const nameBtn = document.createElement('div');
          nameBtn.className = 'cursor-pointer flex-1';
          nameBtn.textContent = m.name;
          nameBtn.onclick = async () => {
            window.selectedFilterUsers.push(m);
            window.selectedFilterUserIds = window.selectedFilterUsers.map(x=>x.id);
            input.value = '';
            sugg.innerHTML = '';
            renderFilterPills();
            await loadMonthView();
          };

          const delBtn = document.createElement('button');
          delBtn.className = 'ml-2 text-red-600 px-2';
          delBtn.textContent = '×';
          delBtn.title = 'Excluir usuário';
          delBtn.onclick = async (ev) => {
            ev.stopPropagation();
            if (!confirm(`Excluir usuário "${m.name}"?`)) return;
            try {
              await deleteUser(m.id);
              //Remove do cache local
              const idx = usersCache.findIndex(u => String(u.id) === String(m.id));
              if (idx !== -1) usersCache.splice(idx, 1);
              //Remove de filtros selecionados caso presente
              window.selectedFilterUsers = window.selectedFilterUsers.filter(x => String(x.id) !== String(m.id));
              window.selectedFilterUserIds = window.selectedFilterUsers.map(x=>x.id);
              renderFilterPills();
              sugg.innerHTML = '';
              await loadMonthView();
            } catch (err) {
              alert('Erro ao excluir usuário: ' + err.message);
            }
          };

          el.appendChild(nameBtn);
          el.appendChild(delBtn);
          sugg.appendChild(el);
        });
      });

      document.addEventListener('click', (e) => {
        if (e.target !== input && !sugg.contains(e.target)) sugg.innerHTML = '';
      });
    }
  } catch (e) {
    //ignore
  }

  await loadMonthView();

  document.getElementById("prevMonth").addEventListener("click", async () => {
    window.currentMonth = new Date(
      window.currentMonth.getFullYear(),
      window.currentMonth.getMonth() - 1,
      1
    );
    document.getElementById("currentMonth").textContent = formatMonthYear(window.currentMonth);
    await loadMonthView();
  });

  document.getElementById("nextMonth").addEventListener("click", async () => {
    window.currentMonth = new Date(
      window.currentMonth.getFullYear(),
      window.currentMonth.getMonth() + 1,
      1
    );
    document.getElementById("currentMonth").textContent = formatMonthYear(window.currentMonth);
    await loadMonthView();
  });
});