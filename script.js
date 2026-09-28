// ==========================================
// 1. TYPEWRITER EFFECT FOR BOOT TERMINAL
// ==========================================
const lines = [
  "Deep Learning & Full-Stack Engineer",
  "Building custom LLMs with PyTorch & tiktoken",
  "Designing interactive web & mobile apps",
  "STEM Educator & Systems Enthusiast"
];

let lineIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function typeEffect() {
  if (!typewriterEl) return;
  
  const currentLine = lines[lineIdx];
  
  if (isDeleting) {
    typewriterEl.textContent = currentLine.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typewriterEl.textContent = currentLine.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 30 : 60;

  if (!isDeleting && charIdx === currentLine.length) {
    typeSpeed = 2000; // Pause at end of sentence
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    lineIdx = (lineIdx + 1) % lines.length;
    typeSpeed = 500; // Pause before typing next line
  }

  setTimeout(typeEffect, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  initBinaryHead();
});


// ==========================================
// 2. THREE.JS 3D ROTATING BINARY HEAD
// ==========================================
function initBinaryHead() {
  const container = document.getElementById("binary-canvas-container");
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Generate Binary Textures (0 and 1)
  function createBinaryTexture(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.font = "Bold 48px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }

  const texZero = createBinaryTexture("0", "#00ff66");
  const texOne = createBinaryTexture("1", "#00f0ff");

  const matZero = new THREE.SpriteMaterial({ map: texZero, transparent: true });
  const matOne = new THREE.SpriteMaterial({ map: texOne, transparent: true });

  // Create Head Shape Group
  const headGroup = new THREE.Group();
  scene.add(headGroup);

  // Geometry Base: Sphere & Ellipsoid layers to outline head structure
  const sphereGeo = new THREE.SphereGeometry(1.6, 28, 28);
  const positions = sphereGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    let x = positions[i];
    let y = positions[i + 1];
    let z = positions[i + 2];

    // Sculpt into head profile (taper chin, round skull)
    if (y < 0) {
      x *= 0.85; // Taper lower head / jaw
      z *= 0.85;
    }

    const spriteMat = Math.random() > 0.5 ? matOne : matZero;
    const sprite = new THREE.Sprite(spriteMat);
    
    // Position with small random jitter for holographic particle feel
    sprite.position.set(
      x + (Math.random() - 0.5) * 0.05,
      y + (Math.random() - 0.5) * 0.05,
      z + (Math.random() - 0.5) * 0.05
    );
    
    sprite.scale.set(0.18, 0.18, 1);
    headGroup.add(sprite);
  }

  // Mouse Drag Interaction Variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  container.addEventListener("mousemove", (e) => {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    if (isDragging) {
      headGroup.rotation.y += deltaMove.x * 0.01;
      headGroup.rotation.x += deltaMove.y * 0.01;
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Continuous auto-rotation when not dragging
    if (!isDragging) {
      headGroup.rotation.y += 0.008;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize
  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}