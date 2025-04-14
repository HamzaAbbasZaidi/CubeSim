const { createCanvas } = require('canvas');
const {Client, Events, SlashCommandBuilder, GuildTemplate} = require('discord.js');
const {token, channelId} = require('./config.json');

const client = new Client({intents: []});

const cube = {
    U: Array(9).fill('W'), // White
    D: Array(9).fill('Y'), // Yellow
    F: Array(9).fill('G'), // Green
    B: Array(9).fill('B'), // Blue
    L: Array(9).fill('O'), // Orange
    R: Array(9).fill('R'), // Red
};

const validMoves = new Set([
    'U', "U'", 'U2',
    'D', "D'", 'D2',
    'L', "L'", 'L2',
    'R', "R'", 'R2',
    'F', "F'", 'F2',
    'B', "B'", 'B2',
    'x', "x'", 'x2',
    'y', "y'", 'y2',
    'z', "z'", 'z2',
  ]);

function applyUPrime() {
    applyU();
    applyU();
    applyU();
}

function applyU2() {
    applyU();
    applyU();
}

function applyU() {
  let temp = cube.U[0];
  cube.U[0] = cube.U[6];
  cube.U[6] = cube.U[8];
  cube.U[8] = cube.U[2];
  cube.U[2] = temp;

  let temp2 = cube.F[2];
  cube.F[2] = cube.R[2];
  cube.R[2] = cube.B[2];
  cube.B[2] = cube.L[2];
  cube.L[2] = temp2;

  let temp3 = cube.F[1];
  cube.F[1] = cube.R[1];
  cube.R[1] = cube.B[1];
  cube.B[1] = cube.L[1];
  cube.L[1] = temp3;

  let temp4 = cube.F[0];
  cube.F[0] = cube.R[0];
  cube.R[0] = cube.B[0];
  cube.B[0] = cube.L[0];
  cube.L[0] = temp4;

  let temp5 = cube.U[1];
  cube.U[1] = cube.U[3];
  cube.U[3] = cube.U[7];
  cube.U[7] = cube.U[5];
  cube.U[5] = temp5;
} 

function rotateCubeX(){
    for (let i = 0; i < 9; i++) {
        let temp = cube.U[i];
        cube.U[i] = cube.F[i];
        cube.F[i] = cube.D[i];
        cube.D[i] = cube.B[8-i];
        cube.B[8-i] = temp;
    }
    temp = cube.R[0];
cube.R[0] = cube.R[6];
cube.R[6] = cube.R[8];
cube.R[8] = cube.R[2];
cube.R[2] = temp;
temp = cube.R[1];
cube.R[1] = cube.R[3];
cube.R[3] = cube.R[7];
cube.R[7] = cube.R[5];
cube.R[5] = temp;
temp = cube.L[0];
cube.L[0] = cube.L[2];
cube.L[2] = cube.L[8];
cube.L[8] = cube.L[6];
cube.L[6] = temp;
temp = cube.L[1];
cube.L[1] = cube.L[5];
cube.L[5] = cube.L[7];
cube.L[7] = cube.L[3];
cube.L[3] = temp;
}

function rotateCubeXPrime() {
    rotateCubeX();
    rotateCubeX();
    rotateCubeX();
}

function rotateCubeX2(){
    rotateCubeX();
    rotateCubeX();
}

function generateScramble() {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const suffixes = ['', "'", '2'];
    const scramble = [];
    let lastFace = null;
  
    for (let i = 0; i < 20; i++) {
      let move;
      do {
        move = moves[Math.floor(Math.random() * moves.length)];
      } while (move === lastFace);
      lastFace = move;
  
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const fullMove = move + suffix;
      scramble.push(fullMove);
      applyMove(fullMove); // Apply the move to the cube
    }
    return scramble;
  }

