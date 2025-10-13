export enum tokenType {
    Eduardo = 'MTE5NjM2ODppQlMweTIzeGhHbWxTcWxWZHVxbnpMUFRndTlvc1M5c1c2NGVNaklGSG1v',
    Homecenters = 'NDAyNDU0OnZEUUhCaUhyNlJzWklqZG1FbHZFZ1ZYbXhjazE0TERDbjJLRjdlRXVTTm8=',
    TiendasPeruanas = 'MzkxNTgwOmVjOW1pMjhFbjMxSzd2NEtnVWp3MlpUTXduTU1pTlVIenJSWk1VTDhmRk0=',
    ClientIdInvalido = 'OTk5OTk5OmlCUzB5MjN4aEdtbFNxbFZkdXFuekxQVGd1OW9zUzlzVzY0ZU1qSUZIbW8=',
    AlgoritmoInvalido = 'NDAyNDU0PXZEUUhCaUhyNlJzWklqZG1FbHZFZ1ZYbXhjazE0TERDbjJLRjdlRXVTTm8=',
    ClientSecretInvalido = 'MzkxNTgwOnRlc3RpdG9hbGVtdGVzdGl0b2F1dG9tYXRpemFkbw===',
    TokenSqlInjection = 'MTE5NjM2OD1zZWxlY3QqZnJvbXVzdWFyaW9zd2hlcmVpZD0x',
    TokenMalFormado = 'ZWM5bWkyOEVuMzFLN3Y0S2dVancyWlRNd25NTWlOVUh6clJaTVVMOGZGTTozOTE1ODA=',
    TokenInvalido = 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NTkzNzY0NTYsIm5vbWJyZSI6IjExOTYzNjgifQ.hvZQHHnhfLx5G0bz0S2UsmWnTvL7mntyqWEMm1JTtq21mVs-lAkrtnyC-I4hOIx_testitotestitotestitotestito'
}

export enum testType {
    doscientosItemsList,
    doscientosUnoItemsList,
    UnItemsList,
    CeroItemsList
}

export interface ParcelDeclareRequestBody {
    countryManufacture: string | null;
    logisticsCode: string | null;
    currency: string | null;
    grossWeight: string | null;
    packageCount: string | null;
    purchaseWebsite: string | null;
    valueAddedTax: string | null;
    shipping: string | null;
    ctnNumber?: string | null;
    invoiceNumber: string | null;
    wayBillNo: string | null;
    insurance?: string | null;
    receiverInfo: Info | null;
    senderInfo?: Info | null;
    returnInfo?: Info | null;
    itemList: ItemList[] | null;
}

export interface ItemList {
    currency: string | null;
    itemSequenceNumber: string | null;
    descriptionGoods: string | null;
    price: string | null;
    qty: string | null;
    grossWeight: string | null;
    brand: string | null;
    model: string | null;
    productUrl: string | null;
}

export interface Info {
    address: string | null;
    email: string | null;
    fullName: string | null;
    mobilePhone: string | null;
    idUbigeo: string | null;
    zipCode: string | null;
    identityNumber: string | null;
}

export interface ExportConfig<T> {
    data: T[]
    nombreBase: string
    headers: string[]
    nombreHoja?: string
    extraerCampos: CampoExtractor<T>[]
}

export type CampoExtractor<T> = (item: T) => string | number | boolean | undefined

export interface ExcelValidacionExportParcelDeclare {
    idTestCase: string
    statusEsperado: number
    statusObtenido: number
    statusCorrecto: boolean
    bodyResponseEsperado: string
    bodyResponseObtenido: string
    bodyResponseEsperadoCorrecto: boolean
    mensajeErrorObtenido: string
    wayBillNo: string
    tiempoRespuestaToken?: number  // Tiempo en segundos
    tiempoRespuestaParcel?: number // Tiempo en segundos
}

export interface LastMileRequestBody {
    fullName: string | null;
    address: string | null;
    email: string | null;
    mobilePhone: string | null;
    idUbigeo: string | null;
    zipCode: string | null;
}

export interface ManifestDeclareRequestBody {
    masterAirWayBill: string | null;
    flightNumber: string | null;
    declareCountry: string | null;
    etd: string | null;
    eta: string | null;
    fromPortCode: string | null;
    toPortCode: string | null;
    virTotalCount: string | null;
    groosWeight: string | null;
    paqueteInfo: string | null;
    parcelList: ParcelList[] | null;
}

export interface ParcelList {
    wayBillNo: string | null;
}
