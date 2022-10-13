export type TranscriptionForm = {
    items: Array<TranscriptionItem>
    isRandomize?: boolean
    staffId?: number
    date?: string
    researchId?: number
    note?: string
    notHasEmptySample?: boolean
    mergeItem?: boolean
    standardCount?: number
    errorNote?: string
    isTest?: boolean
}

export type TranscriptionItem = {
    id: string
    count: number
    useUp?: boolean // only sample
}
