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
        // Type conversions to match interface requirements
        const createUser =
          typeof procesarValorCeldaExcel(fila['createUser']) === 'number' ? (procesarValorCeldaExcel(fila['createUser']) as number) : null
        const idTipoComprobante =
          typeof procesarValorCeldaExcel(fila['idTipoComprobante']) === 'string'
            ? (procesarValorCeldaExcel(fila['idTipoComprobante']) as string)
            : null
        const serieComprobante =
          typeof procesarValorCeldaExcel(fila['serieComprobante']) === 'string' ? (procesarValorCeldaExcel(fila['serieComprobante']) as string) : null
        const idDocCliente =
          typeof procesarValorCeldaExcel(fila['idDocCliente']) === 'string' ? (procesarValorCeldaExcel(fila['idDocCliente']) as string) : null
        const fechaEmision =
          typeof procesarValorCeldaExcel(fila['fechaEmision']) === 'string' ? (procesarValorCeldaExcel(fila['fechaEmision']) as string) : null
        const valorVenta =
          typeof procesarValorCeldaExcel(fila['valorVenta']) === 'string' ? (procesarValorCeldaExcel(fila['valorVenta']) as string) : null
        const valorIgv = typeof procesarValorCeldaExcel(fila['valorIgv']) === 'string' ? (procesarValorCeldaExcel(fila['valorIgv']) as string) : null
        const precioVenta =
          typeof procesarValorCeldaExcel(fila['precioVenta']) === 'string' ? (procesarValorCeldaExcel(fila['precioVenta']) as string) : null
        const idMoneda = typeof procesarValorCeldaExcel(fila['idMoneda']) === 'string' ? (procesarValorCeldaExcel(fila['idMoneda']) as string) : null
        const igv = typeof procesarValorCeldaExcel(fila['igv']) === 'string' ? (procesarValorCeldaExcel(fila['igv']) as string) : null
        const baseImponible =
          typeof procesarValorCeldaExcel(fila['baseImponible']) === 'string' ? (procesarValorCeldaExcel(fila['baseImponible']) as string) : null
        const importeOperacionGravada =
          typeof procesarValorCeldaExcel(fila['importeOperacionGravada']) === 'string'
            ? (procesarValorCeldaExcel(fila['importeOperacionGravada']) as string)
            : null
        const idOficina =
          typeof procesarValorCeldaExcel(fila['idOficina']) === 'string' ? (procesarValorCeldaExcel(fila['idOficina']) as string) : null
        const idPersJurArea =
          typeof procesarValorCeldaExcel(fila['idPersJurArea']) === 'string' ? (procesarValorCeldaExcel(fila['idPersJurArea']) as string) : null
        const flgFacturaElectronica =
          typeof procesarValorCeldaExcel(fila['flgFacturaElectronica']) === 'string'
            ? (procesarValorCeldaExcel(fila['flgFacturaElectronica']) as string)
            : null
        const flgDivEmi =
          typeof procesarValorCeldaExcel(fila['flgDivEmi']) === 'string' ? (procesarValorCeldaExcel(fila['flgDivEmi']) as string) : null
        const idTipoComprobanteFe =
          typeof procesarValorCeldaExcel(fila['idTipoComprobanteFe']) === 'string'
            ? (procesarValorCeldaExcel(fila['idTipoComprobanteFe']) as string)
            : null
        const idTipoAfectacionIgv =
          typeof procesarValorCeldaExcel(fila['idTipoAfectacionIgv']) === 'string'
            ? (procesarValorCeldaExcel(fila['idTipoAfectacionIgv']) as string)
            : null
        const idFormaPago =
          typeof procesarValorCeldaExcel(fila['idFormaPago']) === 'string' ? (procesarValorCeldaExcel(fila['idFormaPago']) as string) : null
        const idEmisorComp =
          typeof procesarValorCeldaExcel(fila['idEmisorComp']) === 'string' ? (procesarValorCeldaExcel(fila['idEmisorComp']) as string) : null

        // Parse complex objects
        const comprobanteData = procesarValorCeldaExcel(fila['comprobante'])
        const comprobante: Comprobante | null =
          comprobanteData && typeof comprobanteData === 'string' ? (JSON.parse(comprobanteData) as Comprobante) : null

        const detalleData = procesarValorCeldaExcel(fila['detalle'])
        const detalle: Detalle[] | null = detalleData && typeof detalleData === 'string' ? (JSON.parse(detalleData) as Detalle[]) : null

        const statusEsperadoData = procesarValorCeldaExcel(fila['status'])
        const statusEsperado = typeof statusEsperadoData === 'number' ? statusEsperadoData : parseInt(statusEsperadoData as string) || 0
        const bodyResponseEsperado = fila['bodyResponse']

        const serie = typeof procesarValorCeldaExcel(fila['serie']) === 'string' ? (procesarValorCeldaExcel(fila['serie']) as string) : null
        const formaPago =
          typeof procesarValorCeldaExcel(fila['formaPago']) === 'string' ? (procesarValorCeldaExcel(fila['formaPago']) as string) : null
        const issueDate =
          typeof procesarValorCeldaExcel(fila['issueDate']) === 'string' ? (procesarValorCeldaExcel(fila['issueDate']) as string) : null
        const _idTipoNota =
          typeof procesarValorCeldaExcel(fila['idTipoNota']) === 'string' ? (procesarValorCeldaExcel(fila['idTipoNota']) as string) : null
        const _motivoNota =
          typeof procesarValorCeldaExcel(fila['motivoNota']) === 'string' ? (procesarValorCeldaExcel(fila['motivoNota']) as string) : null
        const fechaVencimiento =
          typeof procesarValorCeldaExcel(fila['fechaVencimiento']) === 'string' ? (procesarValorCeldaExcel(fila['fechaVencimiento']) as string) : null
        const importeDetraccionData = procesarValorCeldaExcel(fila['importeDetraccion'])
        const _importeDetraccion =
          typeof importeDetraccionData === 'number'
            ? importeDetraccionData
            : typeof importeDetraccionData === 'string'
              ? parseFloat(importeDetraccionData) || null
              : null

        const montoNetoPagoData = procesarValorCeldaExcel(fila['montoNetoPago'])
        const _montoNetoPago =
          typeof montoNetoPagoData === 'number'
            ? montoNetoPagoData
            : typeof montoNetoPagoData === 'string'
              ? parseFloat(montoNetoPagoData) || null
              : null

        const idDetraccionData = procesarValorCeldaExcel(fila['idDetraccion'])
        const _idDetraccion =
          typeof idDetraccionData === 'number' ? idDetraccionData : typeof idDetraccionData === 'string' ? parseInt(idDetraccionData) || null : null

        const idMedioPagoDetraccionData = procesarValorCeldaExcel(fila['idMedioPagoDetraccion'])
        const _idMedioPagoDetraccion =
          typeof idMedioPagoDetraccionData === 'number'
            ? idMedioPagoDetraccionData
            : typeof idMedioPagoDetraccionData === 'string'
              ? parseInt(idMedioPagoDetraccionData) || null
              : null
        const tipoOperacionId =
          typeof procesarValorCeldaExcel(fila['tipoOperacionId']) === 'string' ? (procesarValorCeldaExcel(fila['tipoOperacionId']) as string) : null
        const signatureID =
          typeof procesarValorCeldaExcel(fila['signatureID']) === 'string' ? (procesarValorCeldaExcel(fila['signatureID']) as string) : null
        const ruc = typeof procesarValorCeldaExcel(fila['ruc']) === 'string' ? (procesarValorCeldaExcel(fila['ruc']) as string) : null

        const razonSocial =
          typeof procesarValorCeldaExcel(fila['razonSocial']) === 'string' ? (procesarValorCeldaExcel(fila['razonSocial']) as string) : null
        const nombreComercial =
          typeof procesarValorCeldaExcel(fila['nombreComercial']) === 'string' ? (procesarValorCeldaExcel(fila['nombreComercial']) as string) : null
        const razonSocialClie =
          typeof procesarValorCeldaExcel(fila['razonSocialClie']) === 'string' ? (procesarValorCeldaExcel(fila['razonSocialClie']) as string) : null
        const totalDet = typeof procesarValorCeldaExcel(fila['totalDet']) === 'string' ? (procesarValorCeldaExcel(fila['totalDet']) as string) : null

        const importeTotal =
          typeof procesarValorCeldaExcel(fila['importeTotal']) === 'string' ? (procesarValorCeldaExcel(fila['importeTotal']) as string) : null
        const leyendasid =
          typeof procesarValorCeldaExcel(fila['leyendasid']) === 'string' ? (procesarValorCeldaExcel(fila['leyendasid']) as string) : null
        const valueLeyendas =
          typeof procesarValorCeldaExcel(fila['valueLeyendas']) === 'string' ? (procesarValorCeldaExcel(fila['valueLeyendas']) as string) : null
        const schemaCode =
          typeof procesarValorCeldaExcel(fila['schemaCode']) === 'string' ? (procesarValorCeldaExcel(fila['schemaCode']) as string) : null

        const invoiceLineDescription =
          typeof procesarValorCeldaExcel(fila['invoiceLineDescription']) === 'string'
            ? (procesarValorCeldaExcel(fila['invoiceLineDescription']) as string)
            : null
        const invioceLineCodigo =
          typeof procesarValorCeldaExcel(fila['invioceLineCodigo']) === 'string'
            ? (procesarValorCeldaExcel(fila['invioceLineCodigo']) as string)
            : null
        const unitCode = typeof procesarValorCeldaExcel(fila['unitCode']) === 'string' ? (procesarValorCeldaExcel(fila['unitCode']) as string) : null
        const InvoiceLinePorcentaje =
          typeof procesarValorCeldaExcel(fila['InvoiceLinePorcentaje']) === 'string'
            ? (procesarValorCeldaExcel(fila['InvoiceLinePorcentaje']) as string)
            : null

        const schemeId = typeof procesarValorCeldaExcel(fila['schemeId']) === 'string' ? (procesarValorCeldaExcel(fila['schemeId']) as string) : null
        const schemaName =
          typeof procesarValorCeldaExcel(fila['schemaName']) === 'string' ? (procesarValorCeldaExcel(fila['schemaName']) as string) : null
        const _idTipoOperacionSunat =
          typeof procesarValorCeldaExcel(fila['idTipoOperacionSunat']) === 'string'
            ? (procesarValorCeldaExcel(fila['idTipoOperacionSunat']) as string)
            : null
        const _observacion =
          typeof procesarValorCeldaExcel(fila['observacion']) === 'string' ? (procesarValorCeldaExcel(fila['observacion']) as string) : null

        // Campos adicionales requeridos por la interfaz
        const numeroData = procesarValorCeldaExcel(fila['numero'])
        const numero = typeof numeroData === 'number' ? numeroData : typeof numeroData === 'string' ? parseInt(numeroData) || null : null

        const issueTime =
          typeof procesarValorCeldaExcel(fila['issueTime']) === 'string' ? (procesarValorCeldaExcel(fila['issueTime']) as string) : null

        const invoiceTypeCode =
          typeof procesarValorCeldaExcel(fila['invoiceTypeCode']) === 'string' ? (procesarValorCeldaExcel(fila['invoiceTypeCode']) as string) : null

        const moneda = typeof procesarValorCeldaExcel(fila['moneda']) === 'string' ? (procesarValorCeldaExcel(fila['moneda']) as string) : null

        // Usar las variables con prefijo _ para los campos que ya están definidos
        const idTipoNota = _idTipoNota
        const motivoNota = _motivoNota
        const importeDetraccion = _importeDetraccion
        const montoNetoPago = _montoNetoPago
        const idDetraccion = _idDetraccion
        const idMedioPagoDetraccion = _idMedioPagoDetraccion
        const idTipoOperacionSunat = _idTipoOperacionSunat

        const body: saveComprobanteRequest = {
          createUser,
          idTipoComprobante,
          serieComprobante,
          idDocCliente,
          fechaEmision,
          valorVenta,
          valorIgv,
          precioVenta,
          idMoneda,
          igv,
          baseImponible,
          importeOperacionGravada,
          collect: null,
          estado: null,
          fechaAnulacion: null,
          observacion: _observacion,
          idOficina,
          pc: null,
          efectivo: null,
          idPersJurArea,
          flgFacturaElectronica,
          flgDivEmi,
          glosaDivEmi: null,
          estadoFacE: null,
          idTipoComprobanteFe,
          idTipoNota: null,
          motivoNota: null,
          fechaVencimiento,
          idTipoAfectacionIgv,
          idFormaPago,
          idVoucher: null,
          idEmisorComp,
          idTipoServicio: null,
          glosa: null,
          importeDetraccion: null,
          importePenalidad: null,
          observacionVoucher: null,
          idTipoCancelacion: null,
          importeAutodetraccion: null,
          nombreCliente: null,
          direccionCliente: null,
          montoNetoPago: null,
          idDetraccion: null,
          comprobante,
          idMedioPagoDetraccion: null,
          idTipoOperacionSunat: null,
          idTipoDetalle: null,
          detalle,
          serie,
          formaPago,
          issueDate,
          tipoOperacionId,
          signatureID,
          ruc,
          razonSocial,
          nombreComercial,
          razonSocialClie,
          totalDet,
          importeTotal,
          leyendasid,
          valueLeyendas,
          schemaCode,
          invoiceLineDescription,
          invioceLineCodigo,
          unitCode,
          InvoiceLinePorcentaje,
          schemeId,
          schemaName
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
