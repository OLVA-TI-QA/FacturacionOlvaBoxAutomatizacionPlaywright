import { expect, test } from '@playwright/test'
import { CrossBorderRest } from '@/apiProviders/crossborderRest'
import { tokenType } from '@/types/Interfaces'
import { generateRandomAWB } from '@/utils/helpers'

let crossBorderRest: CrossBorderRest
const guiaExistente: string = 'AWBN056835492'

// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})

test('TC-SEGU-API-01: Parcel Declare - Acceso OK', async () => {
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

        const crearParcelResponse = await crossBorderRest.postCrearParcel(generateRandomAWB(), token)
        expect(crearParcelResponse.status()).toBe(201)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
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

test('TC-SEGU-API-02: Parcel Declare - Token Ausente', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcelSinToken(guiaExistente)
        expect(crearParcelResponse.status()).toBe(403)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-03: Parcel Declare - Duplicado de parcel', async () => {
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

        const guiaDuplicada = 'AWBN056835491'
        const crearParcelResponse = await crossBorderRest.postCrearParcel(guiaDuplicada, token)
        expect(crearParcelResponse.status()).toBe(422)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            code: 'way-bill-exists',
            message: `Guía ${guiaDuplicada} ya existe`
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

test('TC-SEGU-API-04: Parcel Declare - Bearer Vacio', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcel(guiaExistente)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

test('TC-SEGU-API-06: Parcel Declare - Firma Inválida', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcel(guiaExistente, tokenType.TokenInvalido)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

test('TC-SEGU-API-10: LastMile - Acceso OK', async () => {
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

        const crearParcelResponse = await crossBorderRest.patchParcelLastMile(guiaExistente, token)
        expect(crearParcelResponse.status()).toBe(202)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            status: 'ACCEPTED',
            message: 'Updated request accepted'
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

test('TC-SEGU-API-11: LastMile - Token Ausente', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.patchParcelLastMileSinToken(guiaExistente)
        expect(crearParcelResponse.status()).toBe(403)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-12: LastMile - Bearer Vacio', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.patchParcelLastMile(guiaExistente)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

test('TC-SEGU-API-14: LastMile - Firma Inválida', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.patchParcelLastMile(guiaExistente, tokenType.TokenInvalido)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

test('TC-SEGU-API-18: Manifest - Acceso OK', async () => {
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

        const crearParcelResponse = await crossBorderRest.postManifest(false, token)
        expect(crearParcelResponse.status()).toBe(201)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            status: 'CREATED',
            message: 'Manifest created successfully'
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

test('TTC-SEGU-API-19: Manifest - Token Ausente', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postManifestSinToken()
        expect(crearParcelResponse.status()).toBe(403)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-20: Manifest - Bearer Vacio', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postManifest(false)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

test('TC-SEGU-API-22: Manifest - Firma Inválida', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.patchParcelLastMile(guiaExistente, tokenType.TokenInvalido)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
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

