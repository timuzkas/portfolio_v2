<template>
  <div class="relative w-full h-screen bg-[#111] pointer-events-none">
    <!-- Canvas with fade-in -->
    <canvas
      ref="bgCanvas"
      class="absolute inset-0 transition-opacity duration-1000 opacity-0"
    ></canvas>

    <!-- Centered card -->
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-auto"
    >
      <div
        class="bg-[#111] text-black p-8 rounded-xl border-neutral-800 border-1 shadow-lg h-[510px] bg-blur"
      >
        <span
          class="absolute text-neutral-500 text-2xl translate-x-[425px] translate-y-[130px] -rotate-16"
          >(„• ֊ •„)੭</span
        >
        <div class="flex space-x-4">
          <div
            class="text-6xl font-bold mb-4 text-neutral-100 asimovian-regular"
          >
            <span
  v-for="(char, i) in displayTitleChars"
  :key="i"
  class="inline-block transition-all duration-500 hover:scale-[1.1] hover:text-white text-shadow-white hover:text-shadow-md hover:-translate-y-2"
>
  {{ char }}
</span>

          </div>
          <h2 class="text-3xl mb-4 text-neutral-800 dm-mono-medium ml-[320px] mt-2">
            / fullstack dev
          </h2>
        </div>

        <hr
          class="border-t-2 border-neutral-900 rounded-16xl w-[104%] -translate-x-4 mt-1"
        />

        <div class="flex space-x-4 pt-8">
          <div class="flex flex-col space-y-4">
            <a
              v-for="project in mainProjects"
              :key="project.id"
              :href="project.url"
              target="_blank"
              class="block"
            >
              <div
                class="relative w-[350px] p-6 rounded-xl text-white group border-2 border-neutral-800 border-dashed project-card pointer-events-auto flex flex-col space-y-1"
              >
                <a class="dm-mono-regular group-hover:text-lg transition-all">{{ project.title }}</a>
                <a
                  class="dm-mono-regular group-hover:text-base transition-all text-neutral-600 text-sm w-full"
                >
                  {{ project.description }}
                </a>

                <div
                  class="flex items-center justify-between space-x-2 bg-neutral-800 rounded-xl border border-neutral-800 px-4 py-2 mt-2 text-neutral-400 group transition-all"
                >
                  <div class="flex items-center space-x-2">
                    <Github
                      class="w-5 h-5 group-hover:underline transition-all"
                    />
                    <span class="group-hover:underline transition-all"
                      >github.com</span
                    >
                  </div>
                  <MoveUpRight
                    class="w-4 h-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                  />
                </div>
              </div>
            </a>
            <a :href="moreProjectsUrl" target="_blank" class="block">
              <div class="flex items-center justify-center">
                <p
                  class="text-neutral-600 hover:text-neutral-400 hover:scale-105 transition-all duration-300 relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-neutral-400 group-hover:after:w-full"
                >
                  More projects
                </p>
              </div>
            </a>
          </div>
          <!-- RIGHT: description + contacts + login -->
          <!-- Vertical divider -->
          <div
            class="w-[2px] h-[360px] bg-neutral-900 mx-4 -translate-y-4"
          ></div>

          <div
            class="flex flex-col justify-start items-end text-right text-neutral-300 w-64 ml-48"
          >
            <!-- description -->
            <p class="mb-4 text-lg dm-mono-medium cursor-pointer">
              <span
                v-for="(char, i) in displayChars"
                :key="i"
                @mouseenter="startScramble(i)"
                @mouseleave="stopScramble(i)"
              >
                {{ char }}
              </span>
            </p>

            <hr
              class="border-t-2 border-neutral-900 rounded-16xl w-[160%] -translate-x-4 mt-6"
            />

            <!-- contacts -->
            <div class="flex space-x-4">
              <div class="flex flex-col space-y-2 mb-6 mt-4 w-[250px]">
                <a
                  href="mailto:timuzkas@proton.me"
                  class="group w-full transition-all duration-300 hover:underline pl-4 hover:scale-[1.05] hover:-translate-x-2 frosted-glass inline-flex items-center"
                >
                  <Mail
                    class="w-6 h-6 flex-shrink-0 mr-3 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
                  />
                  <span class="text-left">timuzkas@proton.me</span>
                </a>

                <a
                  href="https://gitlab.com/timuzkas"
                  class="group w-full transition-all duration-300 hover:underline pl-4 hover:scale-[1.05] hover:-translate-x-2 frosted-glass-wide inline-flex items-center"
                >
                  <Gitlab
                    class="w-6 h-6 flex-shrink-0 mr-3 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
                  />
                  <span class="text-left">https://gitlab.com/timuzkas</span>
                </a>

                <a
                  href="https://github.com/timuzkas"
                  class="group w-full transition-all duration-300 hover:underline pl-4 hover:scale-[1.05] hover:-translate-x-2 frosted-glass-wide inline-flex items-center"
                >
                  <Github
                    class="w-6 h-6 flex-shrink-0 mr-3 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
                  />
                  <span class="text-left">https://github.com/timuzkas</span>
                </a>
              </div>
              <!-- login button -->
              <div class="flex justify-center items-center">
                <div
                  class="px-4 py-2 ml-[80px] h-12 w-32 -translate-y-2 -translate-x-[140px]"
                >
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { Github, MoveUpRight, Mail, Gitlab } from 'lucide-vue-next';

const { data: projects } = await useAsyncData('projects', () => $fetch('/api/projects'));

const mainProjects = computed(() => (projects.value || []).filter(p => p.main));
const moreProjectsUrl = computed(() => (projects.value || []).find(p => p.title === 'More Projects')?.url || '#');

