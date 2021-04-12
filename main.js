import {init_canvas_and_ctx, resizeCanvasToDisplaySize} from './modules/init_canvas.js';
import {Coordinate_Plane} from './modules/Coordinate_Plane.js';




// get canvas and create context
const {canvas, ctx} = init_canvas_and_ctx('myCanvas');
resizeCanvasToDisplaySize(canvas);

const plane = new Coordinate_Plane(ctx);
// make plane object
//plane.add_keydown_listener(plane.panning_controls);
plane.add_keydown_listener(plane.user_accelerate_left);

let start; // initial time
let dt; // delta time

let loop = (timestamp)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(start == undefined){start = 0}
    dt = timestamp - start;
    plane.dt = dt;
    plane.draw();
    start = timestamp;
    

    
   
    //plane.pan_plane_horizontal(3, 'left');
    requestAnimationFrame(loop)
}

plane.add_all_event_listeners()
loop();
