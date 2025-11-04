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
    tiempoRespuestaParcel?: number // Tiempo en segundos
}

export interface saveComprobanteRequest {
    fechaEmision?: string | null;
    idPersJurArea?: number | string | null;
    idOficina?: number | string | null;
    idEmisorComp?: number | string | null;
    pc?: string | null;
    glosaDivEmi?: string | null;
    collect?: string | null;
    flgDivEmi?: string | null;
    flgFacturaElectronica?: string | null;
    igv?: number | string | null;
    efectivo?: number | string | null;
    precioVenta?: number | string | null;
    valorIgv?: number | string | null;
    valorVenta?: number | string | null;
    baseImponible?: number | string | null;
    idTipoComprobante?: number | string | null;
    idDocCliente?: number | string | null;
    serieComprobante?: string | null;
    moneda?: string | null;
    estadoResumenComp?: string | null;
    idTipoServicio?: number | string | null;
    estado?: number | string | null;
    estadoFacE?: number | string | null;
    idFormaPago?: number | string | null;
    createUser?: number | string | null;
    createDatetime?: string | null;
    comprobante?: Comprobante | null;
    idMoneda?: number | string | null;
    importeOperacionGravada?: number | string | null;
    observacion?: null;
    idTipoComprobanteFe?: number | string | null;
    idTipoNota?: null;
    motivoNota?: null;
    fechaVencimiento?: null;
    idTipoAfectacionIgv?: number | string | null;
    idVoucher?: null;
    glosa?: null;
    importeDetraccion?: number | string | null;
    importePenalidad?: null;
    observacionVoucher?: null;
    idTipoCancelacion?: null;
    importeAutodetraccion?: null;
    nombreCliente?: null;
    direccionCliente?: null;
    montoNetoPago?: number | string | null;
    idDetraccion?: number | string | null;
    idMedioPagoDetraccion?: number | string | null;
    idTipoOperacionSunat?: number | string | null;
    detalle?: Detalle[] | null;
    comprobantePrecioUnitCodigo? : number | string | null;
}

export interface Comprobante {
    tipoOperacionId?: string | null;
    serie?: string | null;
    numero?: null;
    issueDate?: string | null;
    dueDate?: null;
    issueTime?: string | null;
    invoiceTypeCode?: string | null;
    moneda?: string | null;
    signatureID?: string | null;
    ruc?: string | null;
    razonSocial?: string | null;
    nombreComercial?: null;
    addressTypeCode?: null;
    tipoClie?: string | null;
    rucClie?: string | null;
    razonSocialClie?: string | null;
    digitalSignatureAttachmentExternalReferenceURI?: string | null;
    taxAmount?: string | null;
    totalDet?: number | string | null;
    valorVentaBruto?: string | null;
    precioVenta?: string | null;
    valorVenta?: string | null;
    totalDescuento?: null;
    importeTotal?: string | null;
    otrosCargos?: null;
    formaPago?: string | null;
    montoPendiente?: null;
    montoTotal?: null;
    fechaVencimiento?: null;
    notaCreditoEspecial?: null;
    codigoAnexo?: string | null;
    leyendas?: Leyenda[] | null;
    taxSubTotal?: TaxSubTotal[] | null;
    invoiceLine?: InvoiceLine[] | null;
    ordenCompra?: null;
    codigoBienServicioDetraccion?: string | null;
    numeroCuentaDetraccion?: string | null;
    codigoMedioPagoDetraccion?: string | null;
    porcentajeDetraccion?: string | null;
    importeDetraccion?: string | null;
}

export interface InvoiceLine {
    id?: number | string | null;
    unitCode?: string | null;
    cantidad?: string | null;
    valorVenta?: string | null;
    precioUnitario?: string | null;
    precioUnitCodigo?: string | null;
    valorUnitario?: string | null;
    taxAmount?: string | null;
    descripcion?: string | null;
    codigo?: string | null;
    taxSubTotal?: TaxSubTotal[] | null;
}

export interface TaxSubTotal {
    taxableAmount?: string | null;
    taxAmount?: string | null;
    categoryId?: string | null;
    porcentaje?: string | null;
    exemptionCode?: string | null;
    schemeId?: string | null;
    schemaName?: string | null;
    schemaCode?: string | null;
}

export interface Detalle {
    id?: string | null;
    emision?: string | null;
    remito?: string | null;
    valorVenta?: string | null;
    valorIgv?: string | null;
    precioVenta?: string | null;
    pesoKgs?: string | null;
    codSede?: string | null;
    nombreServicio?: string | null;
    codigoServicio?: string | null;
    idTipoAfectacion?: string | null;
    valorAfectacion?: string | null;
}

export interface Leyenda {
    id?: string | null;
    value?: string | null;
}

export interface ExportConfig<T> {
    data: T[]
    nombreBase: string
    headers: string[]
    nombreHoja?: string
    extraerCampos: CampoExtractor<T>[]
}
