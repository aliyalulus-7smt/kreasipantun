<!-- Animasi "sedih" untuk jawaban yang masih salah: wajah 😢 bergoyang
     pelan di bawah rintik hujan — pasangan kebalikan dari confetti.
     Dipakai saat siswa belum boleh lanjut dan harus mengulang sampai benar. -->
<template>
  <div class="animasi-sedih" aria-hidden="true">
    <div class="sedih-hujan">
      <span v-for="n in 5" :key="n" :style="{ left: `${10 + n * 16}%`, animationDelay: `${n * 0.3}s` }">💧</span>
    </div>
    <div class="sedih-wajah">😢</div>
  </div>
</template>
