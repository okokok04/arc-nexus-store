/**
 * TransactionStepper — visual progress indicator for multi-phase transactions.
 * Addresses user feedback: "Show a progress bar so we know how many steps are left"
 * and "Clearer confirmation messages after completing a task."
 */

const STEPS = [
  { key: 'simulating', label: 'Simulate' },
  { key: 'preparing', label: 'Prepare' },
  { key: 'awaiting-signature', label: 'Sign' },
  { key: 'submitting', label: 'Submit' },
  { key: 'confirming', label: 'Confirm' },
];

const STEP_INDEX = Object.fromEntries(STEPS.map((s, i) => [s.key, i]));

export default function TransactionStepper({ phase }) {
  const activeIdx = STEP_INDEX[phase] ?? -1;

  if (activeIdx < 0) return null;

  return (
    <div className="tx-stepper" role="progressbar" aria-label="Transaction progress">
      {STEPS.map((step, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <span key={step.key} style={{ display: 'contents' }}>
            <div
              className={`tx-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              <span className="tx-step-dot">
                {isDone ? '✓' : i + 1}
              </span>
              <span className="tx-step-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`tx-step-connector ${isDone ? 'done' : ''}`} />
            )}
          </span>
        );
      })}
    </div>
  );
}
