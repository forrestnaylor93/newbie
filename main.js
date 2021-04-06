import {init_canvas_and_ctx, resizeCanvasToDisplaySize} from './modules/init_canvas.js';
import {Coordinate_Plane} from './modules/Coordinate_Plane.js';



// get canvas and create context
const {canvas, ctx} = init_canvas_and_ctx('myCanvas');
resizeCanvasToDisplaySize(canvas);

const plane = new Coordinate_Plane(ctx);
// make plane object

let start;
let loop = (timestamp)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(start == undefined){start = 0}
    //console.log(timestamp)
    //console.log('loop')
    plane.draw();
    plane.pan_plane_horizontal(1);
    requestAnimationFrame(loop)
}

loop();

