  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tooltip').forEach((tooltip, i) => {
      const txt = tooltip.querySelector('.tooltip-text'),
            id  = 'tooltip-' + (i + 1);

      // 1) unique IDs for aria-describedby
      txt.id = id;
      tooltip.setAttribute('aria-describedby', id);

      function show() {
        const b = tooltip.getBoundingClientRect(),
              r = txt.getBoundingClientRect();

        // 2) edge-align if off-screen
        tooltip.classList.toggle('align-right', r.right  > window.innerWidth);
        tooltip.classList.toggle('align-left',  r.left   < 0 && r.right <= window.innerWidth);

        // 3) flip above/below
        const notEnoughAbove = b.top < r.height + 16,
              enoughBelow     = (window.innerHeight - b.bottom) >= r.height + 16;
        tooltip.dataset.position = notEnoughAbove && enoughBelow ? 'bottom' : 'top';

        // 4) center the arrow on the trigger
        const triggerCenter = b.left + b.width / 2,
              offset        = triggerCenter - r.left,
              arrowX        = Math.min(Math.max(offset, 6), r.width - 6);
        txt.style.setProperty('--arrow-left', arrowX + 'px');

        txt.setAttribute('aria-hidden', 'false');
      }

      function hide() {
        txt.setAttribute('aria-hidden', 'true');
        tooltip.classList.remove('align-left','align-right');
        tooltip.removeAttribute('data-position');
      }

      // interactions
      tooltip.addEventListener('mouseenter', show);
      tooltip.addEventListener('focus',     show);
      tooltip.addEventListener('mouseleave', hide);
      tooltip.addEventListener('blur',      hide);
      tooltip.addEventListener('click', e => {
        e.stopPropagation();
        txt.getAttribute('aria-hidden') === 'true' ? show() : hide();
      });
    });

    // tap outside to close
    document.addEventListener('click', () => {
      document.querySelectorAll('.tooltip-text[aria-hidden="false"]')
              .forEach(el => el.setAttribute('aria-hidden', 'true'));
    });
  });
