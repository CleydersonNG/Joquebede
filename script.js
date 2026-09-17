// FORÇAR ROLAGEM PARA O TOPO AO REINICIAR/RECARREGAR A PÁGINA
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  
  setTimeout(() => {
    const overlay = document.getElementById('black-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 1200);
    }
  }, 200);
});

const fCenter = document.getElementById('fCenter');
const fLeft = document.getElementById('fLeft');
const fRight = document.getElementById('fRight');
const fBottom = document.getElementById('fBottom');
const stems = document.getElementById('stems');
const bouquet = document.getElementById('bouquet');

const messageCard = document.getElementById('messageCard');
const proposalCard = document.getElementById('proposalCard');
const scrollHint = document.getElementById('scrollHint');
const btnAccept = document.getElementById('btnAccept');
const btnDecline = document.getElementById('btnDecline');
const finalMessage = document.getElementById('finalMessage');

let isAccepted = false;
let ticking = false;

function updateAnimation() {
  if (isAccepted) {
    ticking = false;
    return;
  }

  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const p = scrollMax > 0 ? Math.min(Math.max(scrollY / scrollMax, 0), 1) : 0;

  // Animações dos elementos do buquê
  if (fLeft) fLeft.style.transform = `translate3d(${-p * 250}px, ${-p * 20}px, 0) rotate(${-p * 25}deg)`;
  if (fRight) fRight.style.transform = `translate3d(${p * 250}px, ${-p * 15}px, 0) rotate(${p * 25}deg)`;
  if (fCenter) fCenter.style.transform = `translate3d(0, ${-p * 170}px, 0) scale(${1 - p * 0.08})`;
  if (fBottom) fBottom.style.transform = `translate3d(0, ${p * 130}px, 0)`;
  if (stems) stems.style.opacity = 1 - (p * 2);

  /* CARD INTERMEDIÁRIO (CADA DETALHE SOBRE NÓS...) 
     - Surge suavemente entre 10% e 20% da rolagem
     - Permanece 100% visível e fixo para leitura de 20% até 55% da rolagem
     - Desaparece suavemente entre 55% e 70% da rolagem
  */
  if (messageCard) {
    let mOpacity = 0;
    if (p >= 0.10 && p <= 0.70) {
      if (p < 0.20) {
        mOpacity = (p - 0.10) / 0.10; // Fade In
      } else if (p >= 0.20 && p <= 0.55) {
        mOpacity = 1; // Fica visível por mais tempo
      } else {
        mOpacity = 1 - ((p - 0.55) / 0.15); // Fade Out suave
      }
    }
    mOpacity = Math.max(0, Math.min(1, mOpacity));
    messageCard.style.opacity = mOpacity;
    messageCard.style.transform = `scale(${0.88 + mOpacity * 0.12}) translate3d(0,0,0)`;
  }

  /* CARD FINAL (PROPOSTA) 
     - Começa a aparecer de forma gradual a partir dos 65% de rolagem
  */
  if (proposalCard) {
    let propOpacity = p >= 0.65 ? Math.min((p - 0.65) / 0.25, 1) : 0;
    proposalCard.style.opacity = propOpacity;
    proposalCard.style.transform = `scale(${0.88 + propOpacity * 0.12}) translate3d(0,0,0)`;
    proposalCard.style.pointerEvents = propOpacity > 0.8 ? 'auto' : 'none';
  }

  if (scrollHint) scrollHint.style.opacity = 1 - (p * 3);

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateAnimation);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateAnimation);
updateAnimation();

// Ação de Aceitar
if (btnAccept) {
  btnAccept.addEventListener('click', () => {
    isAccepted = true;

    [proposalCard, messageCard, scrollHint].forEach(el => {
      if (el) {
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity = '0';
        setTimeout(() => el.style.display = 'none', 350);
      }
    });

    const allFlowers = [fLeft, fRight, fCenter, fBottom];
    allFlowers.forEach(flower => {
      if (flower) {
        flower.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
        flower.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
      }
    });

    if (stems) {
      stems.style.transition = 'opacity 0.9s ease';
      stems.style.opacity = '1';
    }

    setTimeout(() => {
      if (bouquet) {
        bouquet.classList.add('formed-heart');
      }
      if (finalMessage) {
        finalMessage.classList.add('visible');
      }
    }, 950);
  });
}

// Ação do Botão Recusar
if (btnDecline) {
  btnDecline.addEventListener('click', () => {
    btnDecline.style.transform = 'scale(0.85)';
    btnDecline.style.opacity = '0.4';
    btnDecline.innerText = 'Opção indisponível 😉';
  });
}