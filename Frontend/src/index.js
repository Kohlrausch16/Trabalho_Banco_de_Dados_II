window.currentMonth = new Date();

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("currentMonth").textContent = formatMonthYear(window.currentMonth);

  await loadMonthView();

  // troca modo
  document.getElementById("modeSelect").addEventListener("change", async e => {
    if (e.target.value === "mes") loadMonthView();
    else loadProgramadosView();
  });

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