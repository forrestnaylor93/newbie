const init_canvas_and_ctx = (canvasId)=>{
    // get canvas from html
    const canvas = document.getElementById(canvasId);

    // set width and height to full screen
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // get context
    const ctx = canvas.getContext('2d');


    return {
        canvas: canvas,
        ctx: ctx
    }

}


function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
  }



export{init_canvas_and_ctx, resizeCanvasToDisplaySize}