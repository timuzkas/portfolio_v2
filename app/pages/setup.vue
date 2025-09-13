<template>
  <div class="relative w-full h-screen bg-[#111] flex items-center justify-center">
    <div class="bg-[#111] text-black p-8 rounded-xl border-neutral-800 border-1 shadow-lg h-auto bg-blur text-white">
      <h1 class="text-4xl font-bold mb-4 text-neutral-100 asimovian-regular">Set up OTP</h1>
      <div v-if="!secret">
        <p class="mb-4">Click the button to generate a new secret for your authenticator app.</p>
        <button
          @click="generateSecret"
          :disabled="buttonDisabled"
          class="transition-all duration-300 bg-neutral-900 text-white px-4 py-2 rounded-lg border-2 border-neutral-800 border-solid hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ buttonText }}
        </button>
      </div>
      <div v-if="secret">
        <p class="mb-4">Scan the QR code with your authenticator app.</p>
        <canvas ref="qrCanvas"></canvas>
        <p class="mt-4">Once you have scanned the QR code, you can log in using the OTP from your app.</p>
        <nuxt-link to="/control" class="text-blue-500">Go to Control Panel</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import QRCode from 'qrcode';

const secret = ref(null);
const qrCanvas = ref(null);
const buttonText = ref('Generate Secret');
const buttonDisabled = ref(false);

const generateSecret = async () => {
  try {
    const data = await $fetch('/api/admin/generate-secret', { method: 'POST' });
    secret.value = data.secret;
    await nextTick();
    QRCode.toCanvas(qrCanvas.value, data.otpauthUrl, { width: 256 });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      buttonText.value = 'TOTP already generated';
      buttonDisabled.value = true;
    } else {
      console.error('Error generating secret:', error);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Asimovian&family=Bitcount+Grid+Double:wght@100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

.asimovian-regular {
  font-family: 'Asimovian', sans-serif;
  font-weight: 400;
  font-style: normal;
}

.bg-blur {
    background: rgba(1, 1, 1, 0.1);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 30px rgba(255, 255, 255, 0);
}
</style>
