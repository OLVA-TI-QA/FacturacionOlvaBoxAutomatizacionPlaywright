import { expect, test } from '@playwright/test';
import { CrossBorderRest } from '@/apiProviders/crossborderRest';
import { tokenType } from '@/types/Interfaces';

let crossBorderRest: CrossBorderRest;

// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})


test('TC-AUTH-002: Credenciales Inválidas (client_secret inválido)', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.ClientSecretInvalido)

        expect(getResponse.status()).toBe(401);
        expect(getResponse.json()).resolves.toMatchObject({
            status: 'FAILED',
            message: 'Authorization invalid'
        })

        console.log(getResponse.json())
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-003: Token Faltante', async () => {
    try {
        const getResponse = await crossBorderRest.postTokenSinHeader()

        expect(getResponse.status()).toBe(401);
        expect(getResponse.json()).resolves.toMatchObject({
            status: 'FAILED',
            message: 'Authorization invalid'
        })

        console.log(getResponse.json())
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-005: Credenciales Vacías', async () => {
    try {
        const getResponse = await crossBorderRest.postToken()

        expect(getResponse.status()).toBe(401);
        expect(getResponse.json()).resolves.toMatchObject({
            status: 'FAILED',
            message: 'Authorization invalid'
        })

        console.log(getResponse.json())
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-009: Inyección SQL/NoSQL', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.TokenSqlInjection)

        expect(getResponse.status()).toBe(401);
        expect(getResponse.json()).resolves.toMatchObject({
            status: 'FAILED',
            message: 'Authorization invalid'
        })

        console.log(getResponse.json())
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-019: Credenciales Inválidas (client_id inválido)', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.ClientIdInvalido)

        expect(getResponse.status()).toBe(403);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-020: Algoritmo no Soportado', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.AlgoritmoInvalido)

        expect(getResponse.status()).toBe(401);
        expect(getResponse.json()).resolves.toMatchObject({
            status: 'FAILED',
            message: 'Authorization invalid'
        })

        console.log(getResponse.json())
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})