function applyR(){
    temp = cube.R[0];
    cube.R[0] = cube.R[6];
    cube.R[6] = cube.R[8];
    cube.R[8] = cube.R[2];
    cube.R[2] = temp;
    temp = cube.R[1];
    cube.R[1] = cube.R[3];
    cube.R[3] = cube.R[7];
    cube.R[7] = cube.R[5];
    cube.R[5] = temp;
    for (let i = 0; i < 9; i++) {
        if(i == 2 || i == 5 || i == 8) {
        let temp = cube.U[i];
        cube.U[i] = cube.F[i];
        cube.F[i] = cube.D[i];
        cube.D[i] = cube.B[8-i];
        cube.B[8-i] = temp;
        }
    }
}

function applyRPrime() {
    applyR();
    applyR();
    applyR();
}

function applyR2() {
    applyR();
    applyR();
}

function applyF() {
    rotateCubeX();
    applyU();
    rotateCubeXPrime();
}

function applyF2() {
    rotateCubeX();
    applyU2();
    rotateCubeXPrime();
}

function applyFPrime() {
    rotateCubeX();
    applyUPrime();
    rotateCubeXPrime();
}

function applyD() {
    rotateCubeX2();
    applyU();
    rotateCubeX2();
}

function applyDPrime() {
    rotateCubeX2();
    applyUPrime();
    rotateCubeX2();
}

function applyD2() {
    rotateCubeX2();
    applyU2();
    rotateCubeX2();
}

function applyLPrime() {
    temp = cube.L[0];
cube.L[0] = cube.L[2];
cube.L[2] = cube.L[8];
cube.L[8] = cube.L[6];
cube.L[6] = temp;
temp = cube.L[1];
cube.L[1] = cube.L[5];
cube.L[5] = cube.L[7];
cube.L[7] = cube.L[3];
cube.L[3] = temp;

for (let i = 0; i < 9; i++) {


if(i == 0 || i == 3 || i == 6) {

    let temp = cube.U[i];
    cube.U[i] = cube.F[i];
    cube.F[i] = cube.D[i];
    cube.D[i] = cube.B[8-i];
    cube.B[8-i] = temp;
}
}

}

function applyL() {
    applyLPrime();
    applyLPrime();
    applyLPrime();
}

function applyL2() {
    applyLPrime();
    applyLPrime();
}

function applyB() {
    rotateCubeXPrime();
    applyU();
    rotateCubeX();
}

function applyB() {
    rotateCubeXPrime();
    applyU();
    rotateCubeX();
}

function applyBPrime() {
    rotateCubeXPrime();
    applyUPrime();
    rotateCubeX();
}

function applyB2() {
    rotateCubeXPrime();
    applyU2();
    rotateCubeX();
}

function rotateCubeY() {
    applyU();
    applyDPrime();
    for (let i = 3; i < 6; i++) {
        let temp = cube.F[i];
        cube.F[i] = cube.R[i];
        cube.R[i] = cube.B[i];
        cube.B[i] = cube.L[i];
        cube.L[i] = temp;
    }
}

function rotateCubeY2() {
    rotateCubeY();
    rotateCubeY();
}

function rotateCubeYPrime() {
    rotateCubeY2();
    rotateCubeY();
}

function rotateCubeZ() {
    rotateCubeY();
    rotateCubeXPrime();
    rotateCubeYPrime();
}

function rotateCubeZPrime() {
    rotateCubeZ();
    rotateCubeZ();
    rotateCubeZ();
}

function rotateCubeZ2() {
    rotateCubeZ();
    rotateCubeZ();
}

function applyMove(move) {
    switch (move) {
        case "U": return applyU();
        case "U'": return applyUPrime();
        case "U2": return applyU2();
        case "x": return rotateCubeX();
        case "x'": return rotateCubeXPrime();
        case "x2": return rotateCubeX2();
        case "R": return applyR();
        case "R'": return applyRPrime();
        case "R2": return applyR2();
        case "F": return applyF();
        case "F2": return applyF2();
        case "F'": return applyFPrime();
        case "D": return applyD();
        case "D'": return applyDPrime();
        case "D2": return applyD2();
        case "L'": return applyLPrime();
        case "L": return applyL();
        case "L2": return applyL2();
        case "B": return applyB();
        case "B'": return applyBPrime();
        case "B2": return applyB2();
        case "y": return rotateCubeY();
        case "y2": return rotateCubeY2();
        case "y'": return rotateCubeYPrime();
        case "z": return rotateCubeZ();
        case "z'": return rotateCubeZPrime();
        case "z2": return rotateCubeZ2();
        default: throw new Error("Invalid move: " + move);
    }
}
  

