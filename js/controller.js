function scheduleNext(canvas) {
  const minFrequency = 500;
  const maxFrequency = 2000;
  const frequencyStep = 100;
  const randomSteps = Math.floor(
    Math.random() * ((maxFrequency - minFrequency) / frequencyStep + 1)
  );
  const randomFrequency = minFrequency + randomSteps * frequencyStep;
  setTimeout(generator(canvas), randomFrequency);
}

window.onload = function () {
  const canvas = new Canvas();
  canvas.draw();
  canvas.move();

  document.addEventListener("keydown", (event) => {
    const { key } = event;
    let velocity;
    if (key === "p" || key === "P") {
      const car = new Car(canvas);
      canvas.carsQueue[car.input].push(car);
      velocity = car.velocity;
    }
    if (key === "s" || key === "S") {
      alert(canvas.carsQueue[1][0].velocity)
      if (canvas.carsQueue[1][0].velocity == 0) {
        canvas.carsQueue[1][0].velocity = velocity;
      } else {
        canvas.carsQueue[1][0].velocity = 0;
      }
    }
  });
  function interval() {
    if (canvas.play) {
      let car = new Car(canvas);
      let carsControl = localStorage.getItem(`carsComing${car.input}`);
      if (carsControl === "") {
        carsControl = 0;
      }
      localStorage.setItem(`carsComing${car.input}`, parseInt(carsControl) + 1);
      let carsQueue = canvas.carsQueue[car.input];
      if (carsQueue.length > 0) {
        if (carsQueue[carsQueue.length - 1].velocity > 0) {
          carsQueue.push(car);
        } else {
          car = null;
        }
      } else {
        carsQueue.push(car);
      }
    }
    setTimeout(interval, getRandomFrequency());
  }
  interval();
};
