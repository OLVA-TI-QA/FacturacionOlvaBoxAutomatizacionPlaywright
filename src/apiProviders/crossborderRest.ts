import { request, APIRequestContext } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') })

import parcelDeclareRequest from '@/testData/archivosJson/parcelDeclareRequest.json'
import parcelDeclareRequest200Items from '@/testData/archivosJson/parcel_items_200.json'
import parcelDeclareRequest201Items from '@/testData/archivosJson/parcel_items_201.json'
import parcelDeclareRequest1Items from '@/testData/archivosJson/parcel_items_1.json'
import parcelDeclareRequest0Items from '@/testData/archivosJson/parcel_items_0.json'
import manifestDeclare0Items from '@/testData/archivosJson/manifestDeclare_items_0.json'
import lasmileRequest from '@/testData/archivosJson/lasmileRequest.json'
import manifestRequest from '@/testData/archivosJson/manifestRequest.json'
import { LastMileRequestBody, ManifestDeclareRequestBody, ParcelDeclareRequestBody, testType } from '@/types/Interfaces'
// import { CrearEnvioBody } from '@/types/crearEnvioInterfaces'

export class CrossBorderRest {
    private baseUrl?: APIRequestContext

    async init() {
        this.baseUrl = await request.newContext({
            extraHTTPHeaders: {
                'Content-Type': 'application/json'
            },
            baseURL: process.env.API_BASE_URL_CROSSBORDER_DEV || ''
        })

        return this
    }

    public async postToken(token?: string) {
        const getToken = await this.baseUrl!.post('/crossborder-hub/api/oauth/token', {
            headers: {
                Authorization: `Basic ${token}`
            },
            data: {
                grant_type: 'client_credentials'
            }
        })

        return getToken
    }

    public async postTokenSinHeader() {
        const getToken = await this.baseUrl!.post('/crossborder-hub/api/oauth/token', {
            data: {
                grant_type: 'client_credentials'
            }
        })

        return getToken
    }

    public async postCrearParcel(wayBillNo: string, token?: string) {
        console.log(`wayBillNo generado: ${wayBillNo}`)
        // Clonar el JSON para evitar mutaciones globales
        const body = { ...parcelDeclareRequest, wayBillNo }

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: body
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postCrearParcelSinToken(wayBillNo: string) {
        // Clonar el JSON para evitar mutaciones globales
        const body = { ...parcelDeclareRequest, wayBillNo }

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            data: body
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postCrearParcelMasivo(token: string, bodyRequest: ParcelDeclareRequestBody) {
        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: bodyRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postCrearParcel200Items(testTypes: testType, wayBillNo: string, token?: string) {
        console.log(`wayBillNo generado: ${wayBillNo}`)

        const body = (testTypes === testType.doscientosItemsList) ?
            { ...parcelDeclareRequest200Items, wayBillNo } :
            (testTypes === testType.doscientosUnoItemsList) ?
                { ...parcelDeclareRequest201Items, wayBillNo } :
                (testTypes === testType.UnItemsList) ?
                    { ...parcelDeclareRequest1Items, wayBillNo } :
                    { ...parcelDeclareRequest0Items, wayBillNo }

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: body
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async patchParcelLastMile(wayBillNo: string, token?: string) {
        console.log(`wayBillNo generado: ${wayBillNo}`)

        const getResponse = await this.baseUrl!.patch(`/crossborder-hub/api/parcels/${wayBillNo}/lastMile`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: lasmileRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async patchParcelLastMileSinToken(wayBillNo: string) {

        const getResponse = await this.baseUrl!.patch(`/crossborder-hub/api/parcels/${wayBillNo}/lastMile`, {
            data: lasmileRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async patchLastMileMasivo(token: string, bodyRequest: LastMileRequestBody, wayBillNo?: string) {
        console.log(`wayBillNo generado: ${wayBillNo}`)

        const getResponse = await this.baseUrl!.patch(`/crossborder-hub/api/parcels/${wayBillNo}/lastMile`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: bodyRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postManifest(sinItems: boolean, token?: string) {
        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/manifests', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: sinItems ? manifestDeclare0Items : manifestRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postManifestSinToken() {

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/manifests', {
            data: manifestRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postManifestMasivo(token: string, bodyRequest: ManifestDeclareRequestBody) {

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/manifests', {
            headers: {
                Authorization: `Bearer ${token}`
            },
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
