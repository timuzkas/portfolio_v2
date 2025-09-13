<template>
  <div
    ref="wrapper"
    class="flex justify-center w-80 h-64"
    @mouseleave="collapse"
  >
    <div
      class="overflow-hidden transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-white cursor-pointer origin-bottom"
      :class="expanded ? 'w-80 h-64 rounded-xl bg-blur scale-105 border-none -translate-y-32' : 'w-32 h-12 rounded-lg bg-[#111] border-2 border-neutral-800 border-dashed hover:border-solid hover:bg-neutral-900'"
      @click="toggle"
    >
      <!-- Collapsed state -->
      <button
        v-if="!expanded"
        class="transition-opacity duration-300"
        @click="toggle"
      >
        Log In
      </button>

      <!-- Expanded login form -->
      <div
        v-else
        class="opacity-0 animate-fadeIn flex flex-col items-center space-y-4 w-full px-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold dm-mono-regular">Enter OTP</h3>
        <div class="flex justify-center space-x-2">
          <input
            v-for="n in 6"
            :key="n"
            :ref="el => otpInputs[n - 1] = el"
            @input="handleInput(n - 1, $event)"
            @keydown="handleKeydown(n - 1, $event)"
            maxlength="1"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            class="w-10 h-12 text-center text-xl asimovian-regular rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all"
          />
        </div>
        <button
          @click="submitOtp"
          class="w-full mt-2 bg-neutral-900/40 hover:bg-neutral-700/40 blur-bg transition-all rounded-md py-2 border border-neutral-700"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const expanded = ref(false);
const otpInputs = ref([]);
const router = useRouter();

function toggle(event) {
  if (event.target === event.currentTarget) {
    expanded.value = !expanded.value;
    if (expanded.value) {
      otpInputs.value[0]?.focus();
    }
  }
}

function collapse() {
  expanded.value = false;
}

function handleInput(index, event) {
  const nextInput = otpInputs.value[index + 1];
  if (event.target.value && nextInput) {
    nextInput.focus();
  }
}

function handleKeydown(index, event) {
  if (event.key === 'Enter' && index === 5) {
    submitOtp();
  }
}

async function submitOtp() {
  const otp = otpInputs.value.map(input => input.value).join('');
  const { success } = await $fetch('/api/login', {
    method: 'POST',
    body: { token: otp },
  });

  if (success) {
    router.push('/control');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Asimovian&family=Bitcount+Grid+Double:wght@100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.bg-blur {
  background: rgba(50, 50, 50, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* Fixed typo: '20x' to '20px' */
  border: 1px solid rgba(255, 255, 255, 0.1);
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
.asimovian-regular {
  font-family: 'Asimovian', sans-serif;
  font-weight: 400;
  font-style: normal;
}

</style>
