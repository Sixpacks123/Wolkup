import { useSupabaseClient } from '#imports'
import type { MunicipalityUser } from '~/types/municipality-user'

export const useMunicipalityUser = () => {
  const supabase = useSupabaseClient()

  const fetchMunicipalityId = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: municipalityUser, error } = await supabase
      .from('municipality_users')
      .select('municipality_id')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching municipality user:', error)
      return null
    }

    return municipalityUser?.municipality_id
  }

  const fetchMunicipalityInfo = async (municipalityId: string) => {
    if (!municipalityId) return null

    const { data: municipality, error } = await supabase
      .from('municipalities')
      .select('*')
      .eq('id', municipalityId)
      .single()

    if (error) {
      console.error('Error fetching municipality:', error)
      return null
    }

    return municipality
  }

  return {
    fetchMunicipalityId,
    fetchMunicipalityInfo
  }
}