function colorFromLetter(letter) {
    switch (letter) {
      case 'W': return 'white';
      case 'Y': return 'yellow';
      case 'G': return 'green';
      case 'B': return 'blue';
      case 'O': return 'orange';
      case 'R': return 'red';
      default: return 'gray'; // fallback
    }
  }

function drawCube() {

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(250,250); // UFR
    ctx.lineTo(189.378,215);
    ctx.lineTo(250, 180);
    ctx.lineTo(310.621,215)
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[8]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(128.756,180);
    ctx.lineTo(189.378,215);
    ctx.lineTo(250, 180);
    ctx.lineTo(189.378,145);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[7]); // UF
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128.756,180);
    ctx.lineTo(68.135,145);
    ctx.lineTo(128.756,110);
    ctx.lineTo(189.378,145);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[6]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,180);
    ctx.lineTo(189.308,145);
    ctx.lineTo(250, 110);
    ctx.lineTo(310.621,145)
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[4]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,110);
    ctx.lineTo(189.308,75);
    ctx.lineTo(250, 40);
    ctx.lineTo(310.621,75)
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[0]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(128.756,110);
    ctx.lineTo(189.378,145);
    ctx.lineTo(250, 110);
    ctx.lineTo(189.378,75);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[3]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(310.622,215); // yes
    ctx.lineTo(250,180);
    ctx.lineTo(310.622, 145);
    ctx.lineTo(371.244,180);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[5]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(310.622,145); // yes
    ctx.lineTo(250,110);
    ctx.lineTo(310.622, 75);
    ctx.lineTo(371.244,110);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[1]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(371.244,180);
    ctx.lineTo(310.622,145);
    ctx.lineTo(371.244, 110);
    ctx.lineTo(431.865,145);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.U[2]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(250,250);
    ctx.lineTo(310.622,215);
    ctx.lineTo(310.622,285);
    ctx.lineTo(250,320);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[0]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(310.622,215);
    ctx.lineTo(310.622,285);
    ctx.lineTo(371.244,250);
    ctx.lineTo(371.244,180);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[1]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(371.244,250);
    ctx.lineTo(371.244,180);
    ctx.lineTo(431.865,145);
    ctx.lineTo(431.865,215);
    ctx.lineTo();
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[2]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,320);
    ctx.lineTo(310.622,285);
    ctx.lineTo(310.622,355);
    ctx.lineTo(250,390);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[3]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(310.622,285);
    ctx.lineTo(310.622,355);
    ctx.lineTo(371.244,320);
    ctx.lineTo(371.244,250);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[4]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(371.244,320);
    ctx.lineTo(371.244,250);
    ctx.lineTo(431.865,215);
    ctx.lineTo(431.865,285);
    ctx.lineTo();
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[5]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,390);
    ctx.lineTo(310.622,355);
    ctx.lineTo(310.622,425);
    ctx.lineTo(250,460);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[6]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(310.622,355);
    ctx.lineTo(310.622,425);
    ctx.lineTo(371.244,390);
    ctx.lineTo(371.244,320);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[7]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(371.244,390);
    ctx.lineTo(371.244,320);
    ctx.lineTo(431.865,285);
    ctx.lineTo(431.865,355);
    ctx.lineTo();
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.R[8]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,250);
    ctx.lineTo(189.378,215);
    ctx.lineTo(189.378,285);
    ctx.lineTo(250,320);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[2]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(189.378,215);
    ctx.lineTo(189.378,285);
    ctx.lineTo(128.756,250);
    ctx.lineTo(128.756,180);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[1]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(128.756,250);
    ctx.lineTo(128.756,180);
    ctx.lineTo(68.137,145);
    ctx.lineTo(68.137,215);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[0]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,320);
    ctx.lineTo(189.378,285);
    ctx.lineTo(189.378,355);
    ctx.lineTo(250,390);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[5]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(189.378,285);
    ctx.lineTo(189.378,355);
    ctx.lineTo(128.756,320);
    ctx.lineTo(128.756,250);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[4]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(128.756,320);
    ctx.lineTo(128.756,250);
    ctx.lineTo(68.137,215);
    ctx.lineTo(68.137,285);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[3]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(250,390);
    ctx.lineTo(189.378,355);
    ctx.lineTo(189.378,425);
    ctx.lineTo(250,460);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[8]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(189.378,355);
    ctx.lineTo(189.378,425);
    ctx.lineTo(128.756,390);
    ctx.lineTo(128.756,320);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[7]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(128.756,390);
    ctx.lineTo(128.756,320);
    ctx.lineTo(68.137,285);
    ctx.lineTo(68.137,355);
    ctx.closePath();
    ctx.fillStyle = colorFromLetter(cube.F[6]);
    ctx.fill();
    ctx.lineWidth = 4;       // Set thickness
    ctx.strokeStyle = 'black'; // Set outline col
    ctx.stroke(); 
    return canvas;
}

