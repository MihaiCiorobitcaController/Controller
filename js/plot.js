document.addEventListener("DOMContentLoaded", function () {
  const  homeButton = document.createElement("button");
  homeButton.style.backgroundColor = "transparent";
  homeButton.style.border = "none";
  homeButton.style.width = "70px";
  homeButton.style.height = "70px";
  homeButton.style.marginRight = "10px";
  homeButton.style.marginBottom = "10px";
  homeButton.style.cursor = "pointer";

  const homeImage = document.createElement("img");
  homeImage.src = "./images/buttons/home.png";
  homeImage.width = "50";
  homeImage.height = "50";
  homeImage.alt = "Home Icon";

  homeButton.appendChild(homeImage);
  homeButton.addEventListener("click", function () {
    const currentUrl = window.location.href;
    window.location.href = currentUrl.replace("statistics", "controller");
  });

  const homeContainer = document.querySelector(".homeContainer");
  homeContainer.appendChild(homeButton);

  const carsComing1 = parseInt(localStorage.getItem("carsComing1"));
  const carsComing2 = parseInt(localStorage.getItem("carsComing2"));
  const carsComing3 = parseInt(localStorage.getItem("carsComing3"));
  const carsComing4 = parseInt(localStorage.getItem("carsComing4"));
  const carsComingList = [carsComing1, carsComing2, carsComing3, carsComing4];
  const totalSum = carsComingList.reduce((sum, value) => sum + value, 0);
  const percentages = carsComingList.map(
    (value, index) =>
      `Lane${index + 1} ${((value / totalSum) * 100).toFixed(0)}%`
  );

  let crowdingList = localStorage.getItem("crowdingList");
  crowdingList = crowdingList.split(" ");
  for (let i = 0; i < crowdingList.length; i++) {
    crowdingList[i] = crowdingList[i].split(",");
    crowdingList[i][0] = parseInt(crowdingList[i][0]);
    crowdingList[i][1] = parseInt(crowdingList[i][1]);
    if (i > 0) {
      crowdingList[i][1] += crowdingList[i - 1][1];
    }
  }

  const xCrowding = crowdingList.map((point) => parseInt(point[1]));
  const yCrowding = crowdingList.map((point) => parseInt(point[0]));
  const crowdMean =
    yCrowding.reduce((sum, value) => sum + value, 0) / yCrowding.length;
  const islandSize = parseFloat(localStorage.getItem('islandSize'));
  const laneSize = parseFloat(localStorage.getItem('laneSize'));
  const maxCrowd = Math.floor((8*Math.PI/(9*laneSize)*(islandSize+laneSize/2)));

  const waitingTimeList = localStorage.getItem("waitingTimeList");

  if (waitingTimeList != null) {
    let waitingData = waitingTimeList.split(",").map((time) => +time);
    waitingData = waitingData.map((value) => Math.round(value / 1000));
    const frequencyMap = new Map();
    waitingData.forEach((time) => {
      if (frequencyMap.has(time)) {
        frequencyMap.set(time, frequencyMap.get(time) + 1);
      } else {
        frequencyMap.set(time, 1);
      }
    });

    const waitingMean =
      waitingData.reduce((sum, value) => sum + value, 0) / waitingData.length;
    const waitingSize = waitingData.length;

    const canvas1 = document.getElementById("waitingTimeChart");
    const canvas2 = document.getElementById("crowdingChart");
    const canvas3 = document.getElementById("lanesChart");

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    const ctx3 = canvas3.getContext("2d");

    const waitingTimeChart = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: Array.from(frequencyMap.keys()),
        datasets: [
          {
            label: "Number of cars",
            data: Array.from(frequencyMap.values()),
            backgroundColor: "rgba(70, 192, 192, 1)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: [
              "Waiting time",
              `Average: ${waitingMean.toFixed(
                2
              )}s | Sample size: ${waitingSize}`,
            ],
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Waiting Time[s]",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of cars",
            },
          },
        },
      },
    });

    const crowdingChart = new Chart(ctx2, {
      type: "line",
      data: {
        labels: xCrowding,
        datasets: [
          {
            label: "Number of cars",
            data: yCrowding,
            backgroundColor: "rgba(70, 192, 192, 1)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: ["Crowding", `Average: ${crowdMean.toFixed(2)} | Maximum: ${maxCrowd}`],
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "Time[ms]",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of cars",
            },
          },
        },
      },
    });

    const lanesChart = new Chart(ctx3, {
      type: "pie",
      data: {
        labels: percentages,
        datasets: [
          {
            data: [carsComing1, carsComing2, carsComing3, carsComing4],
            backgroundColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "bottom",
        },
        plugins: {
          title: {
            display: true,
            text: "Lanes traffic",
            font: {
              size: 16,
            },
          },
        },
      },
    });

    /*
    const histogramChart4 = new Chart(ctx4, {
      type: "bar",
      data: {
        labels: Array.from(frequencyMap.keys()),
        datasets: [
          {
            label: "Number of cars",
            data: Array.from(frequencyMap.values()),
            backgroundColor: "rgba(70, 192, 192, 1)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Histogram4",
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Waiting Time[ms]",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of cars",
            },
          },
        },
      },
    });*/
  }
});
