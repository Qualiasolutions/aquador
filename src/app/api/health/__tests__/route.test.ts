/**
 * @jest-environment node
 */

// Store original env
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    STRIPE_SECRET_KEY: 'sk_test_123',
    RESEND_API_KEY: 're_test_key',
    SENTRY_DSN: 'https://test@sentry.io/123',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Import after env setup
import { GET } from '../route';

describe('GET /api/health', () => {
  it('should return 200 with health status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
  });

  it('should include timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('should include environment', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.environment).toBe('test');
  });

  it('should include service checks', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.checks).toBeDefined();
    expect(data.checks.stripe).toBe(true);
    expect(data.checks.resend).toBe(true);
    expect(data.checks.sentry).toBe(true);
  });

  it('should detect missing services', async () => {
    const savedStripeKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const response = await GET();
    const data = await response.json();

    expect(data.checks.stripe).toBe(false);

    process.env.STRIPE_SECRET_KEY = savedStripeKey;
  });

  it('should include no-cache headers', async () => {
    const response = await GET();

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('no-store');
    expect(cacheControl).toContain('no-cache');
  });
});
