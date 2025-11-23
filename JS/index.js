/* Author: Emad Riyaz Ahamed */

"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // Initializing canvas
    let canvas = document.getElementById('robot-canvas');
    let ctx = canvas.getContext('2d');

    // Event listener for the power button
    document.getElementById('power-button').addEventListener('click', () => {

        // toggles the power on and off and updates the power indicator and eyes
        if (robot.actions <= 0) return;
        robot.poweredOn = !robot.poweredOn;
        drawPowerIndicator();
        drawEyes();
    });

    // Event listener for the charge button
    document.getElementById('charge-button').addEventListener('click', () => {

        // draw a charging cable and charge the robot for 3 seconds updating the battery level and removing the cable
        if (robot.charging) return;
        robot.charging = !robot.charging;
        drawChargingCable();
        setTimeout(() => {
            robot.actions = 3;
            robot.charging = !robot.charging;
            updateBattery();
            ctx.clearRect(robot.x - 5, robot.y + 60, 125, 90);
            drawRobot();
        }, 3000);
    });

    // Function to update the battery level display
    function updateBattery() {

        // update the battery level display based on the number of actions left
        document.getElementById('actions-left').textContent = robot.actions;
        let batteryLevel = document.querySelector('#battery-level');

        switch (robot.actions) {
            case 3:
                batteryLevel.className = 'battery-level';
                break;
            case 2:
                batteryLevel.className = 'battery-level two-thirds';
                break;
            case 1:
                batteryLevel.className = 'battery-level one-third';
                break;
            default:
                batteryLevel.className = 'battery-level empty';
                robot.poweredOn = false;
                break;
        }
    }

    // Robot state machine
    let robot = {
        x: canvas.width / 2, // Center position
        y: canvas.height - 140, // bottom position
        poweredOn: false,
        charging: false,
        doingAction: false,
        firing: false,
        actions: 3,
        legOffset: 0, // For moving the legs
        leftArmAngle: 0, // For spinning the left arm
        rightArmAngle: 0, // For spinning the right arm
    };

    // Function to update the canvas size and redraw the robot using an event listener
    window.addEventListener('resize', updateCanvas);
    function updateCanvas() {

        // sets a min and max width to different aspect ratios for large and small screens and centres the canvas
        let maxWidth = 1000;
        let minWidth = 600;
        let aspectRatio = window.innerWidth <= minWidth ? 1 : 16 / 9;
        let width = window.innerWidth * 0.9;
        let height = window.innerHeight * 0.9;

        // update canvas size based on the size of the window maintaining the aspect ratio for large and small screens
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        }
        else {
            height = width / aspectRatio;
        }

        if (width > maxWidth) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
        }

        // redraws the robot and sets the canvas size
        canvas.width = width;
        canvas.height = height;
        robot.x = canvas.width / 2;
        robot.y = canvas.height - 140;
        drawRobot();
    }

    // Function to draw the robot's body
    function drawBody() {
        ctx.fillStyle = '#666666';
        ctx.fillRect(robot.x - 40, robot.y - 60, 80, 120);
    }

    // Function to draw the robot's head
    function drawHead() {
        ctx.fillStyle = '#666666';
        ctx.fillRect(robot.x - 30, robot.y - 100, 60, 40);
    }

    // Function to draw the robot's eyes
    function drawEyes() {
        ctx.fillStyle = robot.poweredOn ? (robot.firing ? '#ff0000' : '#00ff00') : '#444444';
        ctx.beginPath();
        ctx.arc(robot.x - 16, robot.y - 84, 8, 0, Math.PI * 2);
        ctx.arc(robot.x + 16, robot.y - 84, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Function to draw and rotate the robot's arms
    function drawArms() {
        ctx.save();
        ctx.translate(robot.x - 50, robot.y - 40);
        ctx.rotate(robot.leftArmAngle);
        ctx.fillStyle = '#444444';
        ctx.fillRect(-10, -10, 20, 80);
        ctx.restore();

        ctx.save();
        ctx.translate(robot.x + 50, robot.y - 40);
        ctx.rotate(robot.rightArmAngle);
        ctx.fillStyle = '#444444';
        ctx.fillRect(-10, -10, 20, 80);
        ctx.restore();
    }

    // Function to draw and move the robot's legs
    function drawLegs() {
        ctx.fillStyle = '#444444';
        ctx.fillRect(robot.x - 30, robot.y + 60 + robot.legOffset, 20, 80);
        ctx.fillRect(robot.x + 10, robot.y + 60 - robot.legOffset, 20, 80);
    }

    // Function to draw the battery
    function drawBattery() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(robot.x - 20, robot.y - 40, 40, 20);

        let batteryColor;
        let batteryWidth;
        switch (robot.actions) {
            case 3:
                batteryColor = '#28A745'; // Green
                batteryWidth = 40;
                break;
            case 2:
                batteryColor = '#FFC107'; // Yellow
                batteryWidth = 26;
                break;
            case 1:
                batteryColor = '#DC3545'; // Red
                batteryWidth = 14;
                break;
            default:
                batteryColor = '#000000'; // Red
                batteryWidth = 0;
                break;
        }

        ctx.fillStyle = batteryColor;
        ctx.fillRect(robot.x - 20, robot.y - 40, batteryWidth, 20);
    }

    // Function to draw the power indicator
    function drawPowerIndicator() {
        ctx.fillStyle = robot.poweredOn ? '#00ff00' : '#ff0000';
        ctx.beginPath();
        ctx.arc(robot.x, robot.y - 110, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Function to draw the movement zones
    function drawMovementZones() {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, canvas.height / 2, canvas.width * 0.3, canvas.height / 2);
        ctx.fillRect(canvas.width * 0.7, canvas.height / 2, canvas.width * 0.3, canvas.height / 2);
    }

    // Function to draw the charging cable
    function drawChargingCable() {
        ctx.beginPath();
        ctx.moveTo(robot.x, robot.y + 60);
        ctx.bezierCurveTo(
            robot.x, robot.y + 100,
            robot.x + 100, robot.y + 100,
            robot.x + 115, robot.y + 150
        );
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Function to draw the lasers
    function drawLasers(x, y) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(robot.x - 16, robot.y - 84);
        ctx.lineTo(x, y);
        ctx.moveTo(robot.x + 16, robot.y - 84);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Function to draw the entire robot
    function drawRobot() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMovementZones();
        drawPowerIndicator();
        drawBody();
        drawBattery();
        drawHead();
        drawEyes();
        drawArms();
        drawLegs();
    }

    // Add event listeners for both touch and mouse events
    canvas.addEventListener('click', handlePointerEvent);
    canvas.addEventListener('touchstart', handlePointerEvent);

    // Function to handle pointer events
    function handlePointerEvent(event) {

        // performs some checks and returns the  x and y coordinates for the touch or click event
        if (robot.doingAction || !robot.poweredOn || robot.charging || robot.actions === 0) return;
        let rect = canvas.getBoundingClientRect();
        let x;
        let y;

        if (event.type === 'touchstart') {
            let touch = event.touches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }
        else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        handleCanvasClick(x, y);
    }

    // Function to handle canvas clicks
    function handleCanvasClick(x, y) {

        // checks the x and y coordinates of the click and performs the corresponding action
        if (x >= robot.x - 60 && x <= robot.x - 40 && y >= robot.y - 50 && y <= robot.y + 40) {
            spinArm('left');
        }
        else if (x >= robot.x + 40 && x <= robot.x + 60 && y >= robot.y - 50 && y <= robot.y + 40) {
            spinArm('right');
        }
        else if (y >= canvas.height / 2 && (x < canvas.width * 0.3 || x > canvas.width * 0.7)) {
            moveRobot(x);
        }
        else {
            fireLasers(x, y);
        }
    }

    // Function to fire lasers
    function fireLasers(x, y) {

        // fires the lasers and clears the resets the robot after 500ms updating the battery level
        robot.doingAction = true;
        robot.firing = true;
        drawEyes();
        drawLasers(x, y);

        setTimeout(() => {
            robot.actions--;
            robot.doingAction = false;
            robot.firing = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateBattery();
            drawRobot();
        }, 500);
    }

    // Function to spin the robot's arm
    function spinArm(arm) {

        // spins the selected arm and resets the robot after 2000ms updating the battery level
        robot.doingAction = true;
        let angle = 0;
        let animation = setInterval(() => {
            angle += 0.2;
            if (arm === 'left') robot.leftArmAngle = angle;
            else robot.rightArmAngle = angle;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRobot();
        }, 16);

        setTimeout(() => {
            robot.actions--;
            robot.doingAction = false;
            clearInterval(animation);
            if (arm === 'left') robot.leftArmAngle = 0;
            else robot.rightArmAngle = 0;
            robot.leftArmAngle = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateBattery();
            drawRobot();
        }, 2000);
    }

    // Function to move the robot
    function moveRobot(targetX) {

        // moves the robot to the target x position and resets the robot after 1000ms updating the battery level
        robot.doingAction = true;
        let startX = robot.x;
        let distance = targetX - startX;
        let steps = 50;
        let currentStep = 0;

        // moves the robots legs and arms to simulate walking
        let animation = setInterval(() => {
            currentStep++;
            let progress = currentStep / steps;
            robot.legOffset = Math.sin(progress * Math.PI * 2) * 10;
            if (targetX > canvas.width * 0.7) robot.leftArmAngle = Math.sin(progress * Math.PI * 2) * 0.2;
            else robot.rightArmAngle = Math.sin(progress * Math.PI * 2) * 0.2;
            robot.x = startX + (distance * progress);
            drawRobot();

            if (currentStep >= steps) {
                robot.actions--;
                robot.doingAction = false;
                clearInterval(animation);
                updateBattery();
                drawRobot();
            }
        }, 20);
    }

    // Initialization
    updateCanvas();
});
