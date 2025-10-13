import { expect, test } from '@playwright/test'
import { CrossBorderRest } from '@/apiProviders/crossborderRest'
import { testType, tokenType } from '@/types/Interfaces'
import { generateRandomAWB } from '@/utils/helpers'

let crossBorderRest: CrossBorderRest

// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})

test('TC-P-200-ITEMS: creación exitosa con el número máximo de items en itemList (200)', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: 'Bearer'
        })
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postCrearParcel200Items(testType.doscientosItemsList, generateRandomAWB(), token)
        expect(crearParcelResponse.status()).toBe(201)

        const responseBody = await crearParcelResponse.json()
        expect(responseBody).toMatchObject({
            status: 'CREATED',
            message: 'Parcel created successfully'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-P-201-ITEMS: Error superando el número máximo de items en itemList (201)', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: 'Bearer'
        })
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postCrearParcel200Items(testType.doscientosUnoItemsList, generateRandomAWB(), token)
        expect(crearParcelResponse.status()).toBe(400)

        const responseBody = await crearParcelResponse.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody[0]).toMatchObject({
            field: 'itemList',
            message: 'La lista debe tener entre 1 y 200 elementos'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-P-1-ITEMS: creación exitosa con el número mínimo de items en itemList (1)', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: 'Bearer'
        })
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postCrearParcel200Items(testType.UnItemsList, generateRandomAWB(), token)
        expect(crearParcelResponse.status()).toBe(201)

        const responseBody = await crearParcelResponse.json()
        expect(responseBody).toMatchObject({
            status: 'CREATED',
            message: 'Parcel created successfully'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-P-0-ITEMS: Error sin el número mínimo de items en itemList (0)', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: 'Bearer'
        })
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postCrearParcel200Items(testType.CeroItemsList, generateRandomAWB(), token)
        expect(crearParcelResponse.status()).toBe(400)

        const responseBody = await crearParcelResponse.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody[0]).toMatchObject({
            field: 'itemList',
            message: 'La lista debe tener entre 1 y 200 elementos'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-MA-0-ITEMS: parcelList (Límite Mín.)', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: 'Bearer'
        })
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postManifest(true, token)
        expect(crearParcelResponse.status()).toBe(400)

        const responseBody = await crearParcelResponse.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody[0]).toMatchObject({
            field: 'parcelList',
            message: 'size must be between 1 and 50000'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})
