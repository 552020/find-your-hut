const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(array = []) {
    this.field = array;
    this.playerPosition = {
      x: 0,
      y: 0,
    };
    this.hatPosition = {
      x: 0,
      y: 0,
    };

    this.holes = [{ x: 0, y: 0 }];
  }

  // Static Methods

  static play() {
    let firstChoice = prompt(
      "If you already know how to play, enter 'p' \r\nIf you don't know how to play, enter 'h'\r\nMake your choice now: "
    );
    if (firstChoice === "h") {
      console.log(
        "You are the asterisk (*) and you've to find your way to the hat (^), moving to the right (r), left (l), up (u) or down (d). Watch the holes!"
      );
    } else {
      console.log("Let's play");
    }
  }

  static greet() {
    console.log("Hello User!");
    this.play();
  }

  static generateField(width = 3, height = 3, holesPercentage = 25) {
    // this.field = [
    //   ["*", "░", "O"],
    //   ["░", "O", "░"],
    //   ["^", "░", "░"],
    // ];

    this.field = [];

    //Generate Height
    for (let i = 0; i < height; i++) {
      let newArray = [];
      // Generate Width
      for (let j = 0; j < width; j++) {
        newArray.push(fieldCharacter);
      }
      this.field.push(newArray);
    }
    console.log(this.field);

    // Player Initial Position
    const randomNum = Math.floor(Math.random() * (width * height));
    const numberY = parseInt(randomNum / width);
    const numberX = parseInt(randomNum % width);
    console.log(randomNum);
    console.log(numberY);
    console.log(numberX);

    this.field[numberY][numberX] = pathCharacter;

    // Hat Initial Position

    let randomNumHat = Math.floor(Math.random() * (width * height));
    while (randomNumHat === randomNum) {
      randomNumHat = Math.floor(Math.random() * (width * height));
    }
    const numberYHat = parseInt(randomNumHat / width);
    const numberXHat = parseInt(randomNumHat % width);
    console.log(randomNumHat);
    console.log(numberYHat);
    console.log(numberXHat);

    this.field[numberYHat][numberXHat] = hat;

    //// Holes
    // Number of Holes
    const numberOfHoles = parseInt(width * height * (holesPercentage / 100));
    console.log(`Number of Holes: ${numberOfHoles}`);
    // Holes - Initial position
    const holesPositionArray = [];
    for (let i = 0; i < numberOfHoles; i++) {
      let randomNumHole = Math.floor(Math.random() * (width * height));
      if (holesPositionArray.length > 0) {
        const testArray = [...holesPositionArray, randomNum, randomNumHat];
        console.log("testArray " + testArray);
        while (testArray.some((el) => el === randomNumHole)) {
          randomNumHole = Math.floor(Math.random() * (width * height));
        }
      }
      holesPositionArray.push(randomNumHole);
    }
    for (let i = 0; i < holesPositionArray.length; i++) {
      const numberYHole = parseInt(holesPositionArray[i] / width);
      const numberXHole = parseInt(holesPositionArray[i] % width);
      this.field[numberYHole][numberXHole] = hole;
    }

    // Check

    console.log(this.field);
    console.log(this.field.join(""));

    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
    //   }
  }

  // Methods

  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  getPositions() {
    // determines the position of the player on the map
    // loop throguh the field and determines the position of the player (*)
    // y is determined by the index of * in the nested array
    // x is determined by the index of the array containing *
    const getPlayerPosition = () => {
      for (let i = 0; i < this.field.length; i++) {
        for (let j = 0; j < this.field[i].length; j++) {
          if (this.field[i][j] === pathCharacter) {
            this.playerPosition.x = j;
            this.playerPosition.y = i;
          }
        }
      }
    };

    const getHatPosition = () => {
      for (let i = 0; i < this.field.length; i++) {
        for (let j = 0; j < this.field[i].length; j++) {
          if (this.field[i][j] === hat) {
            this.hatPosition.x = j;
            this.hatPosition.y = i;
          }
        }
      }
    };

    const getHolesPosition = () => {
      this.holes = [];
      for (let i = 0; i < this.field.length; i++) {
        for (let j = 0; j < this.field[i].length; j++) {
          if (this.field[i][j] === hole) {
            this.holes.push({ x: j, y: i });
          }
        }
      }
      console.log(`Holes position: ${this.holes}`);
    };

    getPlayerPosition();
    getHatPosition();
    getHolesPosition();

    console.log(
      `Player Position: x = ${this.playerPosition.x}, y = ${this.playerPosition.y}`
    );
    console.log(
      `Hat Position: x = ${this.hatPosition.x}, y = ${this.hatPosition.y}`
    );
  }

  move(direction) {
    const playerPosX = this.playerPosition.x;
    const playerPosY = this.playerPosition.y;
    const hatPosX = this.hatPosition.x;
    const hatPosY = this.hatPosition.y;
    const holes = this.holes;

    const checkHoles = (direction) => {
      const holesStringArray = [];
      for (let i = 0; i < holes.length; i++) {
        let holeString =
          this.holes[i].x.toString() + this.holes[i].y.toString();
        holesStringArray.push(holeString);
      }

      let checkHolesPlayerPosX = playerPosX;
      let checkHolesPlayerPosY = playerPosY;

      if (direction === "l") {
        checkHolesPlayerPosX -= 1;
      }
      if (direction === "r") {
        checkHolesPlayerPosX += 1;
      }
      if (direction === "u") {
        checkHolesPlayerPosY -= 1;
      }
      if (direction === "d") {
        checkHolesPlayerPosY += 1;
      }

      const playerPosString =
        checkHolesPlayerPosX.toString() + checkHolesPlayerPosY.toString();
      for (let i = 0; i < holesStringArray.length; i++) {
        if (playerPosString === holesStringArray[i]) {
          console.log("Oh no! You fell in a hole!");
          gameIsOn = false;
          return;
        }
      }
    };
    const checkWin = (direction) => {
      if (direction === "l") {
        if ((playerPosY === hatPosY) & (playerPosX - 1 === hatPosX)) {
          console.log("You found the hat! ");
          gameIsOn = false;
          return;
        }
      }

      if (direction === "r") {
        if ((playerPosY === hatPosY) & (playerPosX + 1 === hatPosX)) {
          console.log("You found the hat! ");
          gameIsOn = false;
          return;
        }
      }

      if (direction === "u") {
        if ((playerPosX === hatPosX) & (playerPosY - 1 === hatPosY)) {
          console.log("You found the hat! ");
          gameIsOn = false;
          return;
        }
      }

      if (direction === "d") {
        if ((playerPosX === hatPosX) & (playerPosY + 1 === hatPosY)) {
          console.log("You found the hat! ");
          gameIsOn = false;
          return;
        }
      }
    };

    const checkBorder = (direction) => {
      //   console.log("Hallo from the checkBorder function!");
      let errorMessage = "You went out of the border!";

      if ((playerPosX === 0) & (direction === "l")) {
        console.log(errorMessage);
        gameIsOn = false;
        return;
      }

      if ((playerPosY === 0) & (direction === "u")) {
        console.log(errorMessage);
        gameIsOn = false;
        return;
      }

      if (
        (playerPosX === this.field[playerPosY].length - 1) &
        (direction === "r")
      ) {
        console.log(errorMessage);
        gameIsOn = false;
        return;
      }

      if ((playerPosY === this.field.length - 1) & (direction === "d")) {
        console.log(errorMessage);
        gameIsOn = false;
        return;
      }
    };

    const step = (direction) => {
      if (direction === "r") {
        fieldInstance.field[playerPosY][playerPosX + 1] = pathCharacter;
        fieldInstance.field[playerPosY][playerPosX] = fieldCharacter;
      }
      if (direction === "l") {
        fieldInstance.field[playerPosY][playerPosX - 1] = pathCharacter;
        fieldInstance.field[playerPosY][playerPosX] = fieldCharacter;
      }
      if (direction === "u") {
        fieldInstance.field[playerPosY - 1][playerPosX] = pathCharacter;
        fieldInstance.field[playerPosY][playerPosX] = fieldCharacter;
      }
      if (direction === "d") {
        fieldInstance.field[playerPosY + 1][playerPosX] = pathCharacter;
        fieldInstance.field[playerPosY][playerPosX] = fieldCharacter;
      }

      fieldInstance.print();
    };

    checkBorder(direction);
    checkWin(direction);
    checkHoles(direction);
    if (!gameIsOn) {
      return;
    }
    step(direction);
  }
}

const fieldInstance = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["^", "░", "░"],
]);
Field.generateField(6, 6);
Field.greet();
console.log("This is the map with you starting position.");
fieldInstance.print();

let gameIsOn = true;

while (gameIsOn) {
  //   console.log("***START***");
  fieldInstance.getPositions();

  let selectedDirection = prompt(
    "Enter the direction you want to move [u - up / d - down / r - right / l - left]: "
  );

  fieldInstance.move(selectedDirection);
  //   console.log("***END***");
}
