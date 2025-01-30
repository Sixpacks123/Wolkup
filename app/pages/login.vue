<script setup lang="ts">
// Étiquette : 'Courriel',
import { useSupabaseClient } from '#imports'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Connexion',
})

// Initialiser Supabase
const supabase = useSupabaseClient()

// Champs du formulaire
const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Courriel',
    placeholder: 'Entrez votre courriel',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Mot de passe',
    placeholder: 'Entrez votre mot de passe',
  },
]

// Validation des champs
const validate = (state: any) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Le courriel est requis' })
  if (!state.password) errors.push({ path: 'password', message: 'Le mot de passe est requis' })
  return errors
}

// Connexion à Supabase
async function onSubmit(data: any) {
  const { email, password } = data

  try {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Erreur lors de la connexion :', error.message)
      alert('Échec de la connexion : ' + error.message)
    } else {
      console.log('Utilisateur connecté :', user)
      // Redirection après la connexion
      navigateTo('/dashboard/')
    }
  } catch (err) {
    console.error('Erreur inattendue :', err)
    alert('Une erreur inattendue s’est produite. Veuillez réessayer.')
  }
}

// Fournisseurs OAuth (optionnel, exemple avec GitHub)
const providers = [
  {
    label: 'Continuer avec GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    click: async () => {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
      if (error) {
        console.error('Erreur OAuth :', error.message)
        alert('Échec de la connexion OAuth : ' + error.message)
      }
    },
  },
]
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      title="Bienvenue à nouveau"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #description>
        Vous n'avez pas de compte ?
        <NuxtLink
          to="/signup"
          class="text-primary font-medium"
        >
          Inscrivez-vous
        </NuxtLink>.
      </template>

      <template #password-hint>
        <NuxtLink
          to="/forgot-password"
          class="text-primary font-medium"
        >
          Mot de passe oublié ?
        </NuxtLink>
      </template>

      <template #footer>
        En vous connectant, vous acceptez nos
        <NuxtLink
          to="/terms"
          class="text-primary font-medium"
        >
          Conditions d'utilisation
        </NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
