/** Guard untuk area BFF (konsep baru). */
export default defineNuxtRouteMiddleware(async () => {
  const { user, siap, me } = useAuth()
  if (!siap.value) await me()
  if (!user.value) return navigateTo('/masuk')
})
