class Canvas {
  constructor() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.play = false;

    this.canvas = document.getElementById("controllerCanvas");
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx = this.canvas.getContext("2d");

    const islandSize = parseFloat(localStorage.getItem("islandSize"));
    const laneSize = parseFloat(localStorage.getItem("laneSize"));

    this.LANE = laneSize || this.HEIGHT / 30;
    this.ISLAND = islandSize || this.HEIGHT / 15;

    const [minLaneSize, maxLaneSize] = [
      (Math.min(this.WIDTH, this.HEIGHT) / 40).toFixed(0),
      (Math.min(this.WIDTH, this.HEIGHT) / 30).toFixed(0),
    ];
    const [minIslandSize, maxIslandSize] = [
      4,
      (
        (2 / this.LANE) *
        ((3 * Math.min(this.WIDTH, this.HEIGHT)) / (8 * (1 + Math.sqrt(2))))
      ).toFixed(2),
    ];

    this.controllersContainer = document.createElement("div");
    this.controllersContainer.classList.add("controllersContainer");
    this.laneContainer = document.createElement("div");
    this.islandContainer = document.createElement("div");
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.classList.add("buttonsContainer");

    this.playButton = document.createElement("button");
    this.playButton.classList.add("playButton");

    this.statsButton = document.createElement("button");
    this.statsButton.classList.add("statsButton");

    this.playImage = document.createElement("img");
    this.playImage.src = "./images/buttons/play.png";
    this.playImage.width = "50";
    this.playImage.height = "50";

    this.statsImage = document.createElement("img");
    this.statsImage.src = "./images/buttons/statistics.png";
    this.statsImage.width = "50";
    this.statsImage.height = "50";

    this.playButton.appendChild(this.playImage);
    this.statsButton.appendChild(this.statsImage);

    this.buttonsContainer.appendChild(this.playButton);
    this.buttonsContainer.appendChild(this.statsButton);

    this.laneInput = document.createElement("input");
    this.laneInput.classList.add("laneInput");
    this.laneInput.placeholder = `Lane width: ${this.LANE} px ≈ 2m([${minLaneSize}, ${maxLaneSize}] px)`;
    this.laneInput.type = "number";
    this.laneInput.min = "0";

    this.laneButton = document.createElement("button");
    this.laneButton.textContent = "Change";
    this.laneButton.classList.add("laneButton");

    this.laneContainer.appendChild(this.laneInput);
    this.laneContainer.appendChild(this.laneButton);

    this.islandInput = document.createElement("input");
    this.islandInput.classList.add("islandInput");
    this.islandInput.placeholder = `Island radius: ${(
      (2 * this.ISLAND) /
      this.LANE
    ).toFixed(2)}m([${minIslandSize}, ${maxIslandSize}] m)`;
    this.islandInput.type = "number";

    this.islandButton = document.createElement("button");
    this.islandButton.textContent = "Change";
    this.islandButton.classList.add("islandButton");

    this.islandContainer.appendChild(this.islandInput);
    this.islandContainer.appendChild(this.islandButton);

    this.inputContainer = document.createElement("div");
    this.inputContainer.appendChild(this.laneContainer);
    this.inputContainer.appendChild(this.islandContainer);

    this.controllersContainer.appendChild(this.buttonsContainer);
    this.controllersContainer.appendChild(this.inputContainer);

    document.body.appendChild(this.controllersContainer);

    this.playButton.addEventListener("click", () => {
      if (!this.play) {
        localStorage.setItem("waitingTimeList", "");
        localStorage.setItem("crowdingList", "");
        localStorage.setItem("carsComing1", "");
        localStorage.setItem("carsComing2", "");
        localStorage.setItem("carsComing3", "");
        localStorage.setItem("carsComing4", "");
        this.playImage.src = "./images/buttons/pause.png";
      } else {
        location.reload();
      }
      this.play = !this.play;
    });

