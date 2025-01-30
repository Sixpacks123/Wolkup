import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Liste des pages publiques (ajustez en fonction de votre application)
  const publicPages = ['/', '/about', '/contact', '/login', '/signup', '/dashboard/**']

  // Si la page est publique, laisser passer
  if (publicPages.includes(to.path)) {
    return
  }

  // Si la page est protégée et que l'utilisateur n'est pas connecté, rediriger vers /login
  if (!user.value) {
    return navigateTo('/login')
  }

  // Si l'utilisateur est connecté et essaie d'accéder à /login, rediriger vers /
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})
