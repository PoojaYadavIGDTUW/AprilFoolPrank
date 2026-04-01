const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const modal = document.getElementById('success-modal');
const container = document.querySelector('.prank-container');

// Impossible Button Logic
const moveButton = (e) => {
  const rect = noBtn.getBoundingClientRect();
  const btnX = rect.left + rect.width / 2;
  const btnY = rect.top + rect.height / 2;
  
  // Mouse distance from button center
  const distX = e.clientX - btnX;
  const distY = e.clientY - btnY;
  const distance = Math.sqrt(distX * distX + distY * distY);
  
  // If mouse gets within 150px, teleport button
  if (distance < 150) {
    const containerRect = container.getBoundingClientRect();
    
    // Calculate new random position within viewport bounds
    const maxX = window.innerWidth - rect.width - 20;
    const maxY = window.innerHeight - rect.height - 20;
    
    // Generate random position (keeping away from mouse)
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    
    // Ensure it doesn't land under the mouse again
    const newDist = Math.sqrt(
      Math.pow(e.clientX - newX - rect.width/2, 2) + 
      Math.pow(e.clientY - newY - rect.height/2, 2)
    );
    
    // If still too close, push further
    if (newDist < 200) {
      newX = newX > window.innerWidth/2 ? newX - 200 : newX + 200;
      newY = newY > window.innerHeight/2 ? newY - 200 : newY + 200;
    }
    
    // Clamp to viewport
    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(10, Math.min(newY, maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
  }
};

// Also move on click attempt (for mobile/touch)
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveButton({clientX: e.clientX, clientY: e.clientY});
});

// Mouse tracking
document.addEventListener('mousemove', moveButton);

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  moveButton({clientX: touch.clientX, clientY: touch.clientY});
});

// Success State
yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  startConfetti();
  // Play a sound if you want (optional)
  // new Audio('https://www.soundjay.com/buttons/beep-01a.mp3').play();
});

// Confetti Effect
function startConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      gravity: 0.5,
      drag: 0.99
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      
      if (p.y < canvas.height) active = true;
      
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    
    if (active) requestAnimationFrame(animate);
  }
  
  animate();
}

// Resize handler
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
