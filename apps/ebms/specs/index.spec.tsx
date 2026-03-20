jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({
    isAuthenticated: true,
  })),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

import Home from '../app/page';

describe('Home', () => {
  it('renders without crashing', async () => {
    await Home();
    expect(true).toBe(true);
  });
});
