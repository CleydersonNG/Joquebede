// 1. Transição Inicial da Tela Preta
    window.addEventListener('load', () => {
      setTimeout(() => {
        const overlay = document.getElementById('black-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 2500);
      }, 400);
    });

    // 2. Animação de Scroll Interativa em Estágios
    const fLilyCenter = document.getElementById('fLilyCenter');
    const fGerberaLeft = document.getElementById('fGerberaLeft');
    const fLilyRight = document.getElementById('fLilyRight');
    const fGerberaBottom = document.getElementById('fGerberaBottom');
    const stems = document.getElementById('stems');

    const messageCard = document.getElementById('messageCard');
    const proposalCard = document.getElementById('proposalCard');
    const scrollHint = document.getElementById('scrollHint');

    let celebrating = false;

    let currentP = 0;

    // Aplica visualmente um determinado ponto "p" (0 a 1) da jornada de rolagem.
    // Usada tanto pela rolagem real quanto pela animação automática de reversão.
    function renderScene(p) {
      currentP = p;

      // --- ESTÁGIO 1: ABERTURA DAS FLORES & ESPALHAMENTO PARA AS LATERAIS ---
      // Flores da esquerda se movem para a margem esquerda
      const leftX = -p * 320;
      const leftY = -p * 40;
      const leftRot = -p * 35;

      // Flores da direita se movem para a margem direita
      const rightX = p * 320;
      const rightY = -p * 20;
      const rightRot = p * 35;

      // Flor central sobe suavemente
      const topY = -p * 220;
      const topScale = 1 - (p * 0.15);

      // Flor de baixo desce suavemente
      const bottomY = p * 180;

      // Aplicar Transformações
      fGerberaLeft.style.transform = `translate(${leftX}px, ${leftY}px) rotate(${leftRot}deg)`;
      fLilyRight.style.transform = `translate(${rightX}px, ${rightY}px) rotate(${rightRot}deg)`;
      fLilyCenter.style.transform = `translateY(${topY}px) scale(${topScale})`;
      fGerberaBottom.style.transform = `translateY(${bottomY}px)`;

      // Ocultar caules durante o espalhamento
      stems.style.opacity = 1 - (p * 2.5);

      // --- ESTÁGIO 2: EXIBIÇÃO AVALIADA DOS CARDS DE TEXTO ---
      // Card 1 (Mensagem Lorem) aparece na metade inicial (0.2 a 0.5) e depois desaparece
      if (p < 0.55) {
        let mOpacity = 0;
        if (p >= 0.15 && p <= 0.45) {
          mOpacity = (p - 0.15) / 0.15; // fade in
          if (p > 0.35) mOpacity = 1 - ((p - 0.35) / 0.1); // fade out
        }
        messageCard.style.opacity = Math.max(0, Math.min(1, mOpacity));
        messageCard.style.transform = `scale(${0.85 + Math.max(0, Math.min(1, mOpacity)) * 0.15})`;
      } else {
        messageCard.style.opacity = 0;
      }

      // Card 2 (Pedido de Namoro) aparece na metade final (0.6 a 1.0)
      if (p >= 0.5) {
        let propOpacity = (p - 0.5) / 0.35;
        propOpacity = Math.min(Math.max(propOpacity, 0), 1);
        proposalCard.style.opacity = propOpacity;
        proposalCard.style.transform = `scale(${0.85 + propOpacity * 0.15})`;
        proposalCard.style.pointerEvents = propOpacity > 0.8 ? 'auto' : 'none';
      } else {
        proposalCard.style.opacity = 0;
        proposalCard.style.pointerEvents = 'none';
      }

      // Dica de Scroll desvanece
      scrollHint.style.opacity = 1 - (p * 3);
    }

    function updateAnimation() {
      // Uma vez iniciada a celebração, a cena final assume o controle
      // e a rolagem deixa de mover as flores.
      if (celebrating) return;

      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      // Evita divisão por zero/NaN em telas muito altas ou conteúdo curto
      const p = scrollMax > 0 ? Math.min(Math.max(scrollY / scrollMax, 0), 1) : 0;

      renderScene(p);
    }

    // Throttle via requestAnimationFrame: roda de forma consistente e leve
    // em qualquer navegador (Chrome, Firefox, Safari, Edge, mobile inclusos)
    let ticking = false;
    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAnimation();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('orientationchange', onScrollOrResize);

    // Estado inicial (garante posição correta mesmo sem rolar ainda)
    updateAnimation();

    function decline() {
      const declineBtn = document.getElementById('declineBtn');
      const acceptBtn = document.getElementById('acceptBtn');
      if (!declineBtn || declineBtn.classList.contains('wrong-answer')) return;

      // No lugar do botão aparece "Opção errada"
      declineBtn.textContent = 'Opção errada';
      declineBtn.disabled = true;
      declineBtn.classList.add('wrong-answer');

      // Pouco depois, o botão de recusar se dissolve e o de aceitar cresce, ficando sozinho e centralizado
      setTimeout(() => {
        declineBtn.classList.add('fade-out');
        acceptBtn.classList.add('btn-solo');
      }, 900);

      setTimeout(() => {
        declineBtn.style.display = 'none';
      }, 1350);
    }

    /* --------------------------------------------------
       CELEBRAÇÃO: FLORES FECHAM DE VOLTA À POSIÇÃO ORIGINAL,
       UM CONTORNO DE CORAÇÃO SE DESENHA AO REDOR DELAS, E TUDO PULSA
       -------------------------------------------------- */
    (function celebrationSetup() {
      const heartFormation = document.getElementById('heartFormation');
      const heartPath = document.getElementById('heartPath');
      const caption = document.getElementById('celebrationCaption');
      const bouquet = document.getElementById('bouquet');

      function prepareHeartPath() {
        const length = heartPath.getTotalLength();
        heartPath.style.transition = 'none';
        heartPath.style.strokeDasharray = String(length);
        heartPath.style.strokeDashoffset = String(length);
        // Força o navegador a aplicar o estado inicial antes de reativar a transição
        heartPath.getBoundingClientRect();
        heartPath.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 0.9, 0.3, 1)';
      }

      window.startHeartFormation = function startHeartFormation() {
        heartFormation.classList.remove('show');
        bouquet.classList.remove('beating');
        caption.classList.remove('show');

        prepareHeartPath();
        heartFormation.classList.add('show');

        // Dá tempo do estado inicial (offset cheio) ser pintado antes de animar até 0
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            heartPath.style.strokeDashoffset = '0';
          });
        });

        // Depois que o contorno termina de se desenhar, buquê + coração pulsam e o texto aparece
        setTimeout(() => {
          bouquet.classList.add('beating');
          caption.classList.add('show');
        }, 1700);
      };
    })();

    function celebrate() {
      if (celebrating) return;
      celebrating = true;

      // Esconde a dica de rolagem (para a animação própria dela, senão ela sobrescreve a opacidade)
      scrollHint.style.animation = 'none';
      document.body.style.overflow = 'hidden';
      proposalCard.style.pointerEvents = 'none';

      // Anima automaticamente de volta, desfazendo a "ida" — exatamente como
      // rolar a página para cima, só que sozinho, sem precisar do dedo/mouse
      const fromP = currentP;
      const duration = 1400;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out: começa rápido e desacelera suavemente
        renderScene(fromP * (1 - eased));

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          renderScene(0);
          // A dica de rolagem não deve reaparecer: a cena final assume o controle
          scrollHint.style.opacity = '0';
          // Com as flores de volta à posição original, o coração se desenha ao redor delas
          setTimeout(() => {
            window.startHeartFormation();
          }, 300);
        }
      }

      requestAnimationFrame(step);
    }
