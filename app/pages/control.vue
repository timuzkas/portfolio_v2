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
        class="bg-blur text-black p-8 rounded-xl border border-neutral-800/50 shadow-2xl min-h-[600px] w-[1000px] transition-all duration-500 hover:shadow-neutral-900/20"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <div class="text-6xl font-bold text-neutral-100 asimovian-regular">
              <span
                v-for="(char, i) in 'control_panel'.split('')"
                :key="i"
                class="inline-block transition-all duration-500 hover:scale-110 hover:text-white hover:-translate-y-1"
                :style="{ animationDelay: `${i * 50}ms` }"
              >
                {{ char }}
              </span>
            </div>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <button
            @click="logout"
            class="group bg-red-500/80 hover:bg-red-500 text-white px-6 py-3 rounded-lg backdrop-blur-sm border border-red-400/20 transition-all duration-300 hover:scale-105 shadow-red-500 hover:shadow-lg"
          >
            <span class="group-hover:animate-pulse">Logout</span>
          </button>
        </div>

        <!-- Divider -->
        <hr
          class="border-t-2 border-neutral-800/60 rounded-full w-full mb-8 shadow-sm"
        />

        <div class="flex space-x-8">
          <!-- LEFT: Project Management -->
          <div class="flex-1 space-y-6">
            <div class="flex items-center space-x-3 mb-6">
              <h3 class="text-3xl text-neutral-100 dm-mono-medium">Projects</h3>
              <div
                class="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent"
              ></div>
            </div>

            <div
              class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar"
            >
              <div
                v-for="(project, index) in projects"
                :key="project.id"
                class="project-card group scale-[0.95] p-6 z-99 rounded-xl border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm hover:bg-neutral-900/30 transition-all duration-300 hover:scale-[0.98] hover:shadow-lg"
              >
                <div class="space-y-3">
                  <input
                    v-model="project.title"
                    placeholder="Project Title"
                    class="input-field w-full bg-neutral-800/50 border-neutral-900/50 text-white placeholder-neutral-500 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-700/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/70"
                  />
                  <input
                    v-model="project.description"
                    placeholder="Description"
                    class="input-field w-full bg-neutral-800/50 border-neutral-900/50 text-white placeholder-neutral-500 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-700/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/70"
                  />
                  <input
                    v-model="project.url"
                    placeholder="Project URL"
                    class="input-field w-full bg-neutral-800/50 border-neutral-900/50 text-white placeholder-neutral-500 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-700/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/70"
                  />
                  <label
                    class="flex items-center space-x-3 text-neutral-300 cursor-pointer group-hover:text-white transition-colors duration-300"
                  >
                    <input
                      type="checkbox"
                      v-model="project.main"
                      class="w-4 h-4 text-blue-500 bg-neutral-800/50 border-neutral-600 rounded focus:ring-blue-500/20 focus:ring-2"
                    />
                    <span class="dm-mono-regular">Main Project</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              @click="saveProjects"
              class="group w-full bg-green-500/80 hover:bg-green-500 text-white px-6 py-4 rounded-lg backdrop-blur-sm border border-green-400/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 dm-mono-medium"
            >
              <span class="group-hover:animate-pulse">💾 Save Projects</span>
            </button>
          </div>

          <!-- Vertical divider -->
          <div
            class="w-px h-[500px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent"
          ></div>

          <!-- RIGHT: Stats and Services -->
          <div class="flex-1 space-y-8">
            <!-- Stats Section -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3 mb-4">
                <h3 class="text-3xl text-neutral-100 dm-mono-medium">
                  System Stats
                </h3>
                <div
                  class="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent"
                ></div>
              </div>

              <div v-if="stats" class="stats-container space-y-3">
                <div
                  class="stat-card group bg-neutral-900/20 backdrop-blur-sm p-4 rounded-lg border border-neutral-800/50 hover:bg-neutral-900/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                    ></div>
                    <span class="text-neutral-400 dm-mono-regular">CPU:</span>
                  </div>
                  <p class="text-white ml-6 mt-1">
                    {{ stats.cpu.manufacturer }} {{ stats.cpu.brand }}
                  </p>
                </div>

                <div
                  class="stat-card group bg-neutral-900/20 backdrop-blur-sm p-4 rounded-lg border border-neutral-800/50 hover:bg-neutral-900/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    ></div>
                    <span class="text-neutral-400 dm-mono-regular"
                      >Memory:</span
                    >
                  </div>
                  <p class="text-white ml-6 mt-1">
                    {{ Math.round(stats.mem.used / 1024 / 1024) }} /
                    {{ Math.round(stats.mem.total / 1024 / 1024) }} MB
                  </p>
                  <div class="w-[350px]">
                    <div
                      class="ml-6 mt-2 w-full bg-neutral-700 rounded-full h-2 mr-8"
                    >
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-500 w-[100px]"
                        :style="{
                          width: `${(stats.mem.used / stats.mem.total) * 100}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div
                  class="stat-card group bg-neutral-900/20 backdrop-blur-sm p-4 rounded-lg border border-neutral-800/50 hover:bg-neutral-900/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                    ></div>
                    <span class="text-neutral-400 dm-mono-regular">OS:</span>
                  </div>
                  <p class="text-white ml-6 mt-1">
                    {{ stats.os.platform }} {{ stats.os.distro }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-3xl text-neutral-100 dm-mono-medium">
                  Services
                </h3>
                <button
                  @click="openAddServiceModal"
                  class="group bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-blue-400/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 dm-mono-regular"
                >
                  <span class="flex items-center space-x-2">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                    <span>Add Service</span>
                  </span>
                </button>
              </div>

              <!-- Services list with action buttons -->
              <div v-if="services && services.length > 0" class="space-y-3">
                <div
                  v-for="service in services"
                  :key="service.id"
                  class="service-item group flex items-center justify-between bg-neutral-900/20 backdrop-blur-sm p-4 rounded-lg border border-neutral-800/50 hover:bg-neutral-900/30 transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-xl w-6 text-center">{{ getServiceIcon(service.icon) }}</span>
                    <a
                      :href="service.url"
                      target="_blank"
                      class="text-white asimovian-regular group-hover:text-blue-300 transition-colors duration-300"
                    >
                      {{ service.name }}
                    </a>
                  </div>

                  <div
                    class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <button
                      @click="openEditServiceModal(service)"
                      class="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200"
                      title="Edit service"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <button
                      @click="deleteService(service.id)"
                      class="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                      title="Delete service"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>

                    <a
                      :href="service.url"
                      target="_blank"
                      class="text-neutral-400 hover:text-blue-300 p-1 rounded transition-colors duration-200"
                      title="Open service"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div
                v-else
                class="text-center py-12 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-lg"
              >
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
                <p class="dm-mono-regular">No services configured yet</p>
                <button
                  @click="openAddServiceModal"
                  class="mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Add your first service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ServiceModal
      v-model="showServiceModal"
      :title="modalConfig.title"
      :submit-text="modalConfig.submitText"
      :loading="isSubmitting"
      :initial-data="modalConfig.initialData"
      :icon-options="iconOptions"
      @submit="handleServiceSubmit"
      @close="showServiceModal = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';

const iconOptions = [
  { label: '🌐 Website', value: '🌐' },
  { label: '🔗 API', value: '🔗' },
  { label: '💾 Database', value: '💾' },
  { label: '🐙 Git Repository', value: '🐙' },
  { label: '📄 Documentation', value: '📄' },
  { label: '📊 Monitoring', value: '📊' },
  { label: '🖥️ Server', value: '🖥️' },
  { label: '☁️ Cloud', value: '☁️' },
];

const showServiceModal = ref(false);
const isSubmitting = ref(false);
const editingService = ref(null);

const modalConfig = reactive({
  title: 'Add New Service',
  submitText: 'Add Service',
  initialData: { name: '', url: '', icon: '' },
});

const openAddServiceModal = () => {
  editingService.value = null;
  modalConfig.title = 'Add New Service';
  modalConfig.submitText = 'Add Service';
  modalConfig.initialData = { name: '', url: '', icon: '' };
  showServiceModal.value = true;
};

const openEditServiceModal = (service) => {
  editingService.value = service;
  modalConfig.title = 'Edit Service';
  modalConfig.submitText = 'Update Service';
  modalConfig.initialData = {
    name: service.name,
    url: service.url,
    icon: service.icon,
  };
  showServiceModal.value = true;
};

const handleServiceSubmit = async (serviceData) => {
  isSubmitting.value = true;

  try {
    if (editingService.value) {
      await $fetch(`/api/admin/services/${editingService.value.id}`, {
        method: 'PUT',
        body: serviceData,
      });
    } else {
      await $fetch('/api/admin/services', {
        method: 'POST',
        body: serviceData,
      });
    }

    await fetchData();
    showServiceModal.value = false;

    const action = editingService.value ? 'updated' : 'added';
    console.log(`Service ${action} successfully!`);
  } catch (error) {
    console.error('Service operation failed:', error);
    alert(
      `Failed to ${editingService.value ? 'update' : 'add'} service. Please try again.`
    );
  } finally {
    isSubmitting.value = false;
  }
};

const getServiceIcon = (icon) => {
  return icon;
};

const deleteService = async (serviceId) => {
  if (!confirm('Are you sure you want to delete this service?')) return;

  try {
    await $fetch(`/api/admin/services/${serviceId}`, {
      method: 'DELETE',
    });

    await fetchData();
    console.log('Service deleted successfully!');
  } catch (error) {
    console.error('Failed to delete service:', error);
    alert('Failed to delete service. Please try again.');
  }
};

// WIP: toast
const showToast = (message, type = 'success') => {
  if (type === 'error') {
    alert(message);
  } else {
    console.log(message);
  }
};

const bgCanvas = ref(null);
const projects = ref([]);
const stats = ref(null);
const services = ref([]);

const authToken = useCookie('auth_token');
const router = useRouter();

const logout = async () => {
  await $fetch('/api/logout', { method: 'POST' });
  authToken.value = null;
  router.push('/');
};

const fetchData = async () => {
  projects.value = await $fetch('/api/projects');
  stats.value = await $fetch('/api/admin/stats');
  services.value = await $fetch('/api/services');
};

const saveProjects = async () => {
  await $fetch('/api/admin/projects', {
    method: 'PUT',
    body: { projects: projects.value },
  });
};

onMounted(() => {
  fetchData();
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
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$€£¥§%&/()=?*+[]{}<>-_.:,;';
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

.dm-mono-medium {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-style: normal;
}

.dm-mono-regular {
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  font-style: normal;
}

.bg-blur {
  background: rgba(17, 17, 17, 0.15);
  backdrop-filter: blur(20px);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.project-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 40%;
  width: 100%;
}

.project-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  height: 40%;
  width: 100%;
}

.input-field {
  border: 1px solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field:focus {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.stat-card,
.service-link {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover,
.service-link:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px) scale(1.02);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Subtle animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card,
.stat-card,
.service-link {
  animation: fadeInUp 0.6s ease-out forwards;
}

.project-card:nth-child(2) {
  animation-delay: 0.1s;
}
.project-card:nth-child(3) {
  animation-delay: 0.2s;
}
.project-card:nth-child(4) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}
.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}
.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* Glow effects for interactive elements */
button:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

input:focus {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 0 20px rgba(59, 130, 246, 0.1);
}
</style>
