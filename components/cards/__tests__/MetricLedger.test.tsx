import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MetricLedger } from '../MetricLedger';

describe('MetricLedger', () => {
  it('renders rows with values and deltas', () => {
    const { getByText, container } = render(
      <MetricLedger
        rows={[
          { label: 'Engaged Sessions', value: '2.7M', delta: { sign: 'up', text: '+22.1% vs prior' } },
          { label: 'Conversion Rate', value: '3.84%', delta: { sign: 'up', text: '+0.6pp' } },
        ]}
      />
    );
    expect(getByText('2.7M')).toBeInTheDocument();
    expect(getByText('Conversion Rate')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
