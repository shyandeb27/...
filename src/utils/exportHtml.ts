import { ApologyData } from '../types';

export function generateStandaloneApologyHtml(data: ApologyData): string {
  const { recipientName, senderName, whatHappened, whatIllDoDifferently } = data;

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeTo = escapeHtml(recipientName || 'Siddhi');
  const safeFrom = escapeHtml(senderName || 'Shyan');
  const safeWhat = escapeHtml(
    whatHappened || 'I hid something from you instead of being open and honest with you.'
  );
  const safeFuture = escapeHtml(
    whatIllDoDifferently ||
      'I promise to never keep things from you again, to always be completely transparent, and to share everything openly with you.'
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>I am so sorry - A note for ${safeTo}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Lora:ital,wght@0,400..600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAF7F2;
      --card-bg: #FFFFFF;
      --env-outer: #FCE8EB;
      --env-inner: #F6D5DC;
      --env-flap: #F8DCE2;
      --seal-bg: #E8B86D;
      --seal-shadow: rgba(232, 184, 109, 0.45);
      --text-main: #342A2F;
      --text-muted: #786A71;
      --accent-gold: #C89547;
      --border-subtle: #F0DEE3;
      --btn-accept: #E8B86D;
      --btn-accept-hover: #DFA956;
      --btn-accept-text: #2C2012;
      --btn-dodge-bg: #FFFFFF;
      --btn-dodge-border: #E8D8DC;
      --btn-dodge-text: #68575E;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #151118;
        --card-bg: #1F1923;
        --env-outer: #2C1E2A;
        --env-inner: #241722;
        --env-flap: #352433;
        --seal-bg: #E4B469;
        --seal-shadow: rgba(228, 180, 105, 0.35);
        --text-main: #F3ECF0;
        --text-muted: #A89CA4;
        --accent-gold: #ECC37F;
        --border-subtle: #412F3D;
        --btn-accept: #E4B469;
        --btn-accept-hover: #F2C47E;
        --btn-accept-text: #251B0F;
        --btn-dodge-bg: #271E29;
        --btn-dodge-border: #4D3949;
        --btn-dodge-text: #D5C7D0;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow-x: hidden;
      transition: background-color 0.4s ease, color 0.4s ease;
    }
    .ambient-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at 50% 30%, rgba(254, 234, 238, 0.6) 0%, transparent 70%);
      z-index: 0;
    }
    @media (prefers-color-scheme: dark) {
      .ambient-bg {
        background: radial-gradient(circle at 50% 30%, rgba(65, 39, 61, 0.4) 0%, transparent 70%);
      }
    }
    .wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    /* Envelope Container */
    .envelope-box {
      position: relative;
      width: 320px;
      height: 220px;
      perspective: 1000px;
      cursor: pointer;
      transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @media (min-width: 640px) {
      .envelope-box {
        width: 380px;
        height: 250px;
      }
    }
    .envelope-box.floating {
      animation: gentleBob 4.8s ease-in-out infinite;
    }
    @keyframes gentleBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .env-back {
      position: absolute;
      inset: 0;
      background: var(--env-inner);
      border-radius: 18px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }
    /* 3D Top Flap */
    .env-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 125px;
      background: var(--env-flap);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      transform-origin: top center;
      transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 25;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }
    .envelope-box.opened .env-flap {
      transform: rotateX(180deg);
      z-index: 2;
    }
    /* Front Pockets */
    .env-front-left {
      position: absolute;
      inset: 0;
      clip-path: polygon(0 0, 0 100%, 55% 55%);
      background: var(--env-outer);
      z-index: 20;
    }
    .env-front-right {
      position: absolute;
      inset: 0;
      clip-path: polygon(100% 0, 100% 100%, 45% 55%);
      background: var(--env-outer);
      z-index: 20;
    }
    .env-front-bottom {
      position: absolute;
      inset: 0;
      clip-path: polygon(0 100%, 100% 100%, 50% 48%);
      background: var(--env-outer);
      z-index: 22;
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.03);
    }
    /* Wax Seal */
    .wax-seal {
      position: absolute;
      top: 86px;
      left: 50%;
      transform: translateX(-50%);
      width: 58px;
      height: 58px;
      background: var(--seal-bg);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px var(--seal-shadow);
      z-index: 26;
      transition: opacity 0.5s ease, transform 0.4s ease;
      cursor: pointer;
    }
    .wax-seal:hover {
      transform: translateX(-50%) scale(1.06);
    }
    .envelope-box.opened .wax-seal {
      opacity: 0;
      pointer-events: none;
    }
    .wax-seal svg {
      width: 28px;
      height: 28px;
      fill: #FFF9EE;
      opacity: 0.95;
    }
    /* "Sorry" Handwritten text on front */
    .front-sorry-text {
      position: absolute;
      bottom: 24px;
      width: 100%;
      text-align: center;
      font-family: 'Caveat', cursive;
      font-size: 34px;
      font-weight: 600;
      color: var(--text-main);
      opacity: 0.85;
      z-index: 24;
      pointer-events: none;
      letter-spacing: 0.5px;
      transition: opacity 0.5s ease;
    }
    .envelope-box.opened .front-sorry-text {
      opacity: 0;
    }
    /* Tap to open hint */
    .tap-hint {
      margin-top: 1.5rem;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      text-transform: lowercase;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.4s ease;
    }
    .envelope-box.opened ~ .tap-hint {
      opacity: 0;
      pointer-events: none;
    }
    /* Sliding Letter */
    .letter-card {
      position: absolute;
      top: 20px;
      left: 14px;
      right: 14px;
      background: var(--card-bg);
      border-radius: 14px;
      padding: 1.6rem 1.4rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--border-subtle);
      z-index: 5;
      transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.15), opacity 0.5s ease;
      opacity: 0;
      pointer-events: none;
    }
    .envelope-box.opened .letter-card {
      transform: translateY(-90px);
      opacity: 1;
      pointer-events: auto;
      z-index: 30;
    }
    @media (min-width: 640px) {
      .envelope-box.opened .letter-card {
        transform: translateY(-110px);
      }
    }
    .letter-to {
      font-family: 'Lora', serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--accent-gold);
      margin-bottom: 0.75rem;
    }
    .letter-body {
      font-family: 'Lora', serif;
      font-size: 0.95rem;
      line-height: 1.65;
      color: var(--text-main);
      margin-bottom: 1rem;
    }
    .letter-future {
      font-family: 'Lora', serif;
      font-size: 0.9rem;
      line-height: 1.55;
      color: var(--text-muted);
      font-style: italic;
      margin-bottom: 1.25rem;
    }
    .letter-from {
      font-family: 'Caveat', cursive;
      font-size: 1.35rem;
      text-align: right;
      color: var(--text-main);
      font-weight: 600;
    }
    /* Buttons */
    .button-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.75rem;
      width: 100%;
      min-height: 54px;
      position: relative;
      opacity: 0;
      transition: opacity 0.6s ease;
      pointer-events: none;
    }
    .envelope-box.opened ~ .button-container {
      opacity: 1;
      pointer-events: auto;
    }
    .btn {
      padding: 0.75rem 1.6rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      border: none;
      outline: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      white-space: nowrap;
    }
    .btn:active {
      transform: scale(0.96);
    }
    .btn-accepted {
      background: var(--btn-accept);
      color: var(--btn-accept-text);
    }
    .btn-accepted:hover {
      background: var(--btn-accept-hover);
      box-shadow: 0 6px 20px var(--seal-shadow);
    }
    .btn-dodge {
      background: var(--btn-dodge-bg);
      color: var(--btn-dodge-text);
      border: 1px solid var(--btn-dodge-border);
      position: relative;
      z-index: 50;
      transition: transform 0.26s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.4s ease;
      user-select: none;
    }
    /* Celebration Container & Thank You state */
    .thank-you-view {
      display: none;
      text-align: center;
      padding: 1.5rem 0.5rem;
    }
    .thank-you-view.active {
      display: block;
      animation: fadeIn 0.8s ease forwards;
    }
    .thank-you-heading {
      font-family: 'Lora', serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--accent-gold);
      margin-bottom: 0.75rem;
    }
    .thank-you-msg {
      font-family: 'Lora', serif;
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-main);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    canvas#celebrationCanvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99;
    }
  </style>
