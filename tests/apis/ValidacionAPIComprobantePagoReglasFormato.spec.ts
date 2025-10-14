import { test, expect } from '@playwright/test'
import { procesarValorCeldaExcel, validarDatosExcel } from '@/utils/validadores'
import { exportarResultadosGenerico, generateRandomAWB, leerDatosDesdeExcel } from '@/utils/helpers'
import { ExcelValidacionExportParcelDeclare, saveComprobanteRequest, tokenType } from '@/types/Interfaces'
import { ComprobantePagoRest } from '@/apiProviders/comprobantePagoRest'

test.describe('Pruebas de la API de Comprobante Pago con Excel', () => {
    let comprobantePagoRest: ComprobantePagoRest;

    // Ruta y nombre de la hoja de Excel
    const excelPath = './src/testData/archivosExcel/.xlsx'
    const sheetName = 'BodyRequest'

    // Define el tamaño de cada lote de peticiones
    const BATCH_SIZE = 15

    // Setup de provider before all test
    test.beforeEach(async () => {
        const currentEnvioRest = new ComprobantePagoRest()
        comprobantePagoRest = await currentEnvioRest.init()
    })

    // Test principal con múltiples envíos
    test('Enviar peticiones con valores no válidos y validar respuestas correctas', async () => {
        // Aumenta el tiempo de espera a 120 segundos (120000ms)
        test.setTimeout(120000)

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
                const createUser = procesarValorCeldaExcel(fila['createUser'])
                const idTipoComprobante = procesarValorCeldaExcel(fila['idTipoComprobante'])
                const serieComprobante = procesarValorCeldaExcel(fila['serieComprobante'])
                const idDocCliente = procesarValorCeldaExcel(fila['idDocCliente'])
                const fechaEmision = procesarValorCeldaExcel(fila['fechaEmision'])
                const valorVenta = procesarValorCeldaExcel(fila['valorVenta'])
                const valorIgv = procesarValorCeldaExcel(fila['valorIgv'])
                const precioVenta = procesarValorCeldaExcel(fila['precioVenta'])
                const idMoneda = procesarValorCeldaExcel(fila['idMoneda'])
                const igv = procesarValorCeldaExcel(fila['igv'])
                const baseImponible = procesarValorCeldaExcel(fila['baseImponible'])
                const importeOperacionGravada = procesarValorCeldaExcel(fila['importeOperacionGravada'])
                const idOficina = procesarValorCeldaExcel(fila['idOficina'])
                const idPersJurArea = procesarValorCeldaExcel(fila['idPersJurArea'])
                const flgFacturaElectronica = procesarValorCeldaExcel(fila['flgFacturaElectronica'])
                const flgDivEmi = procesarValorCeldaExcel(fila['flgDivEmi'])
                const idTipoComprobanteFe = procesarValorCeldaExcel(fila['idTipoComprobanteFe'])
                const idTipoAfectacionIgv = procesarValorCeldaExcel(fila['idTipoAfectacionIgv'])
                const idFormaPago = procesarValorCeldaExcel(fila['idFormaPago'])
                const idEmisorComp = procesarValorCeldaExcel(fila['idEmisorComp'])
                const comprobante = procesarValorCeldaExcel(fila['comprobante'])
                const detalle = procesarValorCeldaExcel(fila['detalle'])
                const idTipoNota = procesarValorCeldaExcel(fila['idTipoNota'])
                const motivoNota = procesarValorCeldaExcel(fila['motivoNota'])
                const fechaVencimiento = procesarValorCeldaExcel(fila['fechaVencimiento'])
                const importeDetraccion = procesarValorCeldaExcel(fila['importeDetraccion'])
                const montoNetoPago = procesarValorCeldaExcel(fila['montoNetoPago'])
                const idDetraccion = procesarValorCeldaExcel(fila['idDetraccion'])
                const idMedioPagoDetraccion = procesarValorCeldaExcel(fila['idMedioPagoDetraccion'])
                const observacion = procesarValorCeldaExcel(fila['observacion'])
                const bodyResponseEsperado = fila['bodyResponse']

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
                    idOficina,
                    idPersJurArea,
                    flgFacturaElectronica,
                    flgDivEmi,
                    idTipoComprobanteFe,
                    idTipoAfectacionIgv,
                    idFormaPago,
                    idEmisorComp,
                    comprobante,
                    detalle,
                }

                console.log(`Preparando solicitud para testcase: ${idTestCase}`)

                // Medir tiempo de respuesta del Manifest
                const tiempoInicioManifest = performance.now()
                const response = await comprobantePagoRest.saveComprobanteRequest(body)
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
