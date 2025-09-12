<template>
  <div class="relative w-full h-screen bg-[#111] pointer-events-none">
    <!-- Canvas background -->
    <canvas
      ref="bgCanvas"
      class="absolute inset-0 transition-opacity duration-1000 opacity-0"
    ></canvas>

    <!-- VNC Container -->
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-auto"
    >
      <!-- Connection Card -->
      <div
        v-if="!connected"
        class="bg-[#111] text-black p-8 rounded-xl border-neutral-800 border-2 shadow-lg min-h-[400px] w-[600px]"
      >
        <span
          class="absolute text-neutral-500 text-2xl translate-x-[500px] translate-y-[50px] -rotate-16"
          >(„• ֊ •„)੭</span
        >

        <div class="flex items-center space-x-4 mb-6">
          <h2 class="text-4xl font-bold text-neutral-100 asimovian-regular">
            VNC Client
          </h2>
          <h3 class="text-xl text-neutral-800 dm-mono-medium mt-2">
            / remote desktop
          </h3>
        </div>

        <hr
          class="border-t-2 border-neutral-900 rounded-16xl w-[104%] -translate-x-4 mb-8"
        />

        <!-- Connection Form -->
        <form @submit.prevent="connect" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-neutral-300 text-sm font-medium mb-2 dm-mono-regular"
              >
                Host
              </label>
              <input
                v-model="connectionSettings.host"
                type="text"
                placeholder="localhost or your.domain.com"
                class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors dm-mono-regular"
                required
              />
            </div>
            <div>
              <label
                class="block text-neutral-300 text-sm font-medium mb-2 dm-mono-regular"
              >
                Port
              </label>
              <input
                v-model="connectionSettings.port"
                type="number"
                placeholder="5901"
                class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors dm-mono-regular"
                required
              />
            </div>
          </div>
          <div>
            <label
              class="block text-neutral-300 text-sm font-medium mb-2 dm-mono-regular"
            >
              Username (optional)
            </label>
            <input
              v-model="connectionSettings.username"
              type="text"
              placeholder="VNC username"
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors dm-mono-regular"
            />
          </div>
          <div>
            <label
              class="block text-neutral-300 text-sm font-medium mb-2 dm-mono-regular"
            >
              Password (optional)
            </label>
            <input
              v-model="connectionSettings.password"
              type="password"
              placeholder="VNC password"
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors dm-mono-regular"
            />
          </div>
          <div class="flex items-center space-x-3">
            <input
              v-model="connectionSettings.viewOnly"
              type="checkbox"
              id="viewOnly"
              class="w-4 h-4 text-blue-600 bg-neutral-900 border-neutral-700 rounded focus:ring-blue-500"
            />
            <label
              for="viewOnly"
              class="text-neutral-300 text-sm dm-mono-regular"
            >
              View only (no input)
            </label>
          </div>
          <button
            type="submit"
            :disabled="connecting"
            class="w-full bg-[#111] border-2 border-neutral-700 border-dashed hover:border-solid hover:border-neutral-600 hover:bg-neutral-900 text-white rounded-lg px-6 py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed dm-mono-medium"
          >
            {{ connecting ? 'Connecting...' : 'Connect to VNC' }}
          </button>
        </form>

        <!-- Error Display -->
        <div
          v-if="error"
          class="mt-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg dm-mono-regular text-sm"
        >
          {{ error }}
        </div>
      </div>

      <!-- VNC Display -->
      <div
        v-else
        class="w-full h-full bg-[#111] border border-neutral-800 rounded-xl overflow-hidden relative"
      >
        <!-- VNC Canvas Container -->
        <div
          id="vnc-display"
          ref="vncDisplay"
          class="w-full h-full bg-black flex items-center justify-center"
        >
          <canvas
            ref="vncCanvas"
            class="max-w-full max-h-full object-contain cursor-crosshair"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mousemove="handleMouseMove"
            @keydown="handleKeyDown"
            @keyup="handleKeyUp"
            tabindex="0"
          ></canvas>
        </div>

        <!-- Control Bar -->
        <div class="absolute top-4 left-4 z-20 flex space-x-2">
          <button
            @click="toggleFullscreen"
            class="px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors dm-mono-regular text-sm backdrop-blur-sm border border-neutral-700"
          >
            {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
          </button>

          <button
            @click="sendCtrlAltDel"
            class="px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-600 transition-colors dm-mono-regular text-sm backdrop-blur-sm"
          >
            Ctrl+Alt+Del
          </button>

          <button
            @click="disconnect"
            class="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-colors dm-mono-regular text-sm backdrop-blur-sm"
          >
            Disconnect
          </button>
        </div>

        <!-- Status indicator -->
        <div class="absolute top-4 right-4 z-20">
          <div
            class="flex items-center space-x-2 px-3 py-2 bg-green-600/80 text-white rounded-lg backdrop-blur-sm dm-mono-regular text-sm"
          >
            <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Reactive state
const connected = ref(false);
const connecting = ref(false);
const error = ref('');
const isFullscreen = ref(false);
const bgCanvas = ref(null);
const vncCanvas = ref(null);
const vncDisplay = ref(null);

// WebSocket and VNC state
const ws = ref(null);
const vncContext = ref(null);
const mouseButtons = ref(0);
let rfbState = ref('ProtocolVersion'); // Track RFB protocol state
let securityType = ref(null); // Selected security type
let framebufferWidth = ref(0);
let framebufferHeight = ref(0);
let serverName = ref('');

// Connection settings (added username)
const connectionSettings = ref({
  host: 'localhost',
  port: 5901,
  username: '', // Added for username/password auth
  password: '',
  viewOnly: false,
});

// Connect to VNC server
const connect = async () => {
  if (connecting.value) return;

  connecting.value = true;
  error.value = '';

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${connectionSettings.value.host}:${connectionSettings.value.port}`;

    ws.value = new WebSocket(wsUrl);
    ws.value.binaryType = 'arraybuffer';

    ws.value.onopen = handleWebSocketOpen;
    ws.value.onmessage = handleWebSocketMessage;
    ws.value.onclose = handleWebSocketClose;
    ws.value.onerror = handleWebSocketError;
  } catch (err) {
    console.error('Connection failed:', err);
    error.value = err.message || 'Failed to connect to VNC server';
    connecting.value = false;
  }
};

// WebSocket event handlers
const handleWebSocketOpen = () => {
  console.log('WebSocket connected');
  rfbState.value = 'ProtocolVersion';
  sendProtocolVersion();
};

const handleWebSocketMessage = (event) => {
  const data = new Uint8Array(event.data);
  processVNCMessage(data);
};

const handleWebSocketClose = (event) => {
  console.log('WebSocket disconnected:', event);
  connected.value = false;
  connecting.value = false;
  if (!event.wasClean) {
    error.value = 'Connection lost unexpectedly';
  }
};

const handleWebSocketError = (err) => {
  console.error('WebSocket error:', err);
  error.value = 'WebSocket connection failed';
  connecting.value = false;
};

// RFB Protocol Handling
const sendProtocolVersion = () => {
  const protocolVersion = 'RFB 003.008\n'; // RFB 3.8
  ws.value.send(new TextEncoder().encode(protocolVersion));
};

const processVNCMessage = (data) => {
  let offset = 0;

  switch (rfbState.value) {
    case 'ProtocolVersion': {
      const version = new TextDecoder().decode(data.slice(0, 12));
      if (!version.startsWith('RFB ')) {
        error.value = 'Invalid RFB protocol version';
        disconnect();
        return;
      }
      rfbState.value = 'Security';
      ws.value.send(new TextEncoder().encode('RFB 003.008\n')); // Respond with supported version
      break;
    }
    case 'Security': {
      const numTypes = data[0];
      const securityTypes = data.slice(1, 1 + numTypes);
      if (securityTypes.includes(2)) {
        // VNC Authentication
        securityType.value = 2;
        ws.value.send(new Uint8Array([2])); // Select VNC Authentication
        rfbState.value = 'SecurityAuth';
      } else if (securityTypes.includes(1)) {
        // None
        securityType.value = 1;
        ws.value.send(new Uint8Array([1]));
        rfbState.value = 'SecurityResult';
      } else {
        error.value = 'No supported security types';
        disconnect();
      }
      break;
    }
    case 'SecurityAuth': {
      if (securityType.value === 2) {
        // VNC Authentication: 16-byte challenge
        if (data.length < 16) {
          error.value = 'Invalid authentication challenge';
          disconnect();
          return;
        }
        const challenge = data.slice(0, 16);
        authenticateVNC(challenge);
      }
      break;
    }
    case 'SecurityResult': {
      const status = data[0];
      if (status === 0) {
        rfbState.value = 'ClientInit';
        sendClientInit();
      } else {
        const reasonLength = new DataView(data.buffer, 1).getUint32(0);
        const reason = new TextDecoder().decode(
          data.slice(5, 5 + reasonLength)
        );
        error.value = `Authentication failed: ${reason}`;
        disconnect();
      }
      break;
    }
    case 'ServerInit': {
      const view = new DataView(data.buffer);
      framebufferWidth.value = view.getUint16(0);
      framebufferHeight.value = view.getUint16(2);
      const nameLength = view.getUint32(20);
      serverName.value = new TextDecoder().decode(
        data.slice(24, 24 + nameLength)
      );

      // Initialize canvas
      const canvas = vncCanvas.value;
      if (canvas) {
        canvas.width = framebufferWidth.value;
        canvas.height = framebufferHeight.value;
        vncContext.value = canvas.getContext('2d');
        canvas.focus();
      }

      connected.value = true;
      connecting.value = false;
      rfbState.value = 'Running';
      requestFramebufferUpdate();
      break;
    }
    case 'Running': {
      handleServerMessage(data);
      break;
    }
  }
};

// VNC Authentication (DES encryption for password)
const authenticateVNC = (challenge) => {
  if (!connectionSettings.value.password) {
    error.value = 'Password required for VNC Authentication';
    disconnect();
    return;
  }

  // Simplified DES encryption (in a real app, use a proper DES library)
  // Note: You'll need a DES implementation (e.g., from a library like 'crypto-js')
  // For demonstration, we'll assume a function `desEncrypt` exists
  const password = connectionSettings.value.password
    .padEnd(8, '\0')
    .slice(0, 8);
  const encrypted = desEncrypt(password, challenge); // Implement this
  ws.value.send(encrypted);
  rfbState.value = 'SecurityResult';
};

// Placeholder for DES encryption (you'll need a real implementation)
const desEncrypt = (password, challenge) => {
  // Implement DES encryption here (e.g., using crypto-js or a similar library)
  // For now, return the challenge as-is (this won't work with real VNC servers)
  console.warn('DES encryption not implemented; replace with actual DES logic');
  return challenge;
};

const sendClientInit = () => {
  const clientInit = new Uint8Array([1]); // Shared flag: 1 = shared, 0 = exclusive
  ws.value.send(clientInit);
};

const requestFramebufferUpdate = () => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;

  const msg = new Uint8Array(10);
  msg[0] = 3; // FramebufferUpdateRequest
  msg[1] = 0; // Incremental (0 = full, 1 = incremental)
  msg[2] = 0;
  msg[3] = 0; // x
  msg[4] = 0;
  msg[5] = 0; // y
  msg[6] = (framebufferWidth.value >> 8) & 0xff;
  msg[7] = framebufferWidth.value & 0xff; // width
  msg[8] = (framebufferHeight.value >> 8) & 0xff;
  msg[9] = framebufferHeight.value & 0xff; // height
  ws.value.send(msg);
};

const handleServerMessage = (data) => {
  const msgType = data[0];
  switch (msgType) {
    case 0: // FramebufferUpdate
      processFramebufferUpdate(data);
      break;
    // Add handlers for other message types (e.g., SetColourMapEntries, Bell, ServerCutText)
  }
};

const processFramebufferUpdate = (data) => {
  const view = new DataView(data.buffer);
  const numRectangles = view.getUint16(2);
  let offset = 4;

  for (let i = 0; i < numRectangles; i++) {
    const x = view.getUint16(offset);
    const y = view.getUint16(offset + 2);
    const width = view.getUint16(offset + 4);
    const height = view.getUint16(offset + 6);
    const encoding = view.getInt32(offset + 8);
    offset += 12;

    if (encoding === 0) {
      // Raw encoding
      const pixelDataLength = width * height * 4; // Assuming 32-bit pixels
      const pixelData = data.slice(offset, offset + pixelDataLength);
      offset += pixelDataLength;

      // Render to canvas
      const imageData = vncContext.value.createImageData(width, height);
      imageData.data.set(pixelData);
      vncContext.value.putImageData(imageData, x, y);
    } else {
      console.warn(`Unsupported encoding type: ${encoding}`);
    }
  }

  // Request next update
  requestFramebufferUpdate();
};

// Mouse and Keyboard event handlers (unchanged from your code)
const handleMouseDown = (event) => {
  if (connectionSettings.value.viewOnly) return;
  mouseButtons.value |= 1 << event.button;
  sendMouseEvent(event.offsetX, event.offsetY, mouseButtons.value);
};

const handleMouseUp = (event) => {
  if (connectionSettings.value.viewOnly) return;
  mouseButtons.value &= ~(1 << event.button);
  sendMouseEvent(event.offsetX, event.offsetY, mouseButtons.value);
};

const handleMouseMove = (event) => {
  if (connectionSettings.value.viewOnly) return;
  sendMouseEvent(event.offsetX, event.offsetY, mouseButtons.value);
};

const handleKeyDown = (event) => {
  if (connectionSettings.value.viewOnly) return;
  event.preventDefault();
  sendKeyEvent(event.keyCode, true);
};

const handleKeyUp = (event) => {
  if (connectionSettings.value.viewOnly) return;
  event.preventDefault();
  sendKeyEvent(event.keyCode, false);
};

const sendMouseEvent = (x, y, buttons) => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;

  const msg = new Uint8Array(6);
  msg[0] = 5; // PointerEvent
  msg[1] = buttons;
  msg[2] = (x >> 8) & 0xff;
  msg[3] = x & 0xff;
  msg[4] = (y >> 8) & 0xff;
  msg[5] = y & 0xff;
  ws.value.send(msg);
};

const sendKeyEvent = (keyCode, pressed) => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;

  const msg = new Uint8Array(8);
  msg[0] = 4; // KeyEvent
  msg[1] = pressed ? 1 : 0;
  msg[4] = (keyCode >> 24) & 0xff;
  msg[5] = (keyCode >> 16) & 0xff;
  msg[6] = (keyCode >> 8) & 0xff;
  msg[7] = keyCode & 0xff;
  ws.value.send(msg);
};

const disconnect = () => {
  if (ws.value) {
    ws.value.close();
    ws.value = null;
  }
  connected.value = false;
};

const sendCtrlAltDel = () => {
  if (connectionSettings.value.viewOnly) return;
  sendKeyEvent(17, true); // Ctrl down
  sendKeyEvent(18, true); // Alt down
  sendKeyEvent(46, true); // Del down
  setTimeout(() => {
    sendKeyEvent(46, false); // Del up
    sendKeyEvent(18, false); // Alt up
    sendKeyEvent(17, false); // Ctrl up
  }, 100);
};

const toggleFullscreen = () => {
  const display = vncDisplay.value;
  if (!display) return;

  if (!document.fullscreenElement) {
    display.requestFullscreen?.() ||
      display.webkitRequestFullscreen?.() ||
      display.msRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() ||
      document.webkitExitFullscreen?.() ||
      document.msExitFullscreen?.();
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Background animation (unchanged)
onMounted(() => {
  // Your existing background animation code
  const canvas = bgCanvas.value;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
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
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener(
    'webkitfullscreenchange',
    handleFullscreenChange
  );
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Asimovian&family=Bitcount+Grid+Double:wght@100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

.asimovian-regular {
  font-family: 'Asimovian', sans-serif;
  font-weight: 400;
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
</style>

