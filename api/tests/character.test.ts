import { character } from '../src/index';

// Mocked event helper to simulate AWS Lambda API Gateway events
function buildEvent(overrides: Partial<any> = {}) {
  return {
    httpMethod: 'POST',
    body: {},
    headers: {},
    auth: undefined,
    cookies: undefined,
    ...overrides,
  };
}

describe('character handler', () => {
  it('returns invalid method response for unsupported HTTP methods', async () => {
    const event = buildEvent({ httpMethod: 'GET' });
    const result = await character(event, {}, () => {});
    // The handler should return an error when the method is not POST/PUT
    expect(result.statusCode).toBe(405);
  });

  it('returns an error when the request body is missing required fields', async () => {
    const event = buildEvent();
    // Provide a valid method but missing required body fields such as prompt
    const result = await character(event, {}, () => {});
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).errors.length).toBeGreaterThan(0);
  });
});