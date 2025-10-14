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
        createUser:              string | null | number;
        idTipoComprobante:       string | null;
        serieComprobante:        string | null;
        idDocCliente:            string | null;
        fechaEmision:            string | null;
        valorVenta:              string | null;
        valorIgv:                string | null;
        precioVenta:             string | null;
        idMoneda:                string | null;
        igv:                     string | null;
        baseImponible:           string | null;
        importeOperacionGravada: string | null;
        collect:                 number;
        estado:                  number;
        fechaAnulacion:          string;
        observacion:             string;
        idOficina:               string | null;
        pc:                      string;
        efectivo:                number;
        idPersJurArea:           string | null;
        flgFacturaElectronica:   string | null;
        flgDivEmi:               string | null;
        glosaDivEmi:             string | null;
        estadoFacE:              number;
        idTipoComprobanteFe:     string | null;
        idTipoNota:              string;
        motivoNota:              string;
        fechaVencimiento:        Date;
        idTipoAfectacionIgv:     string | null;
        idFormaPago:             string | null;
        idVoucher:               null;
        idEmisorComp:            string | null;
        idTipoServicio:          number;
        glosa:                   string;
        importeDetraccion:       number;
        importePenalidad:        string;
        observacionVoucher:      string;
        idTipoCancelacion:       number;
        importeAutodetraccion:   number;
        nombreCliente:           string;
        direccionCliente:        string;
        montoNetoPago:           number;
        idDetraccion:            number;
        comprobante:             Comprobante;
        idMedioPagoDetraccion:   number;
        idTipoOperacionSunat:    number;
        idTipoDetalle:           number;
        detalle:                 Detalle[];
    }

    export interface Comprobante {
        tipoOperacionId:                                string | null;
        serie:                                          string | null;
        numero:                                         number;
        issueDate:                                      Date;
        issueTime:                                      string | null;
        invoiceTypeCode:                                string | null;
        moneda:                                         string | null;
        signatureID:                                    string | null;
        ruc:                                            string | null;
        razonSocial:                                    string | null;
        nombreComercial:                                string | null;
        tipoClie:                                       string | null;
        rucClie:                                        string | null;
        razonSocialClie:                                string | null;
        digitalSignatureAttachmentExternalReferenceURI: string | null;
        taxAmount:                                      string | null;
        totalDet:                                       number;
        valorVentaBruto:                                string | null;
        precioVenta:                                    string | null;
        importeTotal:                                   string | null;
        formaPago:                                      string | null;
        codigoAnexo:                                    string | null;
    }

    export interface Detalle {
        id: string | null;
    }


export interface ExportConfig<T> {
    data: T[]
    nombreBase: string
    headers: string[]
    nombreHoja?: string
    extraerCampos: CampoExtractor<T>[]
}
