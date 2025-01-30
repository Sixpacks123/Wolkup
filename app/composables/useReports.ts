import { useSupabaseClient } from '#imports'
import { useMunicipalityUser } from './useMunicipalityUser'

export const useReports = async () => {
  const supabase = useSupabaseClient()
  const { fetchMunicipalityId } = useMunicipalityUser()

  const municipalityId = await fetchMunicipalityId()
  if (!municipalityId) return []

  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('*')
    .eq('municipality_id', municipalityId)

  if (reportsError) {
    console.error('Erreur lors de la récupération des signalements', reportsError)
    return []
  }

  return reports
}
