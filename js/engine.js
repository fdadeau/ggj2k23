/**
 *  3D-rendering engine based on raycasting solution.
 *  Built using Lode's tutorial on raycasting (https://lodev.org/cgtutor/raycasting.html, parts 1, 2, 3, 4)
 *  and F. Permadi seminal tutorial (http://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/)
 */

// Assuming 640x400 (10/16 ratio) 

/** Screen width */
const WIDTH = 640;
/** Screen height */
const HEIGHT = WIDTH * 10 / 16;

export class Engine {

    constructor(cvs) {
        cvs.width = WIDTH;
        cvs.height = HEIGHT;
        /** 2D context for scene rendering */
        this.ctx = cvs.getContext("2d");
        /** Image buffer, to be filled by scene renderers (floor, ceiling and wall casters) */
        this.buffer = this.ctx.createImageData(WIDTH, HEIGHT);
        /** Framerate information */
        this.framerate = 60;
        /** Set of textures */
        this.textures = initTextures();
        /** Depth of different x walls */
        this.zBuffer = [];
    }

    /**
     * Evaluate the brightness % w.r.t. the distance
     * @param {Number} dist the distance in the world
     * @returns {Number} a real between 0 (dark) and 1 (light)
     */
    brightnessForDistance(dist) {
        const min = 1, max = 10;
        if (dist > max) {
            return 0;
        }
        if (dist < min) {
            return 1;
        }
        return 1 - ((dist-min) / (max-min));
    }

