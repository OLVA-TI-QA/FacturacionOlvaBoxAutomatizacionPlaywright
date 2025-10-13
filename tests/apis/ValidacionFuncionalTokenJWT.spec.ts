import { expect, test } from '@playwright/test';
import { CrossBorderRest } from '@/apiProviders/crossborderRest';
import { tokenType } from '@/types/Interfaces';

let crossBorderRest: CrossBorderRest;

// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})


test('TC-AUTH-001: Autenticación OK', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getResponse.status()).toBe(200);
        console.log(getResponse.json())
        expect(getResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: "Bearer"
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-AUTH-002: Basic Mal Formado', async () => {
    try {
        const getResponse = await crossBorderRest.postToken(tokenType.TokenMalFormado)

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

test('TC-AUTH-006: Integración por Cliente', async () => {
    const tokenEntries = Object.entries(tokenType).slice(0, 3);

    const promises = tokenEntries.map(async ([tokenName, tokenValue]) => {
        try {
            console.log(`Testing token: ${tokenName}`);
            const getResponse = await crossBorderRest.postToken(tokenValue);
            expect(getResponse.status()).toBe(200);
            expect(getResponse.json()).resolves.toMatchObject({
                access_token: expect.any(String),
                token_type: "Bearer"
            });
            console.log(`Response for ${tokenName}:`, await getResponse.json());
            return { tokenName, success: true };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Connection error for token ${tokenName}:`, error.message);
            } else {
                console.error(`Unknown error for token ${tokenName}:`, error);
            }
            throw error;
        }
    });

    await Promise.all(promises);
})

test('TC-AUTH-014: Token Repetido', async () => {
    const tokens: string[] = [];
    const numberOfExecutions = 3;

    for (let i = 0; i < numberOfExecutions; i++) {
        try {
            console.log(`Execution ${i + 1}:`);
            const getResponse = await crossBorderRest.postToken(tokenType.Eduardo);

            expect(getResponse.status()).toBe(200);
            expect(getResponse.json()).resolves.toMatchObject({
                access_token: expect.any(String),
                token_type: "Bearer"
            });
            const responseData = await getResponse.json();
            console.log(`Response ${i + 1}:`, responseData);

            const currentToken = responseData.access_token;

            // Validar que el token no sea igual a los anteriores
            expect(tokens).not.toContain(currentToken);
            tokens.push(currentToken);

            // Esperar 1 segundo entre ejecuciones
            if (i < numberOfExecutions - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Connection error on execution ${i + 1}:`, error.message);
            } else {
                console.error(`Unknown error on execution ${i + 1}:`, error);
            }
            throw error;
        }
    }

    console.log('All tokens are unique:', tokens);
})
