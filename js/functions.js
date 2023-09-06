function customAlert(title, text, icon) {
  try {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "OK",
    });
  } catch (error) {
    alert(text);
  }
}

function getRandomFrequency() {
  const minFrequency = 300;
  const maxFrequency = 1000;
  const frequencyStep = 100;
  const randomSteps = Math.floor(
    Math.random() * ((maxFrequency - minFrequency) / frequencyStep + 1)
  );
  return minFrequency + randomSteps * frequencyStep;
}

function calculateDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function removeElementsByClass(className) {
  const elements = document.querySelectorAll(className);
  Array.from(elements).forEach((element) => {
    element.remove();
  });
}

function playSound() {
  const audio = document.getElementById("horn");
  audio.play();
}

function getRandomInterval(minInterval, maxInterval) {
  return Math.random() * (maxInterval - minInterval) + minInterval;
}
