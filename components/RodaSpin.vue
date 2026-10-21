<!-- Roda spin tantangan — adaptasi SpinWheel v1 (tanpa suara).
     Klik SPIN: roda berputar melambat ±4 detik, berhenti di satu segmen,
     lalu hasil dipancarkan ke induk. -->
<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div class="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-rose-500 drop-shadow"></div>
      </div>
      <div class="relative w-64 h-64">
        <div class="absolute inset-0 rounded-full shadow-xl border-8 border-amber-200 overflow-hidden transition-transform duration-[4000ms]"
          :style="{ transform: `rotate(${rotation}deg)`, background: wheelBg, transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.18, 1)' }">
          <div v-for="(s, i) in segments" :key="i" class="absolute inset-0"
            :style="{ transform: `rotate(${i * segDeg + segDeg / 2}deg)` }">
            <span class="absolute top-2 left-1/2 -translate-x-1/2 font-display font-extrabold text-white text-xs text-center px-6"
              style="text-shadow: 0 1px 4px rgba(0,0,0,.45)">{{ s.label }}</span>
          </div>
        </div>
        <button @click="spin" :disabled="berputar || nonaktif"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-display font-extrabold text-white text-lg shadow-lg border-4 border-white disabled:opacity-70"
          style="background: linear-gradient(135deg,#f59e0b,#ef4444)">
          {{ berputar ? '...' : 'SPIN' }}
        </button>
      </div>
    </div>
    <p class="text-sm font-bold text-slate-400 mt-4">Klik SPIN untuk memutar roda 🎯</p>
  </div>
</template>

<script setup lang="ts">
export interface SegmenSpin { label: string; indeks: number }

const props = defineProps<{ segments: SegmenSpin[]; awalIndeks?: number; nonaktif?: boolean }>()
const emit = defineEmits<{ (e: 'hasil', segment: SegmenSpin): void }>()

const segDeg = computed(() => 360 / Math.max(1, props.segments.length))
const segColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6', '#2dd4bf']
const wheelBg = computed(() =>
  `conic-gradient(${props.segments.map((_, i) => `${segColors[i % segColors.length]} ${i * segDeg.value}deg ${(i + 1) * segDeg.value}deg`).join(', ')})`,
)

// Roda beristirahat menunjuk segmen awal (mis. tantangan tersimpan).
const rotasiUntuk = (idx: number) => (360 - (idx * segDeg.value + segDeg.value / 2) % 360 + 360) % 360
const rotation = ref(props.awalIndeks !== undefined && props.awalIndeks >= 0 ? rotasiUntuk(props.awalIndeks) : 0)
const berputar = ref(false)

function spin() {
  if (berputar.value || props.nonaktif || !props.segments.length) return
  berputar.value = true
  const idx = Math.floor(Math.random() * props.segments.length)
  const target = rotasiUntuk(idx)
  const current = ((rotation.value % 360) + 360) % 360
  const delta = (target - current + 360) % 360
  rotation.value += 360 * 5 + delta
  setTimeout(() => {
    berputar.value = false
    emit('hasil', props.segments[idx])
  }, 4200)
}
</script>
