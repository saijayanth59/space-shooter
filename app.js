const canvas = document.querySelector("canvas");
const score = document.querySelector('#score');
const content = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor() {
    this.rotation = 0;
    this.velocity = {
      x: 0,
      y: 0,
    };
	this.opacity = 1;
    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.6;
      this.image = image;
      this.width = 100 * scale;
      this.height = 100 * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    content.save();
	content.globalAlpha = this.opacity;
    content.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    content.rotate(this.rotation);

    content.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    content.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    content.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }

  gameover(){
	content.fillStyle = "#ffffffef";
	content.font = "bold 100px Arial";
	content.fillText("Game Over", (canvas.width / 2) - 250, (canvas.height / 2));
  }
}

class projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 3;
  }

  draw() {
    content.beginPath();
    content.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    content.fillStyle = 'red';
    content.fill();
    content.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}


class Particle {
	constructor({ position, velocity, radius, color, fades}) {
	  this.position = position;
	  this.velocity = velocity;
	  this.radius = radius;
	  this.color = color;
	  this.opacity = 1;
	  this.fades = fades;
	}
  
	draw() {
	  content.save();
	  content.beginPath();
	  content.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
	  content.globalAlpha = this.opacity;
	  content.fillStyle = this.color;
	  content.fill();
	  content.closePath();
	  content.restore();
	}
  
	update() {
	  this.draw();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  if(this.fades) this.opacity -= 0.01;
	}
  }

class InvaderProjectile {
	constructor({ position, velocity }) {
	  this.position = position;
	  this.velocity = velocity;
	  this.width = 3;
	  this.height = 10;
	}
  
	draw() {
		content.fillStyle = 'white';
		content.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
  
	update() {
	  this.draw();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	}
  }

  class Projectile {
	constructor({ position, velocity }) {
	  this.position = position;
	  this.velocity = velocity;
	  this.radius = 3;
	  
	}
  
	draw() {	
	  content.beginPath();
	  content.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
	  content.fillStyle = 'red';
	  content.fill();
	  content.closePath();
	}
  
	update() {
	  this.draw();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  
	}
  }

class Invader {
	constructor({position}) {
	  this.velocity = {
		x: 0,
		y: 0,
	  };
  
	  const image = new Image();
	  image.src = "./img/invader.png";
	  image.onload = () => {
		const scale = 0.4;
		this.image = image;
		this.width = 100 * scale;
		this.height = 100 * scale;
		this.position = {
		  x: position.x,
		  y: position.y,
		};
	  };
	}
  
	draw() {
  
	  content.drawImage(
		this.image,
		this.position.x,
		this.position.y,
		this.width,
		this.height
	  );
	}
  
	update({velocity}) {
	  if (this.image) {
		this.draw();
		this.position.x += velocity.x;
		this.position.y += velocity.y;
	  }
	}

	shoot(invaderProjectiles){
		if(this.image){
			invaderProjectiles.push(new InvaderProjectile({			
			position : {
				x : this.position.x + this.width / 2,
				y : this.position.y + this.height / 2
			},
			velocity : {
				x : 0,
				y : 5
			}

			}));
		}
	}
  }
  



  class Grid{
	constructor(){
		this.position = {
			x : 0,
			y : 0
		};

		this.velocity = {
			x : 3,
			y : 0
		};

		this.invaders = [];
		const rows = Math.floor(Math.random()*5 + 2);
		const cols = Math.floor(Math.random()*10 + 5);
		this.width = cols*30;
		this.height = rows*30;
		for(let i = 0; i < cols; i++){
			for(let j = 0; j < rows; j++){
				this.invaders.push(new Invader({
					position : {
						x : i*30,
						y : j*30
					}
				}));
			}
		}
		// console.log(this.invaders);
	}

	update(){
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.velocity.y = 0;
		if(this.position.x + this.width >= canvas.width || this.position.x < 0){
			this.velocity.x = -this.velocity.x;
			this.velocity.y = 30;
		} 
	}
  }

const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];
let game = {
	over : false,
	active : true
}
let points = 0;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
let randomInterval  = Math.floor(Math.random()*500 + 500);

for(let i = 0; i < 100; i++){
	particles.push(new Particle({
		position : {
			x : Math.random() * canvas.width,
			y : Math.random() * canvas.height
		},
		velocity : {
			x : 0,
			y : 0.3
		},
		radius : Math.random()*3,
		color : 'white'
	}))
}

