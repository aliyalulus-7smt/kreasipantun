<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div class="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-rose-500 drop-shadow"></div>
      </div>
      <div class="relative w-64 h-64 md:w-80 md:h-80">
        <div class="absolute inset-0 rounded-full shadow-xl border-8 border-amber-200 overflow-hidden transition-transform duration-[4000ms]"
          :style="{ transform: `rotate(${rotation}deg)`, background: wheelBg, transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.18, 1)' }">
          <div v-for="(s, i) in segments" :key="i" class="absolute inset-0"
            :style="{ transform: `rotate(${i * segDeg + segDeg / 2}deg)` }">
            <span class="absolute top-2 left-1/2 -translate-x-1/2 font-display font-extrabold text-white text-xs md:text-sm text-center px-6"
              style="text-shadow: 0 1px 4px rgba(0,0,0,.45)">{{ s.label }}</span>
          </div>
        </div>
        <button @click="spin" :disabled="berputar" data-no-sound
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
export interface SpinSegment {
  label: string
  [key: string]: any
}

const props = defineProps<{
  segments: SpinSegment[]
}>()

const emit = defineEmits<{
  (e: 'hasil', segment: SpinSegment): void
}>()

const sfx = useSound()

const segDeg = computed(() => 360 / props.segments.length)
const segColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6', '#2dd4bf', '#f97316', '#84cc16', '#22d3ee', '#e879f9']
const wheelBg = computed(() =>
  `conic-gradient(${segColors.map((c, i) => `${c} ${i * segDeg.value}deg ${(i + 1) * segDeg.value}deg`).join(', ')})`
)

const rotation = ref(0)
const berputar = ref(false)

function spin() {
  if (berputar.value || !props.segments.length) return
  berputar.value = true
  sfx.pop()
  const idx = Math.floor(Math.random() * props.segments.length)
  const target = (360 - (idx * segDeg.value + segDeg.value / 2) + 360) % 360
  const current = ((rotation.value % 360) + 360) % 360
  const delta = (target - current + 360) % 360
  rotation.value += 360 * 5 + delta
  const tickTimer = setInterval(() => sfx.tick(), 140)
  setTimeout(() => {
    clearInterval(tickTimer)
    berputar.value = false
    emit('hasil', props.segments[idx])
    sfx.win()
  }, 4200)
}

defineExpose({ spin, berputar })
</script>
