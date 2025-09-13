<template>
  <div class="flex flex-col items-center justify-center h-screen bg-[#111] text-white">
    <h1 class="text-4xl mb-2 asimovian-regular">Unauthorized</h1>

  <hr
          class="border-t-2 border-neutral-800 rounded-16xl w-[30%] -translate-x-4 mb-4"
        />
    <p class="dm-mono-regular">You need to be logged in to access this page.</p>
    <NuxtLink to="/" class="mt-4 text-blue-500 dm-mono-regular hover:underline">Go to Login</NuxtLink>
  </div>
</template>
<hr
          class="border-t-2 border-neutral-900 rounded-16xl w-[104%] -translate-x-4 mt-1"
        />

<style scoped>
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
  font-size: 90px;
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
</style>
