import { render, screen } from '@testing-library/react';
import App from '../App';
// eslint-disable-next-line jest/no-mocks-import
import '../__mocks__/intersectionObserverMock';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
