import { getSuccessResponse, getErrorResponse, validateRequest } from '../src/utilities/utils.js';

describe('API utility functions', () => {
  test('getSuccessResponse returns status 200 with data', () => {
    const payload = { message: 'OK' };
    const response = getSuccessResponse(payload);
    // APIResponse instances expose a statusCode and data property
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual(payload);
  });

  test('getErrorResponse returns status 400 with error payload', () => {
    const payload = { errors: ['Something went wrong'] };
    const response = getErrorResponse(payload);
    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(payload);
  });

  test('validateRequest returns an error when prompt is missing', async () => {
    // validateRequest expects: event, auth header, body and promptRequired flag
    const event: any = {};
    const errors = await validateRequest(event, '', {}, true);
    // An empty body should trigger the "No prompt provided" error message
    expect(errors).toContain('No prompt provided');
  });
});