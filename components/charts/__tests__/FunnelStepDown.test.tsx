import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FunnelStepDown } from '../FunnelStepDown';

describe('FunnelStepDown', () => {
  it('renders steps with values and continue rates', () => {
    const { getByText, container } = render(
      <FunnelStepDown
        steps={[
          { label: 'Sessions',    value: 4_200_000, rateToNext: 0.58 },
          { label: 'Product View', value: 2_436_000, rateToNext: 0.22 },
          { label: 'Add to Cart',  value: 535_920,   rateToNext: 0 },
        ]}
      />
    );
    expect(getByText('Sessions')).toBeInTheDocument();
    expect(getByText('4.2M')).toBeInTheDocument();
    expect(getByText(/58.0% continue/)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
