import {init_canvas_and_ctx, resizeCanvasToDisplaySize} from './modules/init_canvas.js';
import {Coordinate_Plane} from './modules/Coordinate_Plane.js';



// get canvas and create context
const {canvas, ctx} = init_canvas_and_ctx('myCanvas');
resizeCanvasToDisplaySize(canvas);

const plane = new Coordinate_Plane(ctx);
// make plane object


