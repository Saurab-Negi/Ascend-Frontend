export default function speak(text: string, onStart?: () => void, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support text-to-speech.");
    onEnd?.();
    return;
  }

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  const handleEnd = () => {
    onEnd?.();
    utterance.onend = null;
    utterance.onerror = null;
  };

  utterance.onend = handleEnd;
  utterance.onerror = handleEnd;

  setTimeout(() => {
    onStart?.();
    speechSynthesis.speak(utterance);
  }, speechSynthesis.speaking ? 200 : 0);
}