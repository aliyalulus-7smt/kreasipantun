<template>
  <div v-if="fenomena">
    <div class="mb-4 flex items-center justify-between">
      <NuxtLink to="/fenomena" class="kp-btn-soft !px-4 !py-2 !min-h-[40px] text-sm">← Semua Fenomena</NuxtLink>
      <span class="pill" :class="gaya.badge">{{ selesaiCount }}/5 tahap</span>
    </div>

    <!-- Banner fenomena -->
    <section :class="['kp-card overflow-hidden mb-5 bg-gradient-to-br', gaya.tile]">
      <div class="px-5 py-5 md:px-7 flex items-center gap-4">
        <span class="text-6xl md:text-7xl shrink-0" aria-hidden="true">{{ fenomena.icon }}</span>
        <div class="min-w-0">
          <h1 class="font-display font-extrabold text-2xl md:text-3xl text-[#123c2b] leading-tight">{{ fenomena.nama }}</h1>
          <p class="font-semibold text-slate-600 text-sm mt-0.5">Kerjakan lima tahapnya — pilih tahap mana pun, bebas urutan!</p>
          <div class="flex items-center gap-2 mt-3 max-w-xs">
            <div class="flex-1 h-2.5 rounded-full bg-white/70 overflow-hidden">
              <div :class="['h-full rounded-full transition-all', gaya.bar]" :style="{ width: (selesaiCount / 5 * 100) + '%' }" />
            </div>
            <span class="text-xs font-extrabold text-slate-600">{{ Math.round(selesaiCount / 5 * 100) }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stepper tahap -->
    <div class="flex items-center max-w-2xl mx-auto mb-5 px-1" aria-hidden="true">
      <template v-for="(t, i) in DAFTAR_TAHAP" :key="t.id">
        <span :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border-2',
          sudah(t.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400']">
          {{ sudah(t.id) ? '✓' : i + 1 }}
        </span>
        <span v-if="i < DAFTAR_TAHAP.length - 1" :class="['flex-1 h-0.5 mx-1 rounded', sudah(DAFTAR_TAHAP[i + 1].id) || sudah(t.id) ? 'bg-emerald-300' : 'bg-slate-200']" />
      </template>
    </div>

    <div class="space-y-3 max-w-2xl mx-auto">
      <NuxtLink v-for="(t, i) in DAFTAR_TAHAP" :key="t.id" :to="`/fenomena/${fenomena.id}/${t.id}`"
        class="kp-card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition active:scale-[0.99]">
        <span :class="['w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold shrink-0',
          sudah(t.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']">
          {{ sudah(t.id) ? '✓' : (i + 1) }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="font-display font-bold text-slate-700">{{ t.nama }}</p>
          <p class="text-xs font-semibold mt-0.5" :class="sudah(t.id) ? 'text-emerald-600' : 'text-slate-400'">
            {{ sudah(t.id) ? 'Selesai' : 'Belum dikerjakan' }}
          </p>
        </div>
        <span class="text-slate-300" aria-hidden="true">›</span>
      </NuxtLink>
    </div>
  </div>
  <div v-else class="text-center py-16">
    <p class="font-bold text-slate-500">Fenomena tidak ditemukan.</p>
    <NuxtLink to="/fenomena" class="kp-btn-soft mt-4">← Kembali</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { DAFTAR_TAHAP, cariFenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT } from '~/utils/fenomena-ui'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const route = useRoute()
const fenomena = computed(() => cariFenomena(String(route.params.id)))
const gaya = computed(() => (fenomena.value ? GAYA_FENOMENA[fenomena.value.warna] || GAYA_DEFAULT : GAYA_DEFAULT))

const { selesai, muat } = useProgresSiswa()
const sudah = (tahap: string) => !!selesai.value[`${route.params.id}:${tahap}`]
const selesaiCount = computed(() => DAFTAR_TAHAP.filter(t => sudah(t.id)).length)

onMounted(() => { void muat() })
</script>
