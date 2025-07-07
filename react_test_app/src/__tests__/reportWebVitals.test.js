import reportWebVitals from '../reportWebVitals';

// Création de mocks pour les métriques web-vitals
const mockGetCLS = jest.fn();
const mockGetFID = jest.fn();
const mockGetFCP = jest.fn();
const mockGetLCP = jest.fn();
const mockGetTTFB = jest.fn();

jest.mock('web-vitals', () => ({
  getCLS: (...args) => mockGetCLS(...args),
  getFID: (...args) => mockGetFID(...args),
  getFCP: (...args) => mockGetFCP(...args),
  getLCP: (...args) => mockGetLCP(...args),
  getTTFB: (...args) => mockGetTTFB(...args),
}));



test("ne fait rien si onPerfEntry n'est pas une fonction", async () => {
  await reportWebVitals(null);
  await reportWebVitals(undefined);
  await reportWebVitals(123);

  expect(mockGetCLS).not.toHaveBeenCalled();
  expect(mockGetFCP).not.toHaveBeenCalled();
  expect(mockGetLCP).not.toHaveBeenCalled();
  expect(mockGetTTFB).not.toHaveBeenCalled();
});
