import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EditorialLede } from '../EditorialLede';

describe('EditorialLede', () => {
  it('renders eyebrow, number, and narrative', () => {
    const { container, getByText } = render(
      <EditorialLede
        eyebrow="Organic sessions"
        number="4.2M"
        narrative="up 18.4% from prior 30 days, led by men's vertical search."
      />
    );
    expect(getByText('Organic sessions')).toBeInTheDocument();
    expect(getByText('4.2M')).toBeInTheDocument();
    expect(getByText(/up 18.4%/)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
