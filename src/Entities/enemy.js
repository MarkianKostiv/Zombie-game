import Matter from "matter-js";
// Клас ворога
export class Enemy {
  constructor(x, y, width, height) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      label: "enemy",
      isStatic: true,
    });
    this.hp = 100;
  }

  // Метод для завдання урону
  takeDamage(damage) {
    this.hp -= damage;
  }
}
