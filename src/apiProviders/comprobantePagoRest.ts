import { request, APIRequestContext } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') })
import { saveComprobanteRequest } from '@/types/Interfaces'

export class ComprobantePagoRest {
    private baseUrl?: APIRequestContext

    async init() {
        this.baseUrl = await request.newContext({
            extraHTTPHeaders: {
                'Content-Type': 'application/json'
            },
            baseURL: process.env.FACTURACION_OLVABOX || ''
        })

        return this
    }

    public async postComprobantePago(bodyRequest: saveComprobanteRequest) {

        const getResponse = await this.baseUrl!.post('/api/v1/comprobante-pago', {
            data: bodyRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }
}
