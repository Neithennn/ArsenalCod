/* On l'a fait en python puis on l'a refait en JS donc on est pas sûr qu'il soit super optimisé. Mais bon, ça marche et c'est le principal. */

document.addEventListener('DOMContentLoaded', function () {
  /* Sélecteurs principaux */
  const form = document.getElementById('accessory-form');
  const rows = document.querySelectorAll('.stats-table tbody tr');
  if (!form || rows.length === 0) return;

  /* Stats en % */
  const percentStats = ['range', 'mobility', 'precision', 'recoil', 'stability', 'reload'];

  /* Sauvegarde base */
  const baseStats = {};
  rows.forEach(row => {
    baseStats[row.dataset.stat] = parseFloat(row.querySelector('.value').textContent);
  });

  /* MAJ stats dynamiques */
  function updateStats() {
    const current = { ...baseStats };
    /* Applique chaque modif */
    form.querySelectorAll('input:checked').forEach(cb => {
      Object.entries(cb.dataset).forEach(([key, val]) => {
        const delta = parseFloat(val);
        if (isNaN(delta)) return;
        current[key] = percentStats.includes(key)
          ? baseStats[key] + (baseStats[key] * delta / 100)
          : current[key] + delta;
      });
    });
    /* Refresh affichage */
    rows.forEach(row => {
      const key = row.dataset.stat;
      const cell = row.querySelector('.value');
      if (!cell) return;
      const val = Math.round(current[key] * 10) / 10;
      cell.textContent = val;
      cell.classList.toggle('modified', Math.abs(val - baseStats[key]) > 1e-6);
    });
  }

  /* Ecouteur sur accessoire */
  form.addEventListener('change', updateStats);
});