async function sendCubeImage(channel) {
    const canvas = drawCube();
    const buffer = canvas.toBuffer();

    // Send the image to Discord as an attachment
    await channel.send({
        files: [{ attachment: buffer, name: 'cube.png' }]
    });
}

client.once(Events.ClientReady, async c => {
    console.log(`Logged in as ${c.user.username}`);
    
    try {
      // Get the channel by its ID
      const channel = await client.channels.fetch(channelId);  // Fetch the channel asynchronously
      
      if (channel) {
        await channel.send("CubeSim has joined the party. Let's goooooooooooooo! :tada: :tada: :tada: ");  // Send the ready message
        await sendCubeImage(channel);
      } else {
        console.warn(`⚠️ Could not find channel with ID: ${channelId}`);
      }
  

      // Create and register the /ping command
      const ping = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!");
      

      const move = new SlashCommandBuilder()
        .setName("move")
        .setDescription("Apply moves to the cube")
        .addStringOption(option =>
            option.setName("moves")
              .setDescription("Enter cube moves like R U R'")
              .setRequired(true)
          );

      const scramble = new SlashCommandBuilder()
      .setName("scramble")
      .setDescription("Apply a randomly generated scramble to the cube");
        

      await client.application.commands.create(move);
      await client.application.commands.create(ping);
      await client.application.commands.create(scramble);

    } catch (error) {
      console.error("Error when sending ready message:", error);
    }
  });

client.on(Events.InteractionCreate, async interaction => {
    console.log(interaction);
    const { commandName } = interaction;
    if (commandName === 'ping') {
        await interaction.reply("Pong!");
    }

    if (commandName === 'move') {
        const moveString = interaction.options.getString("moves");
        const moveList = moveString.trim().split(/\s+/);

        for (const move of moveList) {
            if (!validMoves.has(move)) {
              await interaction.reply({ content: `Invalid move: \`${move}\``, ephemeral: true });
              return;
            }
        }

        try {
            for (const move of moveList) {
                applyMove(move); // this function mutates your shared cube state
            }
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'There was an error applying the moves.', ephemeral: true });
            return;
        }

        await interaction.reply(`Moves applied: ${moveString}`);

        
        // Send updated cube image to the same channel
        const channel = interaction.channel;
        if (channel) {
            await sendCubeImage(channel);
        }
    }

    if(commandName === 'scramble') {
        scramble = generateScramble();
        await interaction.reply(`Scramble:\n\`${scramble.join(' ')}\``);
        const channel = interaction.channel;
        if (channel) {
        await sendCubeImage(channel);
}
    }

})

client.login(token);