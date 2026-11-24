import { gsap } from 'gsap';
import './style.css';

const NS = 'http://www.w3.org/2000/svg';
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const $ = <T extends Element = SVGGElement>(sel: string) => document.querySelector<T>(sel)!;

function el(tag: string, attrs: Record<string, string | number>, parent: Element) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  parent.appendChild(node);
  return node;
}

// ดาวระยิบระยับ
const stars = $('#stars');
for (let i = 0; i < 140; i++) {
  const star = el('circle', { cx: rand(0, 1600), cy: rand(0, 500), r: rand(0.6, 2), fill: '#fff' }, stars);
  gsap.fromTo(
    star,
    { opacity: rand(0.15, 0.5) },
    { opacity: rand(0.8, 1), duration: rand(1, 3), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: rand(0, 3) },
  );
}

// เงาจันทร์บนน้ำ
const reflect = $('#moon-reflect');
for (let y = 572; y < 740; y += 12) {
  const t = (y - 572) / 168;
  const bar = el('ellipse', { cx: 930, cy: y, rx: 18 + t * 40, ry: 2 + t * 2, opacity: 0.4 - t * 0.25 }, reflect);
  gsap.to(bar, {
    scaleX: rand(0.5, 1.3),
    x: rand(-8, 8),
    transformOrigin: '50% 50%',
    duration: rand(1.2, 2.4),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ประกายคลื่นน้ำ
const shimmer = $('#shimmer');
for (let i = 0; i < 45; i++) {
  const y = rand(570, 760);
  const t = (y - 570) / 190;
  const x = rand(0, 1600);
  const w = 10 + t * 40;
  const line = el('line', { x1: x, y1: y, x2: x + w, y2: y, 'stroke-width': 1 + t * 1.5, opacity: 0 }, shimmer);
  gsap.to(line, {
    opacity: rand(0.15, 0.35),
    x: rand(-20, 20),
    duration: rand(2, 4),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: rand(0, 4),
  });
}

// กระทงลอยออกไป
const tpl = $('#kratong-tpl');
const layer = $('#kratongs');

function launchKratong(startX = rand(940, 1000)) {
  const k = tpl.cloneNode(true) as SVGGElement;
  k.removeAttribute('id');
  layer.appendChild(k);

  const flame = k.querySelector('.flame')!;
  const glow = k.querySelector('.glow')!;
  const flicker = [
    gsap.to(flame, {
      scaleY: rand(0.75, 0.9),
      scaleX: 1.15,
      transformOrigin: '50% 100%',
      duration: rand(0.12, 0.2),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }),
    gsap.to(glow, { opacity: 0.55, duration: rand(0.3, 0.6), repeat: -1, yoyo: true, ease: 'sine.inOut' }),
  ];

  const dur = rand(16, 22);
  gsap.set(k, { x: startX, y: 775, scale: 0.85, opacity: 0, transformOrigin: '50% 100%' });
  gsap
    .timeline({
      onComplete: () => {
        flicker.forEach((t) => t.kill());
        k.remove();
      },
    })
    .to(k, { opacity: 1, duration: 0.8 }, 0)
    .to(k, { x: rand(250, 1400), y: rand(574, 598), scale: 0.18, duration: dur, ease: 'sine.out' }, 0)
    .to(k, { rotation: 4, duration: 1.6, repeat: Math.floor(dur / 1.6), yoyo: true, ease: 'sine.inOut' }, 0)
    .to(k, { opacity: 0, duration: 2.5 }, dur - 2.5);
}

// จุดหมุนหัว = คอ (0,-100) ในพิกัดของตัวละคร
// transformOrigin แบบ px นับจากมุมบนซ้ายของ bbox จึงต้องคำนวณใหม่เมื่อเนื้อหาหัวเปลี่ยน
function setNeckPivot(head: SVGGElement) {
  const box = head.getBBox();
  gsap.set(head, { transformOrigin: `${-box.x}px ${-100 - box.y}px` });
}

// ใช้รูปหน้าจริงถ้าโหลดได้ ไม่งั้นใช้หน้าการ์ตูนเหมือนเดิม
for (const sel of ['#girl-head', '#boy-head']) {
  const head = $(sel);
  const photo = head.querySelector<SVGGElement>('.photo')!;
  const toon = head.querySelector<SVGGElement>('.toon')!;
  const img = new Image();
  img.onload = () => {
    photo.style.display = '';
    toon.style.display = 'none';
    setNeckPivot(head);
  };
  img.onerror = () => photo.remove();
  img.src = photo.querySelector('image')!.getAttribute('href')!;
  setNeckPivot(head);
}

// หัวเอียงหากันน่ารักๆ
gsap
  .timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'sine.inOut' } })
  .to('#girl-head', { rotation: 10, duration: 0.9 })
  .to('#boy-head', { rotation: -10, duration: 0.9 }, '<0.25')
  .to('#girl-head', { rotation: 6, duration: 0.5, yoyo: true, repeat: 3 })
  .to(['#girl-head', '#boy-head'], { rotation: 0, duration: 1 }, '+=0.6')
  .to('#boy-head', { rotation: 6, duration: 0.45, yoyo: true, repeat: 1 }, '+=0.8')
  .to('#girl-head', { rotation: -6, duration: 0.45, yoyo: true, repeat: 1 }, '<0.2');

// ตัวโยกเบาๆ
gsap.to('.bob', { y: -3, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

// กระพริบตา
gsap
  .timeline({ repeat: -1, repeatDelay: 3 })
  .to('.eye', { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1 });

// หัวใจลอยขึ้น
const hearts = $('#hearts');
function popHeart() {
  const h = el(
    'path',
    {
      d: 'M0 6 C -10 -4, -16 -14, -8 -18 C -3 -20, 0 -16, 0 -13 C 0 -16, 3 -20, 8 -18 C 16 -14, 10 -4, 0 6 Z',
      fill: '#ff7aa8',
    },
    hearts,
  );
  gsap
    .timeline({ onComplete: () => h.remove() })
    .fromTo(h, { x: 800, y: 560, scale: 0, opacity: 1 }, { scale: 1.4, duration: 0.5, ease: 'back.out(3)' })
    .to(h, { y: 470, x: 800 + rand(-30, 30), opacity: 0, duration: 2.2, ease: 'sine.out' });
}

// ลำดับเปิดฉาก
gsap
  .timeline()
  .to('#fade', { opacity: 0, duration: 2, ease: 'power1.inOut' })
  .add(() => launchKratong(), 1.5)
  .to('#title', { opacity: 1, y: -8, duration: 1.5 }, 3)
  .to('#subtitle', { opacity: 1, y: -8, duration: 1.5 }, 4)
  .to('#hint', { opacity: 0.7, duration: 1.5 }, 8);

gsap.delayedCall(5, function loopKratong() {
  launchKratong();
  gsap.delayedCall(rand(5, 8), loopKratong);
});
gsap.delayedCall(4, function loopHeart() {
  popHeart();
  gsap.delayedCall(rand(3, 6), loopHeart);
});

// แตะเพื่อลอยกระทงเพิ่ม (กันกดรัว)
let lastTap = 0;
$('#scene').addEventListener('pointerdown', () => {
  const now = performance.now();
  if (now - lastTap < 600) return;
  lastTap = now;
  launchKratong();
  popHeart();
});

// debug: เปิด ?skip=9 เพื่อข้ามไปวินาทีที่ 9 (ใช้ตอนถ่าย screenshot)
const skip = Number(new URLSearchParams(location.search).get('skip'));
if (skip > 0) {
  launchKratong(960);
  launchKratong(1000);
  gsap.exportRoot().seek(skip);
}
