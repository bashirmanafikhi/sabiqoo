import React from 'react';
import { render } from '@testing-library/react-native';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders message when visible', () => {
    const { getByText } = render(<Toast visible message="Saved" onHide={() => {}} />);
    expect(getByText('Saved')).toBeTruthy();
  });
});