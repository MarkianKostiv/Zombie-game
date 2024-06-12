import React, { useRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { Player } from "../Entities/player";
import { Enemy } from "../Entities/enemy";
import { PlayerHp } from "./PlayerHp";

export const Game = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(
    Matter.Engine.create({
      gravity: { x: 0, y: 0 },
    })
  );
  const playerRef = useRef(new Player(400, 300, 50, 50));
  const enemyRef = useRef(new Enemy(300, 200, 40, 40));
  const [score, setScore] = useState(0);
  const [keysPressed, setKeysPressed] = useState({});
  const bulletsRef = useRef([]);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const moveSpeed = 3;

  useEffect(() => {
    const { Engine, Render, World, Events, Runner } = Matter;

    const engine = engineRef.current;
    const player = playerRef.current;
    const enemy = enemyRef.current;

    const playerColor = "#00FF00"; // Зелений колір для гравця
    const enemyColor = "#FF0000"; // Червоний колір для ворога

    player.body.render = {
      ...player.body.render,
      fillStyle: playerColor,
    };

    enemy.body.render = {
      ...enemy.body.render,
      fillStyle: enemyColor,
    };

    // Renderer
    const render = Render.create({
      element: canvasRef.current.parentNode,
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false,
      },
    });

    // Add bodies to the world
    World.add(engine.world, [player.body, enemy.body]);

    // Mouse rotation
    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = mouseX - player.body.position.x;
      const dy = mouseY - player.body.position.y;
      player.rotate(Math.atan2(dy, dx));
    };

    // Movement
    const handleKeyDown = (e) => {
      console.log("Key down:", e.code);
      setKeysPressed((prev) => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e) => {
      console.log("Key up:", e.code);
      setKeysPressed((prev) => ({ ...prev, [e.code]: false }));
    };

    // Shooting
    const handleMouseClick = () => {
      player.shoot(engine.world, bulletsRef);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Game loop
    const updateGame = () => {
      let velocity = { x: 0, y: 0 };

      if (keysPressed["KeyW"]) {
        velocity.y -= moveSpeed;
      }
      if (keysPressed["KeyS"]) {
        velocity.y += moveSpeed;
      }
      if (keysPressed["KeyD"]) {
        velocity.x += moveSpeed;
      }
      if (keysPressed["KeyA"]) {
        velocity.x -= moveSpeed;
      }

      // Ensure the player moves only if there's an input
      if (velocity.x !== 0 || velocity.y !== 0) {
        console.log("Calculated velocity:", velocity);
        player.move(velocity);
      } else {
        Matter.Body.setVelocity(player.body, { x: 0, y: 0 });
      }

      // Keep player within bounds
      const playerBounds = player.body.bounds;
      if (playerBounds.min.x < 0) {
        Matter.Body.setPosition(player.body, {
          x: 50,
          y: player.body.position.y,
        });
      }
      if (playerBounds.max.x > canvasWidth) {
        Matter.Body.setPosition(player.body, {
          x: canvasWidth - 50,
          y: player.body.position.y,
        });
      }
      if (playerBounds.min.y < 0) {
        Matter.Body.setPosition(player.body, {
          x: player.body.position.x,
          y: 50,
        });
      }
      if (playerBounds.max.y > canvasHeight) {
        Matter.Body.setPosition(player.body, {
          x: player.body.position.x,
          y: canvasHeight - 50,
        });
      }
    };

    Events.on(engine, "beforeUpdate", updateGame);

    // Check collision between bullets and enemies
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (
          (bodyA.label === "bullet" && bodyB.label === "enemy") ||
          (bodyA.label === "enemy" && bodyB.label === "bullet")
        ) {
          const bullet = bodyA.label === "bullet" ? bodyA : bodyB;
          const enemyBody = bodyA.label === "enemy" ? bodyA : bodyB;
          const enemy = enemyRef.current;

          if (enemy.body === enemyBody) {
            enemy.takeDamage(bullet.damage);
            World.remove(engine.world, bullet);
            bulletsRef.current = bulletsRef.current.filter((b) => b !== bullet);

            if (enemy.hp <= 0) {
              setScore((prevScore) => prevScore + 1);
              World.remove(engine.world, enemyBody);
              resetEnemy();
            }
          }
        }
      });
    });

    const resetEnemy = () => {
      const newEnemy = new Enemy(
        Math.random() * (canvasWidth - 40),
        Math.random() * (canvasHeight - 40),
        40,
        40
      );
      enemyRef.current = newEnemy;
      World.add(engine.world, newEnemy.body);
    };

    // Using Runner to run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Runner.stop(runner);
      Events.off(engine, "beforeUpdate", updateGame);
    };
  }, [keysPressed]);

  return (
    <div style={{ textAlign: "center" }}>
      <div>Score: {score}</div>
      <div style={{ display: "inline-block", position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black" }}
        ></canvas>
        <audio src=''></audio>
      </div>
      <PlayerHp hp={playerRef.current.hp} />
    </div>
  );
};
