import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('shows the first vocabulary card and progress', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /practice english vocabulary with focused cards/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /resilient/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('1 of 3');
    expect(
      screen.getByText(/try to define the word before revealing it/i),
    ).toBeInTheDocument();
  });

  it('reveals the definition and example sentence', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /show definition/i }));

    expect(
      screen.getByText(/able to recover quickly after difficulty/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a resilient learner tries again after a difficult quiz/i),
    ).toBeInTheDocument();
  });

  it('moves to the next word and resets the prompt', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /show definition/i }));
    await user.click(screen.getByRole('button', { name: /next word/i }));

    expect(screen.getByRole('heading', { name: /curious/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('2 of 3');
    expect(
      screen.getByText(/try to define the word before revealing it/i),
    ).toBeInTheDocument();
  });

  it('wraps back to the first word after the final card', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /next word/i }));
    await user.click(screen.getByRole('button', { name: /next word/i }));
    await user.click(screen.getByRole('button', { name: /next word/i }));

    expect(screen.getByRole('heading', { name: /resilient/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('1 of 3');
  });
});
