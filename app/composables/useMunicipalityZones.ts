import { useSupabaseClient } from '#imports'
import type { MunicipalityZone, MunicipalityZoneInsert } from '~/types/municipality-zone'

export const useMunicipalityZones = () => {
  const supabase = useSupabaseClient()

  const getMunicipalityZones = async (municipalityId: string) => {
    const { data, error } = await supabase
      .from('municipality_zones')
      .select('*')
      .eq('municipality_id', municipalityId)

    if (error) {
      console.error('Error fetching municipality zones:', error)
      return []
    }

    return data as MunicipalityZone[]
  }

  const createMunicipalityZone = async (zone: MunicipalityZoneInsert) => {
    const { data, error } = await supabase
      .from('municipality_zones')
      .insert(zone)
      .select()
      .single()

    if (error) {
      console.error('Error creating municipality zone:', error)
      return null
    }

    return data as MunicipalityZone
  }

  return {
    getMunicipalityZones,
    createMunicipalityZone
  }
}
