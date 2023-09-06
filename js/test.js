class Car {
  constructor(canvas) {
    this.canvas = canvas;
    this.waitingTime = null;
    this.centerX = this.canvas.centerX;
    this.centerY = this.canvas.centerY;
    this.WIDTH = this.canvas.WIDTH;
    this.HEIGHT = this.canvas.HEIGHT;
    this.cornerRadius = this.canvas.cornerRadius;
    this.islandRadius = this.canvas.islandRadius;
    this.CONTROL = this.canvas.CONTROL;
    this.ACTIVE = this.canvas.ACTIVE;
    this.LANE = this.canvas.LANE;
    this.OUTSIDE_VELOCITY = (70 * 2) / (this.LANE * 3.6).toFixed(2);
    this.CONTROL_VELOCITY = (50 * 2) / (this.LANE * 3.6).toFixed(2);
    this.ACTIVE_VELOCITY = (30 * 2) / (this.LANE * 3.6).toFixed(2);
    this.label = this.canvas.carCounter++;
    this.carElement = document.createElement("img");

    [this.width, this.height] = [
      1.5 * this.canvas.LANE,
      0.75 * this.canvas.LANE,
    ];

    this.imageAttribute = "";
    this.imageNumber = Math.floor(Math.random() * 3) + 1;
    this.input = 1;Math.floor(Math.random() * 4) + 1;
    this.output = 3;Math.floor(Math.random() * 4) + 1;
    this.index = this.canvas.carsQueue[this.input].length;
    this.isDeleted = false;
    this.distanceFromCenter = null;
    this.distanceFromFrontToCenter = null;

    this.velocity = this.OUTSIDE_VELOCITY;
    this.direction = 0;
    this.counterAngle = 0;
    this.state = 0;
    this.controlled = false;
    this.isGone = false;
    this.isIn = false;
    if (this.index > 0) {
      this.carAhead = this.canvas.carsQueue[this.input][this.index - 1];
    } else {
      this.carAhead = null;
    }
    this.carInPriority = null;
    this.side = null;
    this.rotateAngle = null;

    this.center = { x: null, y: null };
    this.carAngle = null;
    this.xLever = null;
    this.yLever = null;
    this.radiusLever = null;
    this.leverAngle = null;
    this.cadrans = [];

    let { input } = this;

    for (let i = 1; i <= this.output; i++) {
      this.cadrans.push(input);
      input += 1;
      if (input == 5) {
        input = 1;
      }
    }

    const inputConfigurations = {
      1: {
        centerX: canvas.WIDTH + this.width / 2,
        centerY: canvas.HEIGHT / 2 - canvas.LANE / 2,
        angle: Math.PI,
      },
      2: {
        centerX: canvas.WIDTH / 2 - canvas.LANE / 2,
        centerY: -this.width / 2,
        angle: 1.5 * Math.PI,
      },
      3: {
        centerX: -this.width / 2,
        centerY: canvas.HEIGHT / 2 + canvas.LANE / 2,
        angle: 0,
      },
      4: {
        centerX: canvas.WIDTH / 2 + canvas.LANE / 2,
        centerY: canvas.HEIGHT + this.width / 2,
        angle: Math.PI / 2,
      },
    };

    const config = inputConfigurations[this.input];

    if (config) {
      [this.center.x, this.center.y] = [config.centerX, config.centerY];
      this.carAngle = config.angle;
      [this.signX, this.signY] = [
        Math.cos(this.carAngle),
        Math.sin(-this.carAngle),
      ];
    }

    this.carElement.src = `./images/cars/car${this.imageNumber}${this.imageAttribute}.png`;
    this.carElement.style.width = this.width + "px";
    this.carElement.style.height = this.height + "px";
    this.carElement.style.position = "absolute";
    this.carElement.style.left = this.center.x - this.width / 2 + "px";
    this.carElement.style.top = this.center.y - this.height / 2 + "px";
    this.carElement.style.transform = `rotate(${-this.carAngle}rad)`;
    this.carElement.classList.add(`car${this.label}`);
    document.body.appendChild(this.carElement);

    /*
    this.labelElement = document.createElement("div");
    this.labelElement.innerText = this.label;
    this.labelElement.classList.add(`car${this.label}`);
    this.labelElement.style.position = "absolute";
    this.labelElement.style.left = this.center.x + "px";
    this.labelElement.style.top = this.center.y + "px";
    this.labelElement.style.color = "red";
    this.labelElement.style.fontSize = "20px";
    document.body.appendChild(this.labelElement);*/
  }

  moveCar() {
    if (
      Math.abs(this.center.x - this.centerX) > this.centerX + this.width / 2 ||
      Math.abs(this.center.y - this.centerY) > this.centerY + this.width / 2
    ) {
        this.deleteCar();
    } else {
      this.carElement.style.left = this.center.x - this.width / 2 + "px";
      this.carElement.style.top = this.center.y - this.height / 2 + "px";

      /*
      this.labelElement.style.left = this.center.x + "px";
      this.labelElement.style.top = this.center.y + "px";*/

      if (!this.isGone) {
        this.checkZone();
        /*if (!this.actived) {
          this.checkIfStop();
        }*/
        this.checkIfStop();
        if (this.controlled) {
          this.checkState();
        }
      }
      this.controlCarPosition();
    }
  }

  changeDirection(d, r = null) {
    if (d == 1) {
      this.imageAttribute = "right";
    } else if (d == -1) {
      this.imageAttribute = "left";
    } else {
      this.imageAttribute = "";
    }
    this.carElement.src = `./images/cars/car${this.imageNumber}${this.imageAttribute}.png`;
    [this.counterAngle, this.radiusLever, this.direction] = [0, r, d];
    if (d != 0) {
      this.xLever =
        this.center.x +
        this.direction * Math.sin(this.carAngle) * this.radiusLever;
      this.yLever =
        this.center.y +
        this.direction * Math.cos(this.carAngle) * this.radiusLever;
      this.leverAngle = this.calculateLeverAngle();
    } else {
      this.correctOutput();
    }
  }

  controlCarPosition() {
    if (this.direction == 0) {
      this.center.x += this.velocity * this.signX;
      this.center.y += this.velocity * this.signY;
      this.carElement.style.transform = `rotate(${-this.carAngle}rad)`;
    } else {
      let angularRotation = this.velocity / this.radiusLever;
      if (this.counterAngle + angularRotation > this.rotateAngle) {
        angularRotation = this.rotateAngle - this.counterAngle;
      }
      this.carAngle -= this.direction * angularRotation;
      this.leverAngle -= this.direction * angularRotation;
      this.counterAngle += angularRotation;
      this.center.x =
        this.xLever + this.radiusLever * Math.cos(this.leverAngle);
      this.center.y =
        this.yLever + this.radiusLever * Math.sin(-this.leverAngle);
      this.carElement.style.transform = `rotate(${-this.carAngle}rad)`;
    }
  }

  checkState() {
    if (this.state == 0) {
      this.changeDirection(1, this.cornerRadius);
      if (this.output > 1) {
        this.rotateAngle = Math.PI / 4;
      } else {
        this.rotateAngle = Math.PI / 2;
      }
      this.state = 1;
    } else if (this.output > 1 && this.counterAngle == this.rotateAngle) {
      if (this.state == 1) {
        this.changeDirection(-1, this.islandRadius);
        this.rotateAngle = ((this.output - 1) * Math.PI) / 2;
        this.state = 2;
        this.velocity = this.ACTIVE_VELOCITY;
      } else {
        this.changeDirection(1, this.cornerRadius);
        this.state = 3;
      }
    }
  }

  checkZone() {
    this.distanceFromCenter = calculateDistance(
      this.center.x,
      this.center.y,
      this.centerX,
      this.centerY
    );
    this.distanceFromFrontToCenter = calculateDistance(
      this.center.x + (this.width / 2) * Math.cos(this.carAngle),
      this.center.y + (this.width / 2) * Math.sin(-this.carAngle),
      this.centerX,
      this.centerY
    );

    if (!this.controlled) {
      if (this.distanceFromCenter <= this.CONTROL) {
        this.controlled = true;
        this.velocity = this.CONTROL_VELOCITY;
      }
    } else if (this.distanceFromCenter > this.CONTROL) {
      this.controlled = false;
      this.velocity = (70 * 2) / (this.LANE * 3.6).toFixed(2);
      this.isGone = true;
      this.changeDirection(0);
    }

    if (this.isIn) {
      if (this.distanceFromFrontToCenter > this.ACTIVE + this.width / 4) {
        this.isIn = false;
        this.actived = false;
        const index = this.canvas.activeCars.indexOf(this);
        if (index != -1) {
          this.canvas.activeCars.splice(index, 1);
        }
        this.velocity = this.CONTROL_VELOCITY;
      } else if (this.velocity == 0) {
        this.checkToGo();
        if (this.carInPriority == null) {
          const endTime = new Date();
          let waitingTimeList = localStorage.getItem(`waitingTimeList`);
          if (waitingTimeList == "") {
            waitingTimeList = endTime - this.waitingTime;
          } else {
            waitingTimeList += `,${endTime - this.waitingTime}`;
          }
          localStorage.setItem(`waitingTimeList`, waitingTimeList);
          this.actived = true;//
          this.canvas.activeCars.push(this);
          this.velocity = this.ACTIVE_VELOCITY;
        }
      }
    } else if (this.distanceFromFrontToCenter <= this.ACTIVE + this.width / 4) {
      //this.carAhead = null;
      this.isIn = true;
      this.waitingTime = new Date();
    }
  }

  checkToGo() {
    if (this.carInPriority != null) {
      const thisCadran = this.getCurrentCadran();
      const carCadran = this.carInPriority.getCurrentCadran();
      const carCadrans = this.carInPriority.cadrans;

      const thisIndex = carCadrans.indexOf(thisCadran.cadran);
      const carIndex = carCadrans.indexOf(carCadran.cadran);
      let direction;
      if (carIndex < thisIndex) {
        direction = "left";
      } else if (carIndex > thisIndex) {
        direction = "right";
      } else {
        if (this.carInPriority.state == 3) {
          direction = "right";
        } else if (this.carInPriority.state == 2) {
          if (this.carInPriority.counterAngle <= (carIndex * Math.PI) / 2) {
            direction = "left";
          } else {
            direction = "right";
          }
        }
      }
      if (direction == "right") {
        const thisEstimateDistance =
          (Math.PI / 4 - this.counterAngle) * this.cornerRadius;
        const carEstimateDistance = this.carInPriority.estimateDistance(
          thisIndex,
          direction
        );
        if (thisEstimateDistance + carEstimateDistance >= 1.5 * this.width) {
          this.carInPriority = null;
        }
      }
    }
    if (this.carInPriority == null) {
      this.searchInActive();
    }
  }

  searchInActive() {
    const { activeCars } = this.canvas;
    let foundCar = null;
    for (const car of activeCars) {
      if (car.input != this.input) {
        const thisCadran = this.getCurrentCadran();
        const carCadran = car.getCurrentCadran();
        const carCadrans = car.cadrans;
        if (carCadrans.includes(thisCadran.cadran)) {
          const thisIndex = carCadrans.indexOf(thisCadran.cadran);
          const carIndex = carCadrans.indexOf(carCadran.cadran);
          let direction;
          if (carIndex < thisIndex) {
            direction = "left";
          } else if (carIndex > thisIndex) {
            direction = "right";
          } else {
            if (car.state == 3) {
              direction = "right";
            } else if (car.state == 2) {
              if (car.counterAngle <= (carIndex * Math.PI) / 2) {
                direction = "left";
              } else {
                direction = "right";
              }
            }
          }
          if (direction == "left") {
            const thisEstimateDistance =
              (Math.PI / 4 - this.counterAngle) * this.cornerRadius;
            const carEstimateDistance = car.estimateDistance(
              thisIndex,
              direction
            );
            if (
              thisEstimateDistance >=
              carEstimateDistance - 1.5 * this.width
            ) {
              foundCar = car;
              break;
            }
          }
        }
      }
    }
    this.carInPriority = foundCar;
  }

  checkIfStop() {
    if (this.carAhead != null && this.carInPriority == null) {
      const distanceCarAhead = calculateDistance(
        this.center.x,
        this.center.y,
        this.carAhead.center.x,
        this.carAhead.center.y
      );
      if (distanceCarAhead < 1.5 * this.width) {
        if (this.carAhead.velocity < this.velocity) {
          this.velocity = this.carAhead.velocity;
        }
      } else {
        if (this.controlled) {
          if (!this.isIn) {
            this.velocity = this.CONTROL_VELOCITY;
          }
        } else {
          this.velocity = this.OUTSIDE_VELOCITY;
        }
      }
    }
  }

  deleteCar() {
    removeElementsByClass(`.car${this.label}`);
    removeElementsByClass(`.label${this.label}`);
    this.isDeleted = true;
  }

  getCurrentCadran() {
    const { x, y } = this.center;
    const [originX, originY] = [this.centerX, this.centerY];
    let side = null;
    let cadran = null;
    if (x > originX && y < originY) {
      if (Math.abs(x - originX) >= Math.abs(y - originY)) {
        side = "right";
      } else {
        side = "left";
      }
      cadran = 1;
    } else if (x < originX && y < originY) {
      if (Math.abs(x - originX) <= Math.abs(y - originY)) {
        side = "right";
      } else {
        side = "left";
      }
      cadran = 2;
    } else if (x < originX && y > originY) {
      if (Math.abs(x - originX) >= Math.abs(y - originY)) {
        side = "right";
      } else {
        side = "left";
      }
      cadran = 3;
    } else if (x > originX && y > originY) {
      if (Math.abs(x - originX) <= Math.abs(y - originY)) {
        side = "right";
      } else {
        side = "left";
      }
      cadran = 4;
    }
    return {
      cadran: cadran,
      side: side,
    };
  }

  correctOutput() {
    let output = (this.input + this.output) % 4;
    if (output == 0) {
      output = 4;
    }

    if (output == 1) {
      this.carAngle = 0;
    } else if (output == 2) {
      this.carAngle = Math.PI / 2;
    } else if (output == 3) {
      this.carAngle = Math.PI;
    } else if (output == 4) {
      this.carAngle = 1.5 * Math.PI;
    }
    this.signX = Math.cos(this.carAngle);
    this.signY = Math.sin(-this.carAngle);
  }

  estimateDistance(thisIndex, direction) {
    if (direction == "left") {
      if (this.state == 1) {
        return (
          (Math.PI / 4 - this.counterAngle) * this.cornerRadius +
          ((thisIndex * Math.PI) / 2) * this.islandRadius
        );
      } else {
        return (
          ((Math.PI / 2) * thisIndex - this.counterAngle) * this.islandRadius
        );
      }
    } else {
      if (this.state == 3) {
        return this.counterAngle * this.cornerRadius;
      } else {
        return (
          (this.counterAngle - (Math.PI / 2) * thisIndex) * this.islandRadius
        );
      }
    }
  }

  calculateLeverAngle() {
    const xCar = this.center.x;
    const yCar = this.center.y;
    const xCenter = this.xLever;
    const yCenter = this.yLever;
    if (xCar === xCenter) {
      if (yCar < yCenter) {
        return Math.PI / 2;
      } else {
        return 1.5 * Math.PI;
      }
    } else if (yCar === yCenter) {
      if (xCar < xCenter) {
        return Math.PI;
      } else {
        return 0;
      }
    } else {
      const tan = Math.atan(
        Math.abs(xCar - xCenter) / Math.abs(yCar - yCenter)
      );
      if (xCar < xCenter) {
        if (yCar < yCenter) {
          return Math.PI / 2 + tan;
        } else {
          return Math.PI + tan;
        }
      } else if (yCar < yCenter) {
        return tan;
      } else {
        return 1.5 * Math.PI + tan;
      }
    }
  }
}
