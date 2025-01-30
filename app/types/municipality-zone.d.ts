export interface MunicipalityZone {
  id: string
  municipality_id: string
  geojson: any
  created_at: string
  geom: string
}

export type MunicipalityZoneInsert = Omit<MunicipalityZone, 'id' | 'created_at'>