function createParticles({object, color, fades}){
	for(let i = 0; i < 15; i++){
		particles.push(new Particle({
			position : {
				x : object.position.x + object.width / 2,
				y : object.position.y + object.height / 2
			},
			velocity : {
				x : Math.random() - 0.5 * 2,
				y : Math.random() - 0.5 * 2
			},
			radius : Math.random()*3,
			color : color || '#BAA0DE',
			fades
		}))
	}
}

function animate() {
  if(!game.active) return;	
  window.requestAnimationFrame(animate);
  content.fillStyle = "black";
  content.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  particles.forEach((particle, idx) => {
	if(particle.position.y - particle.radius >= canvas.height){
		particle.position.x = Math.random() * canvas.width;
		particle.position.y = -particle.radius;
	}
	if(particle.opacity <= 0){
		setTimeout(() => {
			// console.log("Removing");
			particles.splice(idx, 1);
		},0)
	}else{
		particle.update();
	}
  })
  invaderProjectiles.forEach((invaderProjectile,idx) => {
	if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
		setTimeout(() => {
			invaderProjectiles.splice(idx, 1);
		},0);
	}else{
		invaderProjectile.update();
	}
	if((invaderProjectile.position.y + invaderProjectile.height >= player.position.y)
		&& invaderProjectile.position.x + invaderProjectile.width >= player.position.x
		&& invaderProjectile.position.x <= player.position.x + player.width){
		setTimeout(() => {
			invaderProjectiles.splice(idx, 1);
			player.opacity = 0;
			game.over = true;
		},0);

		setTimeout(() => {
			game.active = false;
			player.gameover();
		},2000)
		console.log('you lose');
		createParticles({
			object : player,
			color : 'white', 
			fades : true
		})
	}
  });
//   console.log(invaderProjectiles);
  projectiles.forEach((projectile,idx) => {
    if(projectile.position.y + projectile.radius <= 0){
		setTimeout(() => {
			projectiles.splice(idx,1);
		},0);
    }else{ 
      projectile.update();
    }
  })
  grids.forEach((grid, grid_idx) => {
	grid.update();
	if(frames % 100 === 0 && grid.invaders.length > 0){
		grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
	}
	
	grid.invaders.forEach((invader, i) => {
		invader.update({velocity : grid.velocity});

		projectiles.forEach((projectile, j) => {
			if((projectile.position.y - projectile.radius <= invader.position.y + invader.height)
				&& (projectile.position.x + projectile.radius >= invader.position.x)
				&& (projectile.position.x - projectile.radius <= invader.position.x + invader.width)
				&& (projectile.position.y + projectile.radius >= invader.position.y)) {
				setTimeout(() => {
					const invaderFound = grid.invaders.find((invader1) => invader1 === invader);
					const projectileFound = projectiles.find((projectile1) => projectile1 === projectile);
					if(invaderFound && projectileFound){
						points += 100;
						score.innerText = points;
						createParticles({
							object : invader,
							fades : true
						});

						grid.invaders.splice(i, 1);
						projectiles.splice(j, 1);

						if(grid.invaders.length > 0){
							const firstInvader = grid.invaders[0];
							const lastInvader = grid.invaders[grid.invaders.length - 1];

							grid.width = lastInvader.position.x - firstInvader.position.x + firstInvader.width;
							grid.position.x = firstInvader.position.x;
						}else{
							grids.splice(grid_idx, 1);
						}
					}
				},0);
			}
		});

	}) 
  })


  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
  // console.log(frames);
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    // console.log(randomInterval)
    frames = 0;
	// console.log("I am running");
  }
  frames++;
}

animate();


addEventListener("keydown", ({ key }) => {
  if(game.over) return;	
  switch (key) {
    case "a":
      console.log("left");
      keys.a.pressed = true;
      break;
    case "d":
      console.log("right");
      keys.d.pressed = true;
      break;
    case " ":
      console.log(projectiles);
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width/2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -15,
        },
      }));
      // keys.space.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      // console.log("left");

      keys.a.pressed = false;
      break;
    case "d":
      // console.log("right");
      keys.d.pressed = false;
      break;
    case " ":
      // console.log("spacce");
      keys.space.pressed = false;
      break;
  }
});

