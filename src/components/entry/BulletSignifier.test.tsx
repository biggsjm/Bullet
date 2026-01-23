import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulletSignifier } from './BulletSignifier';

describe('BulletSignifier', () => {
  it('renders task bullet', () => {
    render(<BulletSignifier bulletType="task" taskState="incomplete" />);
    expect(screen.getByRole('button')).toHaveTextContent('•');
  });

  it('renders complete task as ×', () => {
    render(<BulletSignifier bulletType="task" taskState="complete" />);
    expect(screen.getByRole('button')).toHaveTextContent('×');
  });

  it('renders migrated task as >', () => {
    render(<BulletSignifier bulletType="task" taskState="migrated" />);
    expect(screen.getByRole('button')).toHaveTextContent('>');
  });

  it('renders scheduled task as <', () => {
    render(<BulletSignifier bulletType="task" taskState="scheduled" />);
    expect(screen.getByRole('button')).toHaveTextContent('<');
  });

  it('renders event bullet as ○', () => {
    render(<BulletSignifier bulletType="event" />);
    expect(screen.getByRole('button')).toHaveTextContent('○');
  });

  it('renders note bullet as -', () => {
    render(<BulletSignifier bulletType="note" />);
    expect(screen.getByRole('button')).toHaveTextContent('-');
  });

  it('renders priority signifier', () => {
    render(<BulletSignifier bulletType="task" taskState="incomplete" signifier="priority" />);
    expect(screen.getByRole('button')).toHaveTextContent('*');
  });

  it('renders inspiration signifier', () => {
    render(<BulletSignifier bulletType="task" taskState="incomplete" signifier="inspiration" />);
    expect(screen.getByRole('button')).toHaveTextContent('!');
  });

  it('calls onCycleState when clicked', () => {
    const onCycle = vi.fn();
    render(<BulletSignifier bulletType="task" taskState="incomplete" onCycleState={onCycle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onCycle).toHaveBeenCalledOnce();
  });
});