const bgCanvas = ref(null);

const description =
  'hey, im a fullstack dev with experience in js/ts, vue, next.js, c/c++, lua and some other things.';
const title = "timuzkas";

const originalChars = description.split('');
const displayChars = ref([...originalChars]);

const originalTitleChars = title.split('');
const displayTitleChars = ref([...originalTitleChars]);

const scrambleIntervals = new Map();
const lingerTimeouts = new Map();

function randomChar() {
  return String.fromCharCode(33 + Math.floor(Math.random() * 94));
}

function startScramble(index) {
  // clear lingering stop if hovering again
  if (lingerTimeouts.has(index)) {
    clearTimeout(lingerTimeouts.get(index));
    lingerTimeouts.delete(index);
  }

  if (scrambleIntervals.has(index)) return;

  const id = setInterval(() => {
    displayChars.value[index] = randomChar();
  }, 50); // scramble speed
  scrambleIntervals.set(index, id);
}

function stopScramble(index) {
  // stop after 1 second trailing effect
  const timeoutId = setTimeout(() => {
    clearInterval(scrambleIntervals.get(index));
    scrambleIntervals.delete(index);
    displayChars.value[index] = originalChars[index];
    lingerTimeouts.delete(index);
  }, 1000); // trailing duration
  lingerTimeouts.set(index, timeoutId);
}



onMounted(() => {
  const canvas = bgCanvas.value;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // fade in canvas after first frame
  requestAnimationFrame(() => {
    canvas.style.opacity = 1;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initChars();
  });

  const fontSize = 20;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
  let chars = [];
  let cols, rows;

  function initChars() {
    cols = Math.ceil(width / fontSize);
    rows = Math.ceil(height / fontSize);
    chars = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        chars.push({
          x: x * fontSize,
          y: y * fontSize,
          char: charset[Math.floor(Math.random() * charset.length)],
          baseColor: 15 + Math.random() * 30,
          lightFactor: 0.5 + Math.random() * 0.5,
          highlighted: 0,
          nextUpdate: Math.random() * 200,
        });
      }
    }
  }
  initChars();

  ctx.font = `${fontSize}px 'Bitcount Grid Double', monospace`;
  ctx.textBaseline = 'top';

  let mouseX = -9999;
  let mouseY = -9999;

  const wrapper = document.querySelector('.pointer-events-none');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = bgCanvas.value.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    const now = performance.now();

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    for (const c of chars) {
      const dx = c.x - mouseX;
      const dy = c.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 150;
      const intensity = Math.max(0, 1 - dist / radius);

      if (intensity > 0) {
        if (now >= c.nextUpdate) {
          c.highlighted = Math.random() * intensity;
          c.char = charset[Math.floor(Math.random() * charset.length)];
          c.nextUpdate = now + 100 + Math.random() * 200;
        }
      } else {
        c.highlighted *= 0.9;
      }

      const color = c.baseColor + c.highlighted * 150 * c.lightFactor;
      ctx.fillStyle = `rgb(${color},${color},${color})`;
      ctx.fillText(c.char, c.x, c.y);
    }

    requestAnimationFrame(draw);
  }

  draw();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Asimovian&family=Bitcount+Grid+Double:wght@100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

.bitcount-grid-double {
  font-family: 'Bitcount Grid Double', system-ui;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings:
    'slnt' 0,
    'CRSV' 0.5,
    'ELSH' 0,
    'ELXP' 0;
}

.asimovian-regular {
  font-family: 'Asimovian', sans-serif;
  font-weight: 400;
  font-style: normal;
}

.dm-mono-light {
  font-family: 'DM Mono', monospace;
  font-weight: 300;
  font-style: normal;
}

.dm-mono-regular {
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  font-style: normal;
}

.dm-mono-medium {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-style: normal;
}

.dm-mono-light-italic {
  font-family: 'DM Mono', monospace;
  font-weight: 300;
  font-style: italic;
}

.dm-mono-regular-italic {
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  font-style: italic;
}

.dm-mono-medium-italic {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-style: italic;
}

.project-card {
  background-color: rgba(255, 255, 255, 0); /* transparent */
  backdrop-filter: blur(0px);
  height: 140px;
  width: 350px;
  padding-top: 16px;
  transition: all 0.3s ease;
}

.project-card:hover {
  backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  width: 360px;
  height: 150px;
  border: solid #313131;
}

.bg-blur {
    background: rgba(1, 1, 1, 0.1);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 30px rgba(255, 255, 255, 0);
}

.frosted-glass {
  /* Semi-transparent background (stained color) */
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 5px;
  padding: 5px;
  transition: all 0.3s ease;
  width: 100%;
  padding-right: 12px;
}

.frosted-glass:hover {
  /* Semi-transparent background (stained color) */
  background: rgba(255, 255, 255, 0.1);
  /* Optional gradient tint for color variation */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 200, 200, 0.05)
  );
  /* Blur effect */
  backdrop-filter: blur(15px);
  /* Smooth edges */
  border-radius: 10px;
  /* Optional border with transparency for glass outline */
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* Optional shadow to separate from background */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.frosted-glass-wide {
  /* Semi-transparent background (stained color) */
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
  width: 108%;
  padding-right: 12px;
  transition: all 0.3s ease;
}

.frosted-glass-wide:hover {
  /* Semi-transparent background (stained color) */
  background: rgba(255, 255, 255, 0.1);
  /* Optional gradient tint for color variation */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 200, 200, 0.05)
  );
  /* Blur effect */
  backdrop-filter: blur(15px);
  /* Smooth edges */
  border-radius: 10px;
  /* Optional border with transparency for glass outline */
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* Optional shadow to separate from background */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 108%;
}
</style>

