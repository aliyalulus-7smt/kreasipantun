<template>
  <canvas v-if="aktif" ref="kanvas" class="fixed inset-0 z-[90] pointer-events-none" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Confetti canvas ringan tanpa library: potongan warna-warni jatuh
 * dari atas layar dengan putaran & gravitasi, ~3 detik.
 * Dipicu lewat ref: confettiRef.value?.letus() / .letus(true) untuk versi besar.
 */
const aktif = ref(false)
const kanvas = ref<HTMLCanvasElement | null>(null)
let raf = 0

const WARNA = ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#1663b8', '#0e7a4f']

interface Potongan {
  x: number; y: number; vx: number; vy: number
  ukuran: number; warna: string; sudut: number; putar: number
  lingkaran: boolean; goyang: number
}

function letus(besar = false) {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  aktif.value = true
  nextTick(() => jalankan(besar))
}

function jalankan(besar: boolean) {
  const cv = kanvas.value
  if (!cv) { aktif.value = false; return }
  const ctx = cv.getContext('2d')
  if (!ctx) { aktif.value = false; return }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = window.innerWidth * dpr
  cv.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)
  const W = window.innerWidth
  const jumlah = besar ? 220 : 130
  const potongan: Potongan[] = Array.from({ length: jumlah }, () => ({
    x: Math.random() * W,
    y: -20 - Math.random() * window.innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2 + Math.random() * 3.2,
    ukuran: 6 + Math.random() * 7,
    warna: WARNA[Math.floor(Math.random() * WARNA.length)],
    sudut: Math.random() * Math.PI,
    putar: (Math.random() - 0.5) * 0.25,
    lingkaran: Math.random() < 0.35,
    goyang: Math.random() * Math.PI * 2,
  }))
  const mulai = performance.now()
  const durasi = besar ? 3600 : 2800
  function gambar(now: number) {
    const t = now - mulai
    ctx!.clearRect(0, 0, W, window.innerHeight)
    for (const p of potongan) {
      p.goyang += 0.05
      p.x += p.vx + Math.sin(p.goyang) * 0.8
      p.y += p.vy
      p.vy += 0.045
      p.sudut += p.putar
      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate(p.sudut)
      ctx!.fillStyle = p.warna
      ctx!.globalAlpha = t > durasi - 700 ? Math.max(0, (durasi - t) / 700) : 1
      if (p.lingkaran) {
        ctx!.beginPath(); ctx!.arc(0, 0, p.ukuran / 2, 0, Math.PI * 2); ctx!.fill()
      } else {
        ctx!.fillRect(-p.ukuran / 2, -p.ukuran / 4, p.ukuran, p.ukuran / 2)
      }
      ctx!.restore()
    }
    if (t < durasi) { raf = requestAnimationFrame(gambar) }
    else { aktif.value = false }
  }
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(gambar)
}

onUnmounted(() => cancelAnimationFrame(raf))

defineExpose({ letus })
</script>
