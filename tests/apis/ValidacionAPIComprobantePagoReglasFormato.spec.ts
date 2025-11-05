import { test, expect } from '@playwright/test'
import { procesarValorCeldaExcel, validarDatosExcel } from '@/utils/validadores'
import { exportarResultadosGenerico, leerDatosDesdeExcel } from '@/utils/helpers'
import { ExcelValidacionExportParcelDeclare, saveComprobanteRequest, Comprobante, Detalle } from '@/types/Interfaces'
import { ComprobantePagoRest } from '@/apiProviders/comprobantePagoRest'

test.describe('Pruebas de la API de Comprobante Pago con Excel', () => {
  let comprobantePagoRest: ComprobantePagoRest

  // Ruta y nombre de la hoja de Excel
  const excelPath = './src/testData/archivosExcel/comprobantePagoRequest.xlsx'
  const sheetName = 'BodyRequest'

  // Define el tamaño de cada lote de peticiones
  const BATCH_SIZE = 20

  // Setup de provider before all test
  test.beforeEach(async () => {
    const currentEnvioRest = new ComprobantePagoRest()
    comprobantePagoRest = await currentEnvioRest.init()
  })

  // Test principal con múltiples envíos
  test('Enviar peticiones con valores no válidos y validar respuestas correctas', async () => {
    test.setTimeout(240000)

    // Paso 1: Leer Excel
    const datos = leerDatosDesdeExcel(excelPath, sheetName)
    // Validar que el archivo de datos existe y tiene datos
    validarDatosExcel(datos, sheetName)

    const resultadosValidacion: ExcelValidacionExportParcelDeclare[] = []

    // 2. Iterar los datos en lotes para procesar peticiones con concurrencia limitada
    for (let i = 0; i < 120; i += BATCH_SIZE) {
      const batch = datos.slice(i, i + BATCH_SIZE)
      console.log(
        `\n--- Procesando lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(datos.length / BATCH_SIZE)} (${batch.length} elementos) ---`
      )

      // 2. Mapear los datos a un array de promesas de peticiones API
      const requestsToSendForBatch = batch.map(async (fila: any) => {
        // Ajusta los nombres de las columnas a como estén en tu Excel
        const idTestCase = fila['idTestCase']
        const fechaEmision = fila['fechaEmision']
        const idPersJurArea = procesarValorCeldaExcel(fila['idPersJurArea'])
        const idOficina = procesarValorCeldaExcel(fila['idOficina'])
        const idEmisorComp = procesarValorCeldaExcel(fila['idEmisorComp'])
        const pc = procesarValorCeldaExcel(fila['pc'])
        const glosaDivEmi = procesarValorCeldaExcel(fila['glosaDivEmi'])
        const collect = procesarValorCeldaExcel(fila['collect'])
        const flgDivEmi = procesarValorCeldaExcel(fila['flgDivEmi'])
        const flgFacturaElectronica = procesarValorCeldaExcel(fila['flgFacturaElectronica'])
        const igv = procesarValorCeldaExcel(fila['igv'])
        const efectivo = procesarValorCeldaExcel(fila['efectivo'])
        const precioVenta = procesarValorCeldaExcel(fila['precioVenta'])
        const valorIgv = procesarValorCeldaExcel(fila['valorIgv'])
        const valorVenta = procesarValorCeldaExcel(fila['valorVenta'])
        const baseImponible = procesarValorCeldaExcel(fila['baseImponible'])
        const idTipoComprobante = procesarValorCeldaExcel(fila['idTipoComprobante'])
        const idDocCliente = procesarValorCeldaExcel(fila['idDocCliente'])
        const serieComprobante = procesarValorCeldaExcel(fila['serieComprobante'])
        const moneda = procesarValorCeldaExcel(fila['moneda'])
        const estadoResumenComp = procesarValorCeldaExcel(fila['estadoResumenComp'])
        const idTipoServicio = procesarValorCeldaExcel(fila['idTipoServicio'])
        const estado = procesarValorCeldaExcel(fila['estado'])
        const estadoFacE = procesarValorCeldaExcel(fila['estadoFacE'])
        const idFormaPago = procesarValorCeldaExcel(fila['idFormaPago'])
        const createUser = procesarValorCeldaExcel(fila['createUser'])
        const createDatetime = procesarValorCeldaExcel(fila['createDatetime'])
        const comprobanteTipoOperacionId = procesarValorCeldaExcel(fila['comprobanteTipoOperacionId'])
        const comprobanteSerie = procesarValorCeldaExcel(fila['comprobanteSerie'])
        const comprobanteIssueDate = procesarValorCeldaExcel(fila['comprobanteIssueDate'])
        const comprobanteIssueTime = procesarValorCeldaExcel(fila['comprobanteIssueTime'])
        const comprobanteInvoiceTypeCode = procesarValorCeldaExcel(fila['comprobanteInvoiceTypeCode'])
        const comprobanteMoneda = procesarValorCeldaExcel(fila['comprobanteMoneda'])
        const comprobanteSignatureID = procesarValorCeldaExcel(fila['comprobanteSignatureID'])
        const comprobanteRuc = procesarValorCeldaExcel(fila['comprobanteRuc'])
        const comprobanteRazonSocial = procesarValorCeldaExcel(fila['comprobanteRazonSocial'])
        const comprobanteTipoClie = procesarValorCeldaExcel(fila['comprobanteTipoClie'])
        const comprobanteRucClie = procesarValorCeldaExcel(fila['comprobanteRucClie'])
        const comprobanteRazonSocialClie = procesarValorCeldaExcel(fila['comprobanteRazonSocialClie'])
        const comprobanteDigitalSignatureAttachmentExternalReferenceURI = procesarValorCeldaExcel(fila['comprobanteDigitalSignatureAttachmentExternalReferenceURI'])
        const comprobanteTaxAmount = procesarValorCeldaExcel(fila['comprobanteTaxAmount'])
        const comprobanteTotalDet = procesarValorCeldaExcel(fila['comprobanteTotalDet'])
        const comprobanteValorVentaBruto = procesarValorCeldaExcel(fila['comprobanteValorVentaBruto'])
        const comprobantePrecioVenta = procesarValorCeldaExcel(fila['comprobantePrecioVenta'])
        const comprobantePrecioUnitCodigo = procesarValorCeldaExcel(fila['comprobantePrecioUnitCodigo'])
        const comprobanteImporteTotal = procesarValorCeldaExcel(fila['comprobanteImporteTotal'])
        const comprobanteFormaPago = procesarValorCeldaExcel(fila['comprobanteFormaPago'])
        const comprobanteCodigoAnexo = procesarValorCeldaExcel(fila['comprobanteCodigoAnexo'])
        const comprobanteLeyendasId = procesarValorCeldaExcel(fila['comprobanteLeyendasId'])
        const comprobanteLeyendasValue = procesarValorCeldaExcel(fila['comprobanteLeyendasValue'])
        const comprobanteTaxSubTotalTaxableAmount = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalTaxableAmount'])
        const comprobanteTaxSubTotalTaxAmount = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalTaxAmount'])
        const comprobanteTaxSubTotalCategoryId = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalCategoryId'])
        const comprobanteTaxSubTotalPorcentaje = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalPorcentaje'])
        const comprobanteTaxSubTotalExemptionCode = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalExemptionCode'])
        const comprobanteTaxSubTotalSchemeId = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalSchemeId'])
        const comprobanteTaxSubTotalSchemaName = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalSchemaName'])
        const comprobanteTaxSubTotalSchemaCode = procesarValorCeldaExcel(fila['comprobanteTaxSubTotalSchemaCode'])
        const comprobanteInvoiceLineId = procesarValorCeldaExcel(fila['comprobanteInvoiceLineId'])
        const comprobanteInvoiceLineUnitCodigo = procesarValorCeldaExcel(fila['comprobanteInvoiceLineUnitCodigo'])
        const comprobanteInvoiceLineUnitCode = procesarValorCeldaExcel(fila['comprobanteInvoiceLineUnitCode'])
        const comprobanteInvoiceLineCantidad = procesarValorCeldaExcel(fila['comprobanteInvoiceLineCantidad'])
        const comprobanteInvoiceLineValorVenta = procesarValorCeldaExcel(fila['comprobanteInvoiceLineValorVenta'])
        const comprobanteInvoiceLinePrecioUnitario = procesarValorCeldaExcel(fila['comprobanteInvoiceLinePrecioUnitario'])
        const comprobanteInvoiceLinePrecioUnitCodigo = procesarValorCeldaExcel(fila['comprobanteInvoiceLinePrecioUnitCodigo']) 
        const comprobanteInvoiceLineValorUnitario = procesarValorCeldaExcel(fila['comprobanteInvoiceLineValorUnitario'])
        const comprobanteInvoiceLineTaxAmount = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxAmount'])
        const comprobanteInvoiceLineDescripcion = procesarValorCeldaExcel(fila['comprobanteInvoiceLineDescripcion'])
        const comprobanteInvoiceLineCodigo = procesarValorCeldaExcel(fila['comprobanteInvoiceLineCodigo'])
        const comprobanteInvoiceLineTaxSubTotalTaxableAmount = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalTaxableAmount'])
        const comprobanteInvoiceLineTaxSubTotalTaxAmount = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalTaxAmount'])
        const comprobanteInvoiceLineTaxSubTotalCategoryId = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalCategoryId'])
        const comprobanteInvoiceLineTaxSubTotalPorcentaje = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalPorcentaje'])
        const comprobanteInvoiceLineTaxSubTotalExemptionCode = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalExemptionCode'])
        const comprobanteInvoiceLineTaxSubTotalSchemeId = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalSchemeId'])
        const comprobanteInvoiceLineTaxSubTotalSchemaName = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalSchemaName'])
        const comprobanteInvoiceLineTaxSubTotalSchemaCode = procesarValorCeldaExcel(fila['comprobanteInvoiceLineTaxSubTotalSchemaCode'])
        const comprobanteValorVenta = procesarValorCeldaExcel(fila['comprobanteValorVenta'])
        const comprobanteOrdenCompra = procesarValorCeldaExcel(fila['comprobanteOrdenCompra'])
        const comprobanteCodigoBienServicioDetraccion = procesarValorCeldaExcel(fila['comprobanteCodigoBienServicioDetraccion'])
        const comprobanteNumeroCuentaDetraccion = procesarValorCeldaExcel(fila['comprobanteNumeroCuentaDetraccion'])
        const comprobanteCodigoMedioPagoDetraccion = procesarValorCeldaExcel(fila['comprobanteCodigoMedioPagoDetraccion'])
        const comprobantePorcentajeDetraccion = procesarValorCeldaExcel(fila['comprobantePorcentajeDetraccion'])
        const comprobanteImporteDetraccion = procesarValorCeldaExcel(fila['comprobanteImporteDetraccion'])  //agregar columna
        const idMoneda = procesarValorCeldaExcel(fila['idMoneda'])
        const importeOperacionGravada = procesarValorCeldaExcel(fila['importeOperacionGravada'])
        const idTipoComprobanteFe = procesarValorCeldaExcel(fila['idTipoComprobanteFe'])
        const idTipoAfectacionIgv = procesarValorCeldaExcel(fila['idTipoAfectacionIgv'])
        const importeDetraccion = procesarValorCeldaExcel(fila['importeDetraccion'])
        const montoNetoPago = procesarValorCeldaExcel(fila['montoNetoPago'])
        const idDetraccion = procesarValorCeldaExcel(fila['idDetraccion'])
        const idMedioPagoDetraccion = procesarValorCeldaExcel(fila['idMedioPagoDetraccion'])
        const idTipoOperacionSunat = procesarValorCeldaExcel(fila['idTipoOperacionSunat'])
        const detalleId = procesarValorCeldaExcel(fila['detalleId'])
        const detalleEmision = procesarValorCeldaExcel(fila['detalleEmision'])
        const detalleRemito = procesarValorCeldaExcel(fila['detalleRemito'])
        const detalleValorVenta = procesarValorCeldaExcel(fila['detalleValorVenta'])
        const detalleValorIgv = procesarValorCeldaExcel(fila['detalleValorIgv'])
        const detallePrecioVenta = procesarValorCeldaExcel(fila['detallePrecioVenta'])
        const detallePesoKgs = procesarValorCeldaExcel(fila['detallePesoKgs'])
        const detalleCodSede = procesarValorCeldaExcel(fila['detalleCodSede'])
        const detalleNombreServicio = procesarValorCeldaExcel(fila['detalleNombreServicio'])
        const detalleCodigoServicio = procesarValorCeldaExcel(fila['detalleCodigoServicio'])
        const detalleIdTipoAfectacion = procesarValorCeldaExcel(fila['detalleIdTipoAfectacion'])
        const detalleValorAfectacion = procesarValorCeldaExcel(fila['detalleValorAfectacion'])
        const observacion = procesarValorCeldaExcel(fila['observacion'])
        const fechaVencimiento = procesarValorCeldaExcel(fila['fechaVencimiento'])
        const statusEsperado = fila['status']
        const bodyResponseEsperado = fila['bodyResponse']


        const body: saveComprobanteRequest = {
          comprobantePrecioUnitCodigo,
          fechaEmision,
          idPersJurArea,
          idOficina,
          idEmisorComp,
          pc,
          glosaDivEmi,
          collect,
          flgDivEmi,
          flgFacturaElectronica,
          igv,
          efectivo,
          precioVenta,
          valorIgv,
          valorVenta,
          baseImponible,
          idTipoComprobante,
          idDocCliente,
          serieComprobante,
          moneda,
          estadoResumenComp,
          idTipoServicio,
          estado,
          estadoFacE,
          idFormaPago,
          createUser,
          createDatetime,
          comprobante: {
            tipoOperacionId: comprobanteTipoOperacionId,
            serie: comprobanteSerie,
            issueDate: comprobanteIssueDate,
            issueTime: comprobanteIssueTime,
            invoiceTypeCode: comprobanteInvoiceTypeCode,
            moneda: comprobanteMoneda,
            signatureID: comprobanteSignatureID,
            ruc: comprobanteRuc,
            razonSocial: comprobanteRazonSocial,
            tipoClie: comprobanteTipoClie,
            rucClie: comprobanteRucClie,
            razonSocialClie: comprobanteRazonSocialClie,
            digitalSignatureAttachmentExternalReferenceURI: comprobanteDigitalSignatureAttachmentExternalReferenceURI,
            taxAmount: comprobanteTaxAmount,
            totalDet: comprobanteTotalDet,
            valorVentaBruto: comprobanteValorVentaBruto,
            precioVenta: comprobantePrecioVenta,
            importeTotal: comprobanteImporteTotal,
            valorVenta: comprobanteValorVenta,
            formaPago: comprobanteFormaPago,
            codigoAnexo: comprobanteCodigoAnexo,
            leyendas: [{
              id: comprobanteLeyendasId,
              value: comprobanteLeyendasValue
            }],
            taxSubTotal: [{
              taxableAmount: comprobanteTaxSubTotalTaxableAmount,
              taxAmount: comprobanteTaxSubTotalTaxAmount,
              categoryId: comprobanteTaxSubTotalCategoryId,
              porcentaje: comprobanteTaxSubTotalPorcentaje,
              exemptionCode: comprobanteTaxSubTotalExemptionCode,
              schemeId: comprobanteTaxSubTotalSchemeId,
              schemaName: comprobanteTaxSubTotalSchemaName,
              schemaCode: comprobanteTaxSubTotalSchemaCode
            }],
            invoiceLine: [{
              id: comprobanteInvoiceLineId,
              unitCode: comprobanteInvoiceLineUnitCode,
              cantidad: comprobanteInvoiceLineCantidad,
              valorVenta: comprobanteInvoiceLineValorVenta,
              precioUnitario: comprobanteInvoiceLinePrecioUnitario,
              precioUnitCodigo: comprobanteInvoiceLinePrecioUnitCodigo,
              valorUnitario: comprobanteInvoiceLineValorUnitario,
              taxAmount: comprobanteInvoiceLineTaxAmount,
              descripcion: comprobanteInvoiceLineDescripcion,
              codigo: comprobanteInvoiceLineCodigo,
              taxSubTotal: [{
                taxableAmount: comprobanteInvoiceLineTaxSubTotalTaxableAmount,
                taxAmount: comprobanteInvoiceLineTaxSubTotalTaxAmount,
                categoryId: comprobanteInvoiceLineTaxSubTotalCategoryId,
                porcentaje: comprobanteInvoiceLineTaxSubTotalPorcentaje,
                exemptionCode: comprobanteInvoiceLineTaxSubTotalExemptionCode,
                schemeId: comprobanteInvoiceLineTaxSubTotalSchemeId,
                schemaName: comprobanteInvoiceLineTaxSubTotalSchemaName,
                schemaCode: comprobanteInvoiceLineTaxSubTotalSchemaCode
              }]
            }],
            codigoBienServicioDetraccion: comprobanteCodigoBienServicioDetraccion,
            numeroCuentaDetraccion: comprobanteNumeroCuentaDetraccion,
            codigoMedioPagoDetraccion: comprobanteCodigoMedioPagoDetraccion,
            porcentajeDetraccion: comprobantePorcentajeDetraccion,
            importeDetraccion: comprobanteImporteDetraccion
          },
          idMoneda,
          importeOperacionGravada,
          observacion,
          idTipoComprobanteFe,
          idTipoNota: null,
          motivoNota: null,
          fechaVencimiento,
          idTipoAfectacionIgv,
          idDetraccion,
          idMedioPagoDetraccion,
          idTipoOperacionSunat,
          detalle: [{
            id: detalleId,
            emision: detalleEmision,
            remito: detalleRemito,
            valorVenta: detalleValorVenta,
            valorIgv: detalleValorIgv,
            precioVenta: detallePrecioVenta,
            pesoKgs: detallePesoKgs,
            codSede: detalleCodSede,
            nombreServicio: detalleNombreServicio,
            codigoServicio: detalleCodigoServicio,
            idTipoAfectacion: detalleIdTipoAfectacion,
            valorAfectacion: detalleValorAfectacion
          }]
        }

        // const body: Comprobante = {}
        // const body: Detalle = {}

        console.log(`Preparando solicitud para testcase: ${idTestCase}`)

        // Medir tiempo de respuesta del Manifest
        const tiempoInicioManifest = performance.now()
        const response = await comprobantePagoRest.postComprobantePago(body)
        const tiempoFinManifest = performance.now()
        const tiempoRespuestaManifestMs = tiempoFinManifest - tiempoInicioManifest
        const tiempoRespuestaManifest = tiempoRespuestaManifestMs / 1000 // Convertir a segundos

        // Retornamos la respuesta y algunos datos adicionales para la validación
        return { response, idTestCase, statusEsperado, bodyResponseEsperado, tiempoRespuestaManifest }
      })

      // Ejecutar todas las promesas del lote en paralelo y esperar a que terminen
      const responsesInBatch = await Promise.all(requestsToSendForBatch)

      // 3. Procesar y validar cada respuesta del lote
      for (const { response, idTestCase, statusEsperado, bodyResponseEsperado, tiempoRespuestaManifest } of responsesInBatch) {
        const bodyResponse = await response.json()

        console.log(`Response for testcase ${idTestCase}:`, bodyResponse)

        // Función para normalizar el orden de arrays y objetos para comparación
        const normalizeForComparison = (obj: any): string => {
          if (Array.isArray(obj)) {
            // Ordenar arrays por field primero, luego por message
            const sorted = obj.sort((a, b) => {
              // Si ambos tienen field, ordenar por field primero
              if (a.field && b.field) {
                const fieldComparison = a.field.localeCompare(b.field)
                if (fieldComparison !== 0) {
                  return fieldComparison
                }
              }
              // Si field es igual o no existe, ordenar por message
              if (a.message && b.message) {
                return a.message.localeCompare(b.message)
              }
              // Fallback: comparar por representación JSON completa
              return JSON.stringify(a).localeCompare(JSON.stringify(b))
            })
            return JSON.stringify(sorted)
          } else if (typeof obj === 'object' && obj !== null) {
            // Para objetos, ordenar las claves
            const sortedObj = Object.keys(obj)
              .sort()
              .reduce((result: any, key) => {
                result[key] = obj[key]
                return result
              }, {})
            return JSON.stringify(sortedObj)
          }
          return JSON.stringify(obj)
        }

        // La lógica de validación ahora es más explícita y segura
        let statusCorrecto: boolean
        let bodyResponseEsperadoCorrecto: boolean
        let mensajeErrorObtenido: string = ''

        const statusObtenido = response.status()

        if (statusObtenido === statusEsperado) {
          statusCorrecto = true

          if (normalizeForComparison(bodyResponse) === normalizeForComparison(bodyResponseEsperado)) {
            bodyResponseEsperadoCorrecto = true
          } else {
            bodyResponseEsperadoCorrecto = false
          }

          mensajeErrorObtenido = bodyResponse.message
        } else {
          // Si el status no es 201, asumimos que hay un error
          statusCorrecto = false
          bodyResponseEsperadoCorrecto = false
          mensajeErrorObtenido = bodyResponse.message
          console.log(`Error obtenido para la fila con ID Test Case ${idTestCase}: ${statusObtenido} - ${mensajeErrorObtenido}`)
        }

        resultadosValidacion.push({
          idTestCase: idTestCase,
          statusEsperado: statusEsperado,
          statusObtenido: statusObtenido,
          statusCorrecto: statusCorrecto,
          bodyResponseEsperado: bodyResponseEsperado,
          bodyResponseObtenido: JSON.stringify(bodyResponse),
          bodyResponseEsperadoCorrecto: bodyResponseEsperadoCorrecto,
          mensajeErrorObtenido: mensajeErrorObtenido,
          tiempoRespuestaParcel: tiempoRespuestaManifest
        })

        console.log(
          `✅ Fila procesada: ID testcase ${idTestCase} - Status Correcto?: ${statusCorrecto} - Body Response Correcto?: ${bodyResponseEsperadoCorrecto} - Tiempo Manifest: ${tiempoRespuestaManifest.toFixed(3)}s`
        )
      }
    } // Fin del bucle de lotes

    // 4. Generar el resumen y exportar a Excel
    const totalRegistros = resultadosValidacion.length
    const bodyResponseEsperadoCorrecto = resultadosValidacion.filter((item) => item.bodyResponseEsperadoCorrecto === true).length
    const bodyResponseEsperadoInCorrecto = totalRegistros - bodyResponseEsperadoCorrecto
    const status400Obtenidos = resultadosValidacion.filter((item) => item.statusObtenido === 400).length
    const status400Esperados = resultadosValidacion.filter((item) => item.statusEsperado === 400).length

    console.log('---')
    console.log(`📊 Resumen de la prueba:`)
    console.log(`- ${totalRegistros} registros procesados.`)
    console.log(`- ${bodyResponseEsperadoInCorrecto} body response con error (error: false).`)
    console.log(`- ${status400Obtenidos} status 400 obtenidos.`)
    console.log('---')

    exportarResultadosGenerico<ExcelValidacionExportParcelDeclare>({
      data: resultadosValidacion,
      nombreBase: 'resultados_validacion_estructura_body_request_comprobantePago',
      headers: [
        'ID TESTCASE',
        'STATUS ESPERADO',
        'STATUS OBTENIDO',
        'EL STATUS ES CORRECTO?',
        'BODY RESPONSE ESPERADO',
        'BODY RESPONSE OBTENIDO',
        'EL BODY RESPONSE ES CORRECTO?',
        'MENSAJE OBTENIDO',
        'TIEMPO RESPUESTA COMPROBANTE PAGO (s)'
      ],
      extraerCampos: [
        (r) => r.idTestCase,
        (r) => r.statusEsperado,
        (r) => r.statusObtenido,
        (r) => (r.statusCorrecto ? 'Sí' : 'No'),
        (r) => r.bodyResponseEsperado,
        (r) => r.bodyResponseObtenido,
        (r) => (r.bodyResponseEsperadoCorrecto ? 'Sí' : 'No'),
        (r) => r.mensajeErrorObtenido,
        (r) => r.tiempoRespuestaParcel ?? 0
      ]
    })

    // expect(totalRegistros).toBe(bodyResponseEsperadoCorrecto) // Validación de la cantidad de request enviados comparados entre su body response
    expect(status400Obtenidos).toBe(status400Esperados) // Validación de la cantidad de status 400 comparados entre los esperados y obtenidos
    expect(totalRegistros).toBe(bodyResponseEsperadoCorrecto) // Validación de la cantidad de status 422 comparados entre los esperados y obtenidos
  })
})
