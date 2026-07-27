import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, DeviceStatusBadge, deviceStatusMeta } from './StatusBadge';

describe('StatusBadge', () => {
  it('mostra o rótulo e o dot pulsante (sem clipar o anel: sem overflow-hidden)', () => {
    const { container } = render(<StatusBadge variant="online" label="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
    // o anel do animate-ping deve existir (pulse) e a pílula NÃO deve ter overflow-hidden.
    expect(container.querySelector('.animate-ping')).not.toBeNull();
    expect(container.querySelector('.overflow-hidden')).toBeNull();
  });

  it('variante offline não pulsa', () => {
    const { container } = render(<StatusBadge variant="offline" label="Offline" />);
    expect(container.querySelector('.animate-ping')).toBeNull();
  });
});

describe('deviceStatusMeta', () => {
  it('centraliza rótulo/tom por status (pairing = "Pareando")', () => {
    expect(deviceStatusMeta('online')).toMatchObject({ label: 'Online', variant: 'online', pulse: true });
    expect(deviceStatusMeta('pairing')).toMatchObject({ label: 'Pareando', variant: 'pairing', pulse: true });
    expect(deviceStatusMeta('offline')).toMatchObject({ label: 'Offline', variant: 'offline', pulse: false });
    expect(deviceStatusMeta('desconhecido')).toMatchObject({ variant: 'neutral' });
  });
});

describe('DeviceStatusBadge', () => {
  it('renderiza o rótulo canônico a partir do status', () => {
    render(<DeviceStatusBadge status="pairing" />);
    expect(screen.getByText('Pareando')).toBeInTheDocument();
  });
});
