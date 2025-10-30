import QuestionCard from '../QuestionCard';

const sampleQuestion = {
  id: 'q2',
  chapter: 'past',
  text: 'Growing up, how often did you feel truly heard by your caregivers?',
  type: 'radio' as const,
  options: [
    { value: 'always', label: 'Almost always' },
    { value: 'often', label: 'Often' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'never', label: 'Almost never' },
  ],
};

export default function QuestionCardExample() {
  return (
    <QuestionCard
      question={sampleQuestion}
      chapterTitle="Your Past"
      onAnswer={(answer) => console.log('Answer selected:', answer)}
      onPrevious={() => console.log('Previous clicked')}
      onNext={() => console.log('Next clicked')}
      savedAnswer={[]}
      canGoBack={true}
      isLastQuestion={false}
    />
  );
}
