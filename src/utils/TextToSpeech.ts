export default function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support text-to-speech.");
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

  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, speechSynthesis.speaking ? 200 : 0);
}