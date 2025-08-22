import { APIResponse } from '../src/models/APIResponse.ts';
import {
getSuccessResponse,
getErrorResponse,
validateRequest,
getCost,
RoundCost,
getImageCost,
getNickname,
invalidHTTPMethod,
getInvalidMethodResponse,
healthCheck,
validateRequestAndGetUser,
DecodeJWT,
DecodeCookies,
getDataFromEvent,
getBase64Image,
getStatusCodeByResponse,
uriEncode,
} from '../src/utilities/utils.ts';
import {  } from '../src/utilities/utils.ts';


describe('utilities - basic helpers', () => {
beforeAll(() => {
  // Ensure env vars so validateRequest doesn't try to call external verifiers
  process.env.AUTH_KEY = 'test-key';
  process.env.AUTH_OVERRIDE = 'override-token';
  process.env.DEBUG = 'true';
});

test('getSuccessResponse returns APIResponse with provided data and 200 status', () => {
  const data = { foo: 'bar' };
  const res = getSuccessResponse(data);
  expect(res).toEqual(new APIResponse(200, data, null, null));
});

test('getErrorResponse returns APIResponse with provided message and 400 status', () => {
  const msg = { errors: ['bad'] };
  const res = getErrorResponse(msg);
  expect(res).toEqual(new APIResponse(400, msg, null, null));
});

test('validateRequest succeeds when auth equals AUTH_OVERRIDE and body has correct auth and prompt', async () => {
  const event = {};
  const auth = process.env.AUTH_OVERRIDE!;
  const body = { auth: process.env.AUTH_KEY, prompt: 'Hello' };
  const errors = await validateRequest(event, auth, body, true, '');
  expect(errors).toEqual([]);
});

test('validateRequest returns errors for missing auth header and invalid body auth', async () => {
  const event = {};
  const auth = ''; // missing
  const body = { auth: 'bad-key' };
  const errors = await validateRequest(event, auth, body, true, '');
  expect(errors).toContain('Invalid Authorization');
  expect(errors).toContain('No Authorization Header Provided');
  expect(errors).toContain('No prompt provided'); // because prompt missing and promptRequired true
});
});

describe('utilities - cost and formatting', () => {
test('getCost computes cost based on token thousands and model cost', () => {
  // 1500 tokens => ceiling(1.5)=2 * 0.02 = 0.04
  expect(getCost(1500, 0.02)).toBeCloseTo(0.04);
});

test('RoundCost returns 2-decimal string and handles small values', () => {
  expect(RoundCost(0.005)).toBe('0.01'); // rounded up to 0.01
  expect(RoundCost('0.123' as any)).toBe('0.12'); // parses string
});

test('getImageCost returns rounded image cost string', () => {
  // default image cost 0.01 * 3 = 0.03 => "0.03"
  expect(getImageCost(3)).toBe('0.03');
});
});

describe('utilities - misc helpers', () => {
test('getNickname extracts nickname from parentheses and defaults to first name', () => {
  expect(getNickname('John Doe (JD)')).toBe('JD');
  expect(getNickname('Jane Smith')).toBe('Jane');
  expect(getNickname('')).toBeNull();
});

test('invalidHTTPMethod and getInvalidMethodResponse behavior', () => {
  expect(invalidHTTPMethod('PUT')).toBe(true);
  expect(invalidHTTPMethod('GET')).toBe(false);

  // GET returns healthCheck success
  expect(getInvalidMethodResponse('GET')).toEqual(healthCheck());
  // POST returns error response with Invalid HTTP Method
  expect(getInvalidMethodResponse('POST')).toEqual(getErrorResponse({ errors: ['Invalid HTTP Method'] }));
  });
});

describe('API utility functions', () => {
  test('getSuccessResponse returns status 200 with data', () => {
    const expires = new Date();
    const payload = { statusCode: 200, data: { message: 'OK' }, cookie: 'SomeString', expiry: expires };
    const response: APIResponse = getSuccessResponse(payload);
    const expectedResponse: any = {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Headers": "Authorization,Content-Type,Set-Cookie,Cookies,Cookie",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
          "Content-Type": "application/json",
          "Access-Control-Expose-Headers": "Set-Cookie"
        },
        "body": `{"statusCode":200,"data":{"message":"OK"},"cookie":"SomeString","expiry":"${expires.toISOString()}"}`
    };
    // APIResponse instances expose a statusCode and data property
    expect(response.statusCode).toBe(200);
    expect(response).toEqual(expectedResponse);
  });

  test('getErrorResponse returns status 400 with error payload', () => {
    const payload = { errors: ['Something went wrong'] };
    const response: APIResponse = getErrorResponse(payload);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(JSON.stringify(payload));
  });

  test('validateRequest returns an error when prompt is missing', async () => {
    // validateRequest expects: event, auth header, body and promptRequired flag
    const event = {};
    const errors = await validateRequest(event, '', {}, true);
    // An empty body should trigger the "No prompt provided" error message
    expect(errors).toContain('No prompt provided');
  });
});
/**
 * Additional tests to increase coverage for src/utilities/utils.ts
 */

jest.mock('../src/utilities/requestHandler.ts', () => ({
  requestHandler: {
    get: jest.fn().mockResolvedValue({ data: Buffer.from('hello') }),
  },
}));


beforeAll(() => {
  process.env.AUTH_KEY = 'test-key';
  process.env.AUTH_OVERRIDE = process.env.AUTH_OVERRIDE ||'AUTH_OVERRIDE_TOKEN';
  process.env.DEBUG = 'true';
  process.env.OVERRIDE_USER = process.env.OVERRIDE_USER || JSON.stringify({ email: 'Frieza@Dbz.com', name: 'Lord Frieza Emperor of the Universe' });
});

describe('utils - DecodeJWT & DecodeCookies edge cases', () => {
  test('DecodeJWT returns error when credential missing', () => {
    const res = DecodeJWT(null as any);
    expect(res.errors).toContain('No Credenitals Found');
    expect(res.user).toBeNull();
  });

  test('DecodeCookies decodes a valid cookie and returns user object', () => {
    const payload = { foo: 'bar', expiry: Date.now() + 100000 };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const cookies = `sagasage=${b64}`;
    const { errors, user } = DecodeCookies(cookies);
    expect(errors).toEqual([]);
    expect(user).toMatchObject(payload);
  });

  test('DecodeCookies returns expiry error for expired cookie', () => {
    const payload = { foo: 'bar', expiry: Date.now() - 100000 };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const cookies = `sagasage=${b64}`;
    const { errors, user } = DecodeCookies(cookies);
    expect(errors).toContain('Session Expired, please login again');
    expect(user).toBeNull();
  });

  test('DecodeCookies handles missing sagasage cookie', () => {
    const { errors, user } = DecodeCookies('othercookie=abc');
    expect(errors).toContain('Missing or Invalid Cookies Provided');
    expect(user).toBeNull();
  });

  test('DecodeCookies handles malformed base64/JSON gracefully', () => {
    const cookies = `sagasage=${Buffer.from('not-json').toString('base64')}`;
    const res = DecodeCookies(cookies);
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].toString()).toMatch(/Unexpected Error Decoding Cookie/);
    expect(res.user).toBeNull();
  });
});

describe('utils - validateRequestAndGetUser and validateRequest behavior', () => {
  test('validateRequestAndGetUser returns decoded cookie user when validation passes', async () => {
    const payload = { foo: 'bar', expiry: Date.now() + 100000 };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const cookies = `sagasage=${b64}`;
    const event = {};
    const body = { auth: process.env.AUTH_KEY, prompt: 'ok' };
    const result = await validateRequestAndGetUser(event, '', body, true, cookies);
    // returns { errors, user } where errors from DecodeCookies is empty
    expect(result.errors).toEqual([]);
    expect(result.user).toMatchObject(payload);
  });

  test('validateRequestAndGetUser returns validationErrors when validateRequest fails', async () => {
    const event = {};
    const body = { auth: 'bad' };
    const res = await validateRequestAndGetUser(event, '', body, true, '');
    expect(res.validationErrors).toBeDefined();
    expect(res.user).toBeNull();
  });

  test('validateRequest reports missing prompt when promptRequired', async () => {
    const event = {};
    const errors = await validateRequest(event, '', {}, true);
    expect(errors).toContain('No prompt provided');
  });
});

describe('utils - getDataFromEvent and getBase64Image', () => {
  test('getDataFromEvent parses body string and returns headers and path', () => {
    const body = { a: 1 };
    const event = {
      body: JSON.stringify(body),
      headers: { Authorization: 'AuthToken', cookies: 'sagasage=abc' },
      httpMethod: 'POST',
      rawPath: '/test/path',
      requestContext: {},
    } as any;
    const parsed = getDataFromEvent(event);
    expect(parsed.body).toEqual(body);
    expect(parsed.auth).toBe('AuthToken');
    expect(parsed.httpMethod).toBe('POST');
    expect(parsed.cookies).toBe('sagasage=abc');
    expect(parsed.path).toBe('/test/path');
  });

  test('getBase64Image uses requestHandler.get and returns base64 string', async () => {
    const b64 = await getBase64Image('http://example.com/img.png');
    // 'hello' base64 is aGVsbG8=
    expect(b64).toBe(Buffer.from('hello').toString('base64'));
  });
});

describe('utils - small helpers, costs, and edge rounding', () => {
  test('getStatusCodeByResponse respects mapping and default', () => {
    expect(getStatusCodeByResponse('No prompt provided')).toBe(400);
    expect(getStatusCodeByResponse(undefined)).toBe(500);
    expect(getStatusCodeByResponse('Some unknown')).toBe(200);
  });

  test('getCost edge cases', () => {
    expect(getCost(1500, 0.02)).toBeCloseTo(0.04);
    expect(getCost(0, 0.02)).toBe(0); // zero tokens yields zero cost
  });

  test('RoundCost handles tiny values and non-number strings', () => {
    expect(RoundCost(0.005)).toBe('0.01');
    expect(RoundCost('0.123' as any)).toBe('0.12');
    expect(RoundCost(0.0004)).toBe('0.000'); // uses toFixed(3) for very small values
  });

  test('getImageCost and related formatting', () => {
    expect(getImageCost(3)).toBe('0.03');
    expect(getImageCost(0)).toBe('0.000');
  });

  test('misc helpers: nickname, method checks and encoding', () => {
    expect(getNickname('John Doe (JD)')).toBe('JD');
    expect(getNickname('Jane Smith')).toBe('Jane');
    expect(getNickname('')).toBeNull();

    expect(invalidHTTPMethod('PUT')).toBe(true);
    expect(invalidHTTPMethod('GET')).toBe(false);
    expect(getInvalidMethodResponse('GET')).toEqual(healthCheck());
    expect(getInvalidMethodResponse('POST')).toEqual(
      expect.objectContaining({ statusCode: 400 })
    );

    expect(uriEncode('a b/c?')).toBe(encodeURIComponent('a b/c?'));
  });
});