    this.statsButton.addEventListener("click", () => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace("controller.html", "statistics.html");
      window.location.href = newUrl;
    });

    this.laneButton.addEventListener("click", () => {
      const laneInputSize = parseInt(this.laneInput.value);
      if (!laneInputSize) {
        customAlert("Error", "Lane width can't be empty", "error");
      } else if (laneInputSize > maxLaneSize) {
        customAlert(
          "Warning",
          `Maximum lane width is ${maxLaneSize}`,
          "warning"
        );
      } else if (laneInputSize < minLaneSize) {
        customAlert(
          "Warning",
          `Minimum lane width is ${minLaneSize}`,
          "warning"
        );
      } else {
        const returnFunction = customAlert(
          "Success",
          "Lane size updated",
          "success"
        );
        if (returnFunction) {
          returnFunction.then(() => {
            localStorage.setItem("laneSize", laneInputSize);
            location.reload();
          });
        } else {
          localStorage.setItem("laneSize", laneInputSize);
          location.reload();
        }
      }
    });

    this.islandButton.addEventListener("click", () => {
      const islandInputSize = parseFloat(this.islandInput.value);
      if (!islandInputSize) {
        customAlert("Error", "Island radius can't be empty", "error");
      } else if (islandInputSize < minIslandSize) {
        customAlert(
          "Warning",
          `Minimum island radius is ${minIslandSize}`,
          "warning"
        );
      } else if (islandInputSize > maxIslandSize) {
        customAlert(
          "Warning",
          `Maximum island radius is ${maxIslandSize}`,
          "warning"
        );
      } else {
        const returnFunction = customAlert(
          "Success",
          "Island radius updated",
          "success"
        );
        if (returnFunction) {
          returnFunction.then(() => {
            localStorage.setItem(
              "islandSize",
              (islandInputSize * this.LANE) / 2
            );
            location.reload();
          });
        } else {
          localStorage.setItem("islandSize", (islandInputSize * this.LANE) / 2);
          location.reload();
        }
      }
    });

    this.CONTROL = this.ISLAND * (Math.sqrt(2) + 1);
    this.ACTIVE = this.ISLAND + this.LANE;
    this.NUMBER = 0;

    // Calculate the distance from the center of the canvas to the first lane out of island
    this.islandRadius = this.ISLAND + 0.5 * this.LANE;

    // Calculate the distance from the intersection corners to the first lane out of island
    this.cornerRadius = this.ISLAND * (Math.sqrt(2) + 1) - 0.5 * this.LANE;

    [this.centerX, this.centerY] = [this.WIDTH / 2, this.HEIGHT / 2];
    // Set velocity of car and counter
    this.carCounter = 0;

    this.canvasInfo = {
      ctx: this.ctx,
      WIDTH: this.WIDTH,
      HEIGHT: this.HEIGHT,
      LANE: this.LANE,
      ISLAND: this.ISLAND,
      r: this.islandRadius,
      R: this.cornerRadius,
      centerX: this.centerX,
      centerY: this.centerY,
    };

    this.carsQueue = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    this.activeCars = [];

    this.cadransValues = [
      [-1, -1, 0, Math.PI / 2],
      [1, -1, Math.PI / 2, Math.PI],
      [-1, 1, 1.5 * Math.PI, 2 * Math.PI],
      [1, 1, Math.PI, 1.5 * Math.PI],
    ];

    this.circlesValues = [
      {
        color: "blue",
        radius: this.CONTROL,
        fill: false,
        dash: false,
      },
      {
        color: "red",
        radius: this.ACTIVE,
        fill: false,
        dash: false,
      },
      {
        color: "gray",
        radius: this.ISLAND + this.LANE,
        fill: true,
        dash: false,
      },
      {
        color: "black",
        radius: this.ISLAND - this.NUMBER * this.LANE,
        fill: true,
        dash: false,
      },
    ];

    for (let i = 0; i < this.NUMBER; i++) {
      this.circlesValues.push({
        color: "white",
        radius: this.ISLAND - i * this.LANE,
        fill: false,
        dash: true,
      });
    }

    this.activeCarsCounter = 0;
    this.waitingTimeActive;
    this.activeCarsElement = document.createElement("span");
    this.activeCarsElement.textContent = "0";
    this.activeCarsElement.style.color = "white";
    this.activeCarsElement.style.fontSize = this.ISLAND / 2 + "px";
    this.activeCarsElement.style.pointerEvents = "none";
    this.activeCarsElement.style.position = "absolute";
    this.activeCarsElement.style.top = "50%";
    this.activeCarsElement.style.left = "50%";
    this.activeCarsElement.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(this.activeCarsElement);
  }

  draw() {
    drawRoads(this.canvasInfo);
    drawCornerArc(this.canvasInfo, this.cadransValues);
    drawDashLines(this.canvasInfo);
    drawIslands(this.canvasInfo, this.cadransValues);
    drawCircles(this.canvasInfo, this.circlesValues);
    drawPath(this.canvasInfo);
  }

  move() {
    if (this.activeCars.length != this.activeCarsCounter) {
      this.activeCarsCounter = this.activeCars.length;
      let crowdingList = localStorage.getItem("crowdingList");
      if (crowdingList == "") {
        crowdingList = `${this.activeCarsCounter},0`;
        this.waitingTimeActive = new Date();
      } else {
        const endTimeActive = new Date();
        crowdingList += ` ${this.activeCarsCounter},${
          endTimeActive - this.waitingTimeActive
        }`;
        this.waitingTimeActive = endTimeActive;
      }
      localStorage.setItem("crowdingList", crowdingList);
      this.activeCarsElement.textContent = this.activeCarsCounter;
    }
    for (const input in this.carsQueue) {
      const carsToRemove = [];
      this.carsQueue[input].forEach((car) => {
        if (car.isDeleted) {
          carsToRemove.push(car);
        } else {
          car.moveCar();
        }
      });
      for (const carToRemove of carsToRemove) {
        const index = this.carsQueue[input].indexOf(carToRemove);
        this.carsQueue[input].splice(index, 1);
      }
    }
    requestAnimationFrame(this.move.bind(this));
  }
}
