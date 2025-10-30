import EmpathyMessage from '../EmpathyMessage';

export default function EmpathyMessageExample() {
  return (
    <EmpathyMessage
      message="This awareness is the first step toward healing."
      onContinue={() => console.log('Continue clicked')}
    />
  );
}