</head>
<body>
  <div class="ambient-bg"></div>
  <canvas id="celebrationCanvas"></canvas>

  <div class="wrapper">
    <div class="envelope-box floating" id="envelope">
      <div class="env-back"></div>
      <div class="env-flap"></div>
      <div class="env-front-left"></div>
      <div class="env-front-right"></div>
      <div class="env-front-bottom"></div>

      <div class="wax-seal" id="waxSeal">
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div class="front-sorry-text">Sorry</div>

      <div class="letter-card" id="letterCard">
        <div id="apologyView">
          <div class="letter-to">Dear ${safeTo},</div>
          <div class="letter-body">${safeWhat} I take full responsibility with no excuses, and I am truly sorry.</div>
          <div class="letter-future">${safeFuture}</div>
          <div class="letter-from">— ${safeFrom} 💛</div>
        </div>

        <div class="thank-you-view" id="thankYouView">
          <div class="thank-you-heading">Thank you. 💛</div>
          <div class="thank-you-msg">It means the absolute world to me. I promise to cherish our friendship and make things right.</div>
        </div>
      </div>
    </div>

    <div class="tap-hint" id="tapHint">
      <span>✉️ tap to open</span>
    </div>

    <div class="button-container" id="actionButtons">
      <button class="btn btn-accepted" id="acceptBtn">Accepted 💛</button>
      <button class="btn btn-dodge" id="dodgeBtn">Not accepted</button>
    </div>
  </div>

  <script>
    (function() {
      const envelope = document.getElementById('envelope');
      const acceptBtn = document.getElementById('acceptBtn');
      const dodgeBtn = document.getElementById('dodgeBtn');
      const apologyView = document.getElementById('apologyView');
      const thankYouView = document.getElementById('thankYouView');
      const canvas = document.getElementById('celebrationCanvas');
      const ctx = canvas.getContext('2d');

      let isOpened = false;
      let isAccepted = false;
      let dodgeCount = 0;

      const dodgeTexts = [
        "Not accepted",
        "Are you sure? 🥺",
        "Please? 🥹",
        "Give me a chance? 💛",
        "Don't do this 💔",
        "Pretty please? 🌸",
        "I'm truly sorry... 🥺",
        "Still running! 🏃‍♂️💨"
      ];

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      // Flap opening
      envelope.addEventListener('click', function() {
        if (!isOpened) {
          isOpened = true;
          envelope.classList.remove('floating');
          envelope.classList.add('opened');
        }
      });

      // Evasion Logic
      function dodge(pointerX, pointerY) {
        if (isAccepted) return;
        const rect = dodgeBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = btnCenterX - pointerX;
        const deltaY = btnCenterY - pointerY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist < 95 || pointerX === 0) {
          dodgeCount++;
          dodgeBtn.textContent = dodgeTexts[Math.min(dodgeCount, dodgeTexts.length - 1)];

          // Calculate jump
          const jumpDist = 140 + Math.random() * 80;
          let angle = Math.atan2(deltaY, deltaX);
          if (dist === 0) angle = Math.random() * Math.PI * 2;

          let targetX = btnCenterX + Math.cos(angle) * jumpDist;
          let targetY = btnCenterY + Math.sin(angle) * jumpDist;

          // Clamping
          const pad = 25;
          const minX = pad + rect.width / 2;
          const maxX = window.innerWidth - pad - rect.width / 2;
          const minY = pad + rect.height / 2;
          const maxY = window.innerHeight - pad - rect.height / 2;

          if (targetX < minX || targetX > maxX) {
            targetX = minX + Math.random() * (maxX - minX);
          }
          if (targetY < minY || targetY > maxY) {
            targetY = minY + Math.random() * (maxY - minY);
          }

          const currentTransform = getComputedStyle(dodgeBtn).transform;
          let currX = 0, currY = 0;
          if (currentTransform && currentTransform !== 'none') {
            const matrix = currentTransform.match(/matrix\\(([^)]+)\\)/);
            if (matrix) {
              const values = matrix[1].split(', ');
              currX = parseFloat(values[4]) || 0;
              currY = parseFloat(values[5]) || 0;
            }
          }

          const diffX = targetX - btnCenterX;
          const diffY = targetY - btnCenterY;

          dodgeBtn.style.transform = \`translate(\${currX + diffX}px, \${currY + diffY}px)\`;
        }
      }

      // Proximity tracking
      window.addEventListener('mousemove', function(e) {
        dodge(e.clientX, e.clientY);
      });

      dodgeBtn.addEventListener('mouseenter', function(e) {
        dodge(e.clientX, e.clientY);
      });

      // Mobile Touch Dodge
      window.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
          dodge(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
          dodge(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      // Celebration Particles
      const particles = [];
      const colors = ['#F8B4C0', '#F9D1D9', '#FBE5C8', '#E8B86D', '#EAD9F2'];

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 20;
          this.size = 12 + Math.random() * 16;
          this.speedY = 1.5 + Math.random() * 2.5;
          this.speedX = (Math.random() - 0.5) * 1.5;
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.rotation = Math.random() * Math.PI * 2;
          this.rotSpeed = (Math.random() - 0.5) * 0.04;
          this.opacity = 0.9;
          this.type = Math.random() > 0.4 ? 'heart' : 'petal';
        }
        update() {
          this.y -= this.speedY;
          this.x += this.speedX + Math.sin(this.y * 0.015) * 0.5;
          this.rotation += this.rotSpeed;
          if (this.y < -30) {
            this.y = canvas.height + 20;
            this.x = Math.random() * canvas.width;
          }
        }
        draw() {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;

          if (this.type === 'heart') {
            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
            ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
            ctx.fill();
          } else {
            // Sakura petal
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.5, this.size * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      function loopParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isAccepted) {
          particles.forEach(p => {
            p.update();
            p.draw();
          });
        }
        requestAnimationFrame(loopParticles);
      }
      loopParticles();

      // Accepted trigger
      acceptBtn.addEventListener('click', function() {
        if (isAccepted) return;
        isAccepted = true;
        dodgeBtn.style.opacity = '0';
        dodgeBtn.style.pointerEvents = 'none';

        apologyView.style.display = 'none';
        thankYouView.classList.add('active');

        for (let i = 0; i < 45; i++) {
          particles.push(new Particle());
        }
      });
    })();
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile(data: ApologyData) {
  const htmlContent = generateStandaloneApologyHtml(data);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `apology_for_${(data.recipientName || 'friend').toLowerCase().replace(/\s+/g, '_')}.html`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
