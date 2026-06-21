(function () {
  var W = '7rem';

  function fix() {
    var s = document.querySelector('.md-sidebar--primary');
    if (s) {
      s.style.setProperty('width',      W, 'important');
      s.style.setProperty('min-width',  '0', 'important');
      s.style.setProperty('max-width',  W, 'important');
      s.style.setProperty('flex',       '0 0 ' + W, 'important');
    }
    var inner = document.querySelector('.md-main__inner');
    if (inner) {
      inner.style.setProperty('grid-template-columns', W + ' minmax(0,1fr) 12.1rem', 'important');
    }
  }

  document.addEventListener('DOMContentLoaded', fix);
  window.addEventListener('resize', fix);
  // Run immediately in case DOM is already ready
  if (document.readyState !== 'loading') fix();
})();