    /**
     * Main function used to render the game state
     * @param {Game} game the game state to render
     */
    render(game) {

        if (game.on2D) {
            this.render2D(game);
            return;
        }
        
        // generate the floor and ceiling
        this.floorCasting(game);
        // 
        this.wallCasting(game);
        // once imagedata is filled, display it
        this.ctx.putImageData(this.buffer, 0, 0);            
        
        // add the sprites in the visible scene
        this.spriteCasting(game);
        
        // print framerate & debug info
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.framerate, 10, 10);
        this.ctx.fillText(game.player.getInfos(), 10, 20);
    }

    wallCasting(game) {
        const W = WIDTH;
        const H = HEIGHT;

        this.zBuffer = [];

        for(let x = 0; x < W; x++) {
            //calculate ray position and direction
            const cameraX = 2 * x / W - 1; // x-coordinate in camera space
            let rayDirX = game.player.dirX + game.player.plane.x * cameraX;
            let rayDirY = game.player.dirY + game.player.plane.y * cameraX;

            //which box of the map we're in
            let posX = Math.floor(game.player.posX), posY = Math.floor(game.player.posY);
            let mapX = posX, mapY = posY;

            //length of ray from one x or y-side to next x or y-side
            let deltaDistX = (rayDirX == 0) ? +Infinity : Math.abs(1 / rayDirX);
            let deltaDistY = (rayDirY == 0) ? +Infinity : Math.abs(1 / rayDirY);
            let perpWallDist;

            //what direction to step in x or y-direction (either +1 or -1)
            let stepX, stepY;
            //length of ray from current position to next x or y-side
            let sideDistX, sideDistY;

            //calculate step and initial sideDist
            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (game.player.posX - mapX) * deltaDistX;
            }
            else {
                stepX = 1;
                sideDistX = (mapX + 1.0 - game.player.posX) * deltaDistX;
            }
            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (game.player.posY - mapY) * deltaDistY;
            }
            else {
                stepY = 1;
                sideDistY = (mapY + 1.0 - game.player.posY) * deltaDistY;
            }

            let hit = 0; //was there a wall hit?
            let side; //was a NS or a EW wall hit?

            //perform Digital Differential Analysis (DDA)
            while (hit == 0) {
                //jump to next map square, either in x-direction, or in y-direction
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                //Check if ray has hit a wall
                if (game.map[mapX][mapY] > 0) hit = 1;
            } 

            //Calculate distance projected on camera direction (Euclidean distance would give fisheye effect!)
            perpWallDist = (side == 0) ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);

            // add to zBuffer index 
            this.zBuffer[x] = perpWallDist;

            // adjust brightness
            let b = this.brightnessForDistance(perpWallDist)

            //Calculate height of line to draw on screen
            let lineHeight = Math.floor(H / perpWallDist);

            //calculate lowest and highest pixel to fill in current stripe
            let drawStart = -lineHeight / 2 + H * game.player.altitude + game.player.pitch;
            if (drawStart < 0) drawStart = 0;
            let drawEnd = lineHeight / 2 + H * game.player.altitude + game.player.pitch;
            if (drawEnd >= H) drawEnd = H - 1;

    
            /*** TEXTURES ON THE WALLS ***/

            //texturing calculations
            let texNum = game.map[mapX][mapY] - 1; //1 subtracted from it so that texture 0 can be used!

            //calculate value of wallX (where exactly the wall was hit)
            let wallX = (side == 0) ? game.player.posY + perpWallDist * rayDirY : game.player.posX + perpWallDist * rayDirX;
            wallX -= (wallX | 0);
            
            //x coordinate on the texture
            let texX = (wallX * texWidth) | 0;
            if(side == 0 && rayDirX > 0) texX = texWidth - texX - 1;
            if(side == 1 && rayDirY < 0) texX = texWidth - texX - 1;
                    
            // How much to increase the texture coordinate per screen pixel
            let step = texHeight / lineHeight;
            // Starting texture coordinate
            let texPos = (drawStart - H * game.player.altitude - game.player.pitch + lineHeight / 2) * step;

            for(let y = drawStart | 0; y < drawEnd-1 | 0; y++) {
                // Cast the texture coordinate to integer, and mask with (texHeight - 1) in case of overflow
                let texY = (texPos | 0) % (texHeight);
                texPos += step;
                let color = this.textures[texNum][texHeight * texY + texX];
                //make color darker for y-sides: R, G and B byte each divided through two with a "shift" and an "and"
                let i = (y * WIDTH + x) * 4;
                this.buffer.data[i+0] = (b * (color / 65536)) | 0;
                this.buffer.data[i+1] = (b * ((color % 65536) / 256)) | 0;
                this.buffer.data[i+2] = (b * (color % 256)) | 0;
                this.buffer.data[i+3] = 255;
            }
        }
    }

    /**
     * Computes and displays the textures on the floor (if needed)
     * @param {Game} game the considered game data
     */
    floorCasting(game) {

        const W = WIDTH;
        const H = HEIGHT;

        for(let y = 0; y < H; y++) {
            // rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
            let rayDirX0 = game.player.dirX - game.player.plane.x, rayDirY0 = game.player.dirY - game.player.plane.y;
            let rayDirX1 = game.player.dirX + game.player.plane.x, rayDirY1 = game.player.dirY + game.player.plane.y;

            let is_floor = y > game.player.altitude * H + game.player.pitch;

            // Current y position compared to the center of the screen (the horizon)
            let p = is_floor ? (y - game.player.altitude * H - game.player.pitch) : (game.player.altitude * H - y + game.player.pitch);

            // Vertical position of the camera.
            let posZ = 0.5 * H;

            // Horizontal distance from the camera to the floor for the current row.
            // 0.5 is the z position exactly in the middle between floor and ceiling.
            let rowDistance = posZ / p;

            // calculate the real world step vector we have to add for each x (parallel to camera plane)
            // adding step by step avoids multiplications with a weight in the inner loop
            let floorStepX = rowDistance * (rayDirX1 - rayDirX0) / W;
            let floorStepY = rowDistance * (rayDirY1 - rayDirY0) / W;

            // real world coordinates of the leftmost column. This will be updated as we step to the right.
            let floorX = game.player.posX + rowDistance * rayDirX0;
            let floorY = game.player.posY + rowDistance * rayDirY0;

            let b = this.brightnessForDistance(rowDistance);

            for(let x = 0; x < W; ++x) {
                // the cell coord is simply got from the integer parts of floorX and floorY
                let cellX = floorX | 0;
                let cellY = floorY | 0;
    
                // get the texture coordinate from the fractional part
                let tx = ((texWidth * (floorX - cellX)) | 0) & (texWidth - 1);
                let ty = ((texHeight * (floorY - cellY)) | 0) & (texHeight - 1);
    
                floorX += floorStepX;
                floorY += floorStepY;
    
                // choose texture and draw the pixel
                let floorTexture = 8;       // TODO --> defined a map for floor/ceiling texture choice
                let ceilingTexture = 9;

                let color;

                let i = (y * W + x) * 4;

                // floor
                if (is_floor) {
                    color = this.textures[floorTexture][texWidth * ty + tx];
                    color = (color >> 1) & 8355711; // make a bit darker
                }
                else {    
                    //ceiling (symmetrical, at screenHeight - y - 1 instead of y)
                    color = this.textures[ceilingTexture][texWidth * ty + tx];
                    color = (color >> 1) & 8355711; // make a bit darker
                }
                
                this.buffer.data[i+0] = (b * (color / 65536)) | 0;
                this.buffer.data[i+1] = (b * ((color % 65536) / 256)) | 0;
                this.buffer.data[i+2] = (b * (color % 256)) | 0;
                this.buffer.data[i+3] = 255;
                
            }
        }   
    }


    spriteCasting(game) {
        
        const W = WIDTH;
        const H = HEIGHT;

        game.enemies.forEach(function(e, _i) {
            e.distance = ((game.player.posX - e.x) * (game.player.posX - e.x) + (game.player.posY - e.y) * (game.player.posY - e.y)); 
        });
        game.enemies.sort(function(e1,e2) { return e2.distance - e1.distance; });
    
        const that = this;
        //after sorting the sprites, do the projection and draw them
        game.enemies.forEach(function(e) {
            
            //translate sprite position to relative to camera
            let spriteX = e.x - game.player.posX;
            let spriteY = e.y - game.player.posY;
    
            //transform sprite with the inverse camera matrix
            // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
            // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
            // [ planeY   dirY ]                                          [ -planeY  planeX ]
    
            let invDet = 1.0 / (game.player.plane.x * game.player.dirY - game.player.dirX * game.player.plane.y); //required for correct matrix multiplication
    
            let transformX = invDet * (game.player.dirY * spriteX - game.player.dirX * spriteY);
            let transformY = invDet * (-game.player.plane.y * spriteX + game.player.plane.x * spriteY); //this is actually the depth inside the screen, that what Z is in 3D

            // sprite is not in the viewport
            if (transformY <= 0) {
                return;
            }

            let br = that.brightnessForDistance(Math.sqrt(spriteX*spriteX+spriteY*spriteY));

            if (br == 0) {
                return;
            }

            that.ctx.filter = `brightness(${br})`;

            let spriteScreenX = Math.floor((W / 2) * (1 + transformX / transformY));
           
            //calculate height of the sprite on screen
            let spriteHeight = Math.abs((e.height * e.factor / (transformY)) | 0); //using 'transformY' instead of the real distance prevents fisheye

            let posZ = 1
            let vMoveScreen = (e.vMove / transformY | 0) + H * game.player.altitude + game.player.pitch + posZ / transformY;

            //calculate lowest and highest pixel to fill in current stripe
            let drawStartY = -spriteHeight / 2 + vMoveScreen;
            //if (drawStartY < 0) drawStartY = 0;
            let drawEndY = spriteHeight / 2 + vMoveScreen;
            if(drawEndY >= H) drawEndY = H - 1;
    
            //calculate width of the sprite
            let spriteWidth = Math.abs( (e.width * e.factor / (transformY)) | 0);
            let drawStartX = -spriteWidth / 2 + spriteScreenX;
            //if (drawStartX < 0) drawStartX = 0;
            let drawEndX = spriteWidth / 2 + spriteScreenX;
            if(drawEndX >= W) drawEndX = W - 1;
        
            //loop through every vertical stripe of the sprite on screen
            let startX = drawStartX < 0 ? 0 : drawStartX;

            let minX = null, maxX = null;

            for(let stripe = startX | 0; stripe <= drawEndX && stripe < W; stripe++) {

                //the conditions in the if are:
                 //1) it's in front of camera plane so you don't see things behind you
                 //2) it's on the screen (left) -- simplified above
                 //3) it's on the screen (right) -- simplified above
                 //4) ZBuffer, with perpendicular distance
                if(stripe >= 0 && transformY < that.zBuffer[stripe]) {

                    // HYPOTHESIS: only a slice is ever used, determine minX and maxX of the slice
                    if (minX === null) {
                        minX = stripe;
                    }
                    if (stripe > minX && maxX === null ||  stripe > maxX) {
                        maxX = stripe;
                    }
                }
            }
            if (minX !== null && maxX !== null) {
                
                let angle = game.player.angle - e.angle + 90;
                if (angle < 0) {
                    angle += 360;
                }
                angle = angle % 360;
                
                /*
                let normP = Math.sqrt(game.player.dirX*game.player.dirX+game.player.dirY*game.player.dirY);
                let normE = Math.sqrt(e.dirX*e.dirX+e.dirY*e.dirY);

                let dotProduct = game.player.dirX * e.dirX + game.player.dirY * e.dirY;

                // angle between 2 vectors + 90°
                let angle = Math.acos(dotProduct/(normP*normE));
                angle = angle * 180 / Math.PI;
                
                if (angle < 0) {
                    angle += 360;
                }

                angle = (angle + 90) % 360;
                */

                e.render(that.ctx, (minX - drawStartX), (maxX - drawStartX), spriteWidth, spriteHeight, minX, drawStartY, angle);
            }
        });

        // After all sprites have been considered, reset brightness filter
        this.ctx.filter = "brightness(1)";
    }


    render2D(game) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT)
        let square = (HEIGHT - 20) / Math.min(game.map.length, game.map[0].length);
        this.ctx.fillStyle = "black";
        for (let x = 0; x < game.map.length; x++) {
            for (let y = 0; y < game.map[x].length; y++) {
                if (game.map[x][y] >= 1) {
                    let y1 = game.map[x].length - 1 - y;
                    this.ctx.fillRect(10 + x * square, 10 + y1 * square, square, square);
                }
            }
        }
        this.ctx.fillStyle = "#0000FF";
        this.ctx.strokeStyle = "#0000FF";
        this.ctx.beginPath();
        let posY = game.map[0].length - game.player.posY;
        this.ctx.arc(10 + game.player.posX*square, 10 + posY*square, 0.2 * square, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(10 + game.player.posX*square, 10 + posY*square);
        this.ctx.lineTo(10 + game.player.posX*square + game.player.dirX * square, 10 + posY*square - game.player.dirY * square);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.fillText(game.player.getInfos(), game.map.length * square, 10);

        this.ctx.fillStyle = "#FF0000";
        this.ctx.strokeStyle = "#FF0000";
        game.enemies.forEach(e => {
            this.ctx.beginPath();
            this.ctx.arc(10 + e.x*square, 10 + (game.map[0].length - e.y)*square, 0.2 * square, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.moveTo(10 + e.x*square, 10 + (game.map[0].length - e.y)*square);
            this.ctx.lineTo(10 + e.x*square + e.dirX * square, 10 + (game.map[0].length - e.y)*square - e.dirY * square);
            this.ctx.closePath();
            this.ctx.stroke();
        });
        
        

    }

}




