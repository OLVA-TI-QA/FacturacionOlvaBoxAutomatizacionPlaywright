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
    // Aumenta el tiempo de espera a 120 segundos (120000ms)
    test.setTimeout(240000)

    // Paso 1: Leer Excel
    const datos = leerDatosDesdeExcel(excelPath, sheetName)
    // Validar que el archivo de datos existe y tiene datos
    validarDatosExcel(datos, sheetName)

    const resultadosValidacion: ExcelValidacionExportParcelDeclare[] = []

    // 2. Iterar los datos en lotes para procesar peticiones con concurrencia limitada
    for (let i = 0; i < datos.length; i += BATCH_SIZE) {
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
        const comprobanteTipoOperacionId = procesarValorCeldaExcel(fila['tipoOperacionId'])
        const comprobanteSerie = procesarValorCeldaExcel(fila['serie'])
        const comprobanteIssueDate = procesarValorCeldaExcel(fila['issueDate'])
        const comprobanteIssueTime = procesarValorCeldaExcel(fila['issueTime'])
        const comprobanteInvoiceTypeCode = procesarValorCeldaExcel(fila['invoiceTypeCode'])
        const comprobanteMoneda = procesarValorCeldaExcel(fila['moneda'])
        const comprobanteSignatureID = procesarValorCeldaExcel(fila['signatureID'])
        const comprobanteRuc = procesarValorCeldaExcel(fila['ruc'])
        const comprobanteRazonSocial = procesarValorCeldaExcel(fila['razonSocial'])
        const comprobanteTipoClie = procesarValorCeldaExcel(fila['comprobanteTipoClie'])
        const comprobanteRucClie = procesarValorCeldaExcel(fila['rucClie'])
        const comprobanteRazonSocialClie = procesarValorCeldaExcel(fila['razonSocialClie'])
        const comprobanteDigitalSignatureAttachmentExternalReferenceURI = procesarValorCeldaExcel(fila['digitalSignatureAttachmentExternalReferenceURI'])
        const comprobanteTaxAmount = procesarValorCeldaExcel(fila['taxAmount'])
        const comprobanteTotalDet = procesarValorCeldaExcel(fila['totalDet'])
        const comprobanteValorVentaBruto = procesarValorCeldaExcel(fila['valorVentaBruto'])
        const comprobantePrecioVenta = procesarValorCeldaExcel(fila['precioVenta'])
        const comprobanteImporteTotal = procesarValorCeldaExcel(fila['importeTotal'])
        const comprobanteFormaPago = procesarValorCeldaExcel(fila['formaPago'])
        const comprobanteCodigoAnexo = procesarValorCeldaExcel(fila['comprobanteCodigoAnexo'])
        const comprobanteLeyendasId = procesarValorCeldaExcel(fila['comprobanteLeyendasId'])
        const comprobanteLeyendasValue = procesarValorCeldaExcel(fila['value'])
        const comprobanteTaxSubTotalTaxableAmount = procesarValorCeldaExcel(fila['taxableAmount'])
        const comprobanteTaxSubTotalTaxAmount = procesarValorCeldaExcel(fila['taxAmount'])
        const comprobanteTaxSubTotalCategoryId = procesarValorCeldaExcel(fila['categoryId'])
        const comprobanteTaxSubTotalPorcentaje = procesarValorCeldaExcel(fila['porcentaje'])
        const comprobanteTaxSubTotalExemptionCode = procesarValorCeldaExcel(fila['exemptionCode'])
        const comprobanteTaxSubTotalSchemeId = procesarValorCeldaExcel(fila['schemeId'])
        const comprobanteTaxSubTotalSchemaName = procesarValorCeldaExcel(fila['schemaName'])
        const comprobanteTaxSubTotalSchemaCode = procesarValorCeldaExcel(fila['schemaCode'])
        const comprobanteInvoiceLineId = procesarValorCeldaExcel(fila['id'])
        const comprobanteInvoiceLineUnitCode = procesarValorCeldaExcel(fila['unitCode'])
        const comprobanteInvoiceLineCantidad = procesarValorCeldaExcel(fila['cantidad'])
        const comprobanteInvoiceLineValorVenta = procesarValorCeldaExcel(fila['valorVenta'])
        const comprobanteInvoiceLinePrecioUnitario = procesarValorCeldaExcel(fila['precioUnitario'])
        const comprobanteInvoiceLinePrecioUnitCodigo = procesarValorCeldaExcel(fila['precioUnitCodigo'])
        const comprobanteInvoiceLineValorUnitario = procesarValorCeldaExcel(fila['valorUnitario'])
        const comprobanteInvoiceLineTaxAmount = procesarValorCeldaExcel(fila['taxAmount'])
        const comprobanteInvoiceLineDescripcion = procesarValorCeldaExcel(fila['descripcion'])
        const comprobanteInvoiceLineCodigo = procesarValorCeldaExcel(fila['codigo'])
        const comprobanteInvoiceLineTaxSubTotalTaxableAmount = procesarValorCeldaExcel(fila['taxableAmount'])
        const comprobanteInvoiceLineTaxSubTotalTaxAmount = procesarValorCeldaExcel(fila['taxAmount'])
        const comprobanteInvoiceLineTaxSubTotalCategoryId = procesarValorCeldaExcel(fila['categoryId'])
        const comprobanteInvoiceLineTaxSubTotalPorcentaje = procesarValorCeldaExcel(fila['porcentaje'])
        const comprobanteInvoiceLineTaxSubTotalExemptionCode = procesarValorCeldaExcel(fila['exemptionCode'])
        const comprobanteInvoiceLineTaxSubTotalSchemeId = procesarValorCeldaExcel(fila['schemeId'])
        const comprobanteInvoiceLineTaxSubTotalSchemaName = procesarValorCeldaExcel(fila['schemaName'])
        const comprobanteInvoiceLineTaxSubTotalSchemaCode = procesarValorCeldaExcel(fila['schemaCode'])
        const comprobanteOrdenCompra = procesarValorCeldaExcel(fila['ordenCompra'])
        const comprobanteCodigoBienServicioDetraccion = procesarValorCeldaExcel(fila['codigoBienServicioDetraccion'])
        const comprobanteNumeroCuentaDetraccion = procesarValorCeldaExcel(fila['numeroCuentaDetraccion'])
        const comprobanteCodigoMedioPagoDetraccion = procesarValorCeldaExcel(fila['codigoMedioPagoDetraccion'])
        const comprobantePorcentajeDetraccion = procesarValorCeldaExcel(fila['porcentajeDetraccion'])
        const comprobanteImporteDetraccion = procesarValorCeldaExcel(fila['importeDetraccion'])
        const idMoneda = procesarValorCeldaExcel(fila['idMoneda'])
        const importeOperacionGravada = procesarValorCeldaExcel(fila['importeOperacionGravada'])
        const idTipoComprobanteFe = procesarValorCeldaExcel(fila['idTipoComprobanteFe'])
        const idTipoAfectacionIgv = procesarValorCeldaExcel(fila['idTipoAfectacionIgv'])
        const importeDetraccion = procesarValorCeldaExcel(fila['importeDetraccion'])
        const montoNetoPago = procesarValorCeldaExcel(fila['montoNetoPago'])
        const idDetraccion = procesarValorCeldaExcel(fila['idDetraccion'])
        const idMedioPagoDetraccion = procesarValorCeldaExcel(fila['idMedioPagoDetraccion'])
        const idTipoOperacionSunat = procesarValorCeldaExcel(fila['idTipoOperacionSunat'])
        const detalleId = procesarValorCeldaExcel(fila['id'])
        const detalleEmision = procesarValorCeldaExcel(fila['emision'])
        const detalleRemito = procesarValorCeldaExcel(fila['remito'])
        const detalleValorVenta = procesarValorCeldaExcel(fila['valorVenta'])
        const detalleValorIgv = procesarValorCeldaExcel(fila['valorIgv'])
        const detallePrecioVenta = procesarValorCeldaExcel(fila['precioVenta'])
        const detallePesoKgs = procesarValorCeldaExcel(fila['pesoKgs'])
        const detalleCodSede = procesarValorCeldaExcel(fila['codSede'])
        const detalleNombreServicio = procesarValorCeldaExcel(fila['nombreServicio'])
        const detalleCodigoServicio = procesarValorCeldaExcel(fila['codigoServicio'])
        const detalleIdTipoAfectacion = procesarValorCeldaExcel(fila['idTipoAfectacion'])
        const detalleValorAfectacion = procesarValorCeldaExcel(fila['valorAfectacion'])
        const statusEsperado = fila['status']
        const bodyResponseEsperado = fila['bodyResponse']


        const body: saveComprobanteRequest = {
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
          observacion: null,
          idTipoComprobanteFe,
          idTipoNota: null,
          motivoNota: null,
          fechaVencimiento: null,
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
          //Uso de switch case para la conversión
          switch (statusObtenido) {
            case 201:
              if (normalizeForComparison(bodyResponse) === normalizeForComparison(JSON.parse(bodyResponseEsperado))) {
                bodyResponseEsperadoCorrecto = true
              } else {
                bodyResponseEsperadoCorrecto = false
              }

              mensajeErrorObtenido = bodyResponse.message
              break
            default:
              if (normalizeForComparison(bodyResponse) === normalizeForComparison(JSON.parse(bodyResponseEsperado))) {
                bodyResponseEsperadoCorrecto = true
              } else {
                bodyResponseEsperadoCorrecto = false
              }

              mensajeErrorObtenido = bodyResponse.message
              break
          }
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
    const status201Obtenidos = totalRegistros - status400Obtenidos
    const status400Esperados = resultadosValidacion.filter((item) => item.statusEsperado === 400).length
    const status201Esperados = totalRegistros - status400Esperados

    console.log('---')
    console.log(`📊 Resumen de la prueba:`)
    console.log(`- ${totalRegistros} registros procesados.`)
    console.log(`- ${bodyResponseEsperadoInCorrecto} body response con error (error: false).`)
    console.log(`- ${status400Obtenidos} status 400 obtenidos.`)
    console.log(`- ${status201Obtenidos} status 201 obtenidos.`)
    console.log('---')

    exportarResultadosGenerico<ExcelValidacionExportParcelDeclare>({
      data: resultadosValidacion,
      nombreBase: 'resultados_validacion_estructura_body_request_manifest',
      headers: [
        'ID TESTCASE',
        'STATUS ESPERADO',
        'STATUS OBTENIDO',
        'EL STATUS ES CORRECTO?',
        'BODY RESPONSE ESPERADO',
        'BODY RESPONSE OBTENIDO',
        'EL BODY RESPONSE ES CORRECTO?',
        'MENSAJE OBTENIDO',
        'TIEMPO RESPUESTA MANIFEST (s)'
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
    expect(status201Obtenidos).toBe(status201Esperados) // Validación de la cantidad de status 201 comparados entre los esperados y obtenidos
    expect(totalRegistros).toBe(bodyResponseEsperadoCorrecto) // Validación de la cantidad de status 422 comparados entre los esperados y obtenidos
  })
})
