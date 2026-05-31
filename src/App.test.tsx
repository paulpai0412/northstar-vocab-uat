import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('provides stable learning navigation for study, quiz, and progress', async () => {
    const user = userEvent.setup();
    render(<App />);

    const navigation = screen.getByRole('navigation', {
      name: /learning sections/i,
    });

    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /study/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('region', { name: /study vocabulary/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /quiz/i }));

    expect(screen.getByRole('button', { name: /quiz/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('region', { name: /quiz readiness/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /progress/i }));

    expect(screen.getByRole('button', { name: /progress/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('region', { name: /learning progress/i }),
    ).toBeInTheDocument();
  });

  it('shows the first vocabulary card and progress', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /practice english vocabulary with focused cards/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /resilient/i })).toBeInTheDocument();
    expect(screen.getByText(/adjective/i)).toBeInTheDocument();
    expect(screen.getByText(/ri-zil-yent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('1 of 20');
    expect(
      screen.getByText(/try to define the word before revealing it/i),
    ).toBeInTheDocument();
  });

  it('reveals the definition and example sentence', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /show definition/i }));

    expect(
      screen.getByText(/able to recover quickly after difficulty or change/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a resilient learner tries again after a difficult quiz/i),
    ).toBeInTheDocument();
  });

  it('marks a revealed word as known and resets the prompt', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /show definition/i }));
    await user.click(screen.getByRole('button', { name: /mark known/i }));

    expect(screen.getByRole('heading', { name: /curious/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('2 of 20');
    expect(screen.getByText('practice_words_studied')).toBeInTheDocument();
    expect(screen.getByLabelText(/practice statistics/i)).toHaveTextContent(
      'practice_words_studied1',
    );
    expect(screen.getByLabelText(/practice statistics/i)).toHaveTextContent('Known1');
    expect(
      screen.getByText(/try to define the word before revealing it/i),
    ).toBeInTheDocument();
  });

  it('marks a revealed word as needs review and tracks the review count', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /show definition/i }));
    await user.click(screen.getByRole('button', { name: /needs review/i }));

    expect(screen.getByRole('heading', { name: /curious/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/practice statistics/i)).toHaveTextContent(
      'Needs review1',
    );
  });

  it('wraps back to the first word after the final card', async () => {
    const user = userEvent.setup();
    render(<App />);

    for (let count = 0; count < 20; count += 1) {
      await user.click(screen.getByRole('button', { name: /mark known/i }));
    }

    expect(screen.getByRole('heading', { name: /resilient/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/card progress/i)).toHaveTextContent('1 of 20');
  });
});