/** Textures from the tutorial */

const texWidth = 64;
const texHeight = 64;

function initTextures() {

    const texture = [];

    for(let i = 0; i < 10; i++) {
        texture.push([]);
    }

    //generate some textures
    for(let x = 0; x < texWidth; x++) {
        for(let y = 0; y < texHeight; y++) {
            let xorcolor = (x * 256 / texWidth) ^ (y * 256 / texHeight);

            //let xcolor = x * 256 / texWidth;
            let ycolor = y * 256 / texHeight;
            let xycolor = y * 128 / texHeight + x * 128 / texWidth;
            texture[0][texWidth * y + x] = 65536 * 254 * (x != y && x != texWidth - y); //flat red texture with black cross
            texture[1][texWidth * y + x] = xycolor + 256 * xycolor + 65536 * xycolor; //sloped greyscale
            texture[2][texWidth * y + x] = 256 * xycolor + 65536 * xycolor; //sloped yellow gradient
            texture[3][texWidth * y + x] = xorcolor + 256 * xorcolor + 65536 * xorcolor; //xor greyscale
            texture[4][texWidth * y + x] = 256 * xorcolor; //xor green
            texture[5][texWidth * y + x] = 65536 * 192 * (x % 16 && y % 16); //red bricks
            texture[6][texWidth * y + x] = 65536 * ycolor; //red gradient
            texture[7][texWidth * y + x] = 128 + 256 * 128 + 65536 * 128; //flat grey texture
            texture[8][texWidth * y + x] = (x > 16 && x < texWidth-16 && y > 16 && y < texWidth-16) ? 256+64 : 128;    // for floors
            texture[9][texWidth * y + x] = 65536 * 4 + 256*4 + 4; // for ceilings
        }
    }

    return texture;

};