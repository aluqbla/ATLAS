/* Prueba manual estructural, sin escribir registros ni borrarlos. */
(() => {
  'use strict';
  const expected = {
    activities: ['byObservedAt', 'bySport'],
    activityDetails: [],
    observations: ['byMetricDate', 'byMetricTime'],
    plans: [],
    planChanges: ['byPlan'],
    profile: [],
    equipment: [],
    preferences: [],
    syncState: []
  };
  const result = document.getElementById('result');
  const run = document.getElementById('run');
  function assert(test, message) { if (!test) throw new Error(message); }
  async function verify() {
    run.disabled = true;
    result.textContent = 'Comprobando…';
    try {
      const first = await window.ATLASDatabase.open();
      assert(first.name === window.ATLASDatabase.name && first.version === 1, 'Nombre o versión incorrectos: ' + first.name + ' / ' + first.version);
      const actualStores = [...first.objectStoreNames].sort();
      const expectedStores = Object.keys(expected).sort();
      assert(actualStores.join('|') === expectedStores.join('|'),
        'Almacenes inesperados. Faltan: ' + expectedStores.filter(name => !actualStores.includes(name)).join(', ') +
        ' | Sobran: ' + actualStores.filter(name => !expectedStores.includes(name)).join(', ') +
        ' | Base: ' + first.name + ' (v' + first.version + ')');
      const transaction = first.transaction(Object.keys(expected), 'readonly');
      for (const [storeName, indices] of Object.entries(expected)) {
        const store = transaction.objectStore(storeName);
        assert([...store.indexNames].sort().join('|') === [...indices].sort().join('|'), 'Índices erróneos: ' + storeName);
        assert(typeof store.count === 'function', 'Almacén inválido: ' + storeName);
      }
      window.ATLASDatabase.close();
      const reopened = await window.ATLASDatabase.open();
      assert(reopened.version === 1 && [...reopened.objectStoreNames].sort().join('|') === expectedStores.join('|'), 'Error al reabrir la base');
      result.textContent = '✅ Base ' + reopened.name + ' · estructura v1 correcta.\n✅ 9 almacenes e índices esperados.\n✅ Cierre y reapertura correctos.\n✅ No se han insertado, modificado ni borrado registros.';
    } catch (error) {
      result.textContent = '❌ ' + (error?.message || String(error));
    } finally {
      run.disabled = false;
    }
  }
  run.addEventListener('click', verify);
})();
