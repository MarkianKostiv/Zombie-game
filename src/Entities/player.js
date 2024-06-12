import Matter from "matter-js";
import gunShot from "../assets/audio/base_gunshot.mp3";

export class Player {
  constructor(x, y, width, height) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      label: "player",
    });
    this.hp = 100;
    this.rotation = 0;
    this.bulletDamage = 45;
    this.shootSound = new Audio(gunShot);
  }

  // Метод для руху гравця
  move(velocity) {
    console.log("Player.move called with velocity:", velocity);
    Matter.Body.setVelocity(this.body, velocity);
  }

  // Метод для обертання гравця
  rotate(angle) {
    this.rotation = angle;
    Matter.Body.setAngle(this.body, angle);
  }

  // Метод для стрільби
  shoot(world, bulletsRef) {
    const bullet = Matter.Bodies.circle(
      this.body.position.x,
      this.body.position.y,
      6,
      {
        label: "bullet",
        isSensor: true,
      }
    );
    bullet.damage = this.bulletDamage;
    const forceMagnitude = 30;

    Matter.Body.setVelocity(bullet, {
      x: forceMagnitude * Math.cos(this.rotation),
      y: forceMagnitude * Math.sin(this.rotation),
    });

    Matter.World.add(world, bullet);
    bulletsRef.current.push(bullet);

    // Програвання звуку пострілу
    this.shootSound.currentTime = 0;
    this.shootSound.play();
  }
}
