import {round} from './round_decimals.js';
class Coordinate_Plane{
    
    
    constructor(ctx){
        ////////////////////////////////////////////////////
        // assets
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;

        ////////////////////////////////////////////////////
        // properties
        this.x = 100; // leftmost point of graph
        this.x1 = 800; // rightmost point of graph
        this.y = 100; // highest point of graph
        this.y1 = 780; // lowest point of graph

        this.dt = 0; // time interval for animations



        // step is determined by:
        // (1) the quanity represented by each major gridline (unit) - subdivided into the number and it's order of magnitude
        // (2) px, the number of px between each gridline

        this.step = {
            x:{unit: {number: 1, e:1}, px: 400, px_min: 100, px_max: 200, minor_divisor:4}, 
            y:{unit: {number:1, e:0}, px: 400, px_min: 100, px_max: 200, minor_divisor:4}
        }

        this.width = this.x1 - this.x; // width of the coord plane
        this.height = this.y1 - this.y; // height of the coord plane


        // measurments - gives the max and min units visible within coord plane boundaries -> calculate by function calc_m
        this.m = {
            x:{max:0, min: 0}, 
            y:{max:0, min:0}
        }

        ///////////////////////////////////////////////////
        // appearance


        // this is a color palette designed to make it easy to change the look of the plane without having to use color codes outside of this object
        this.palette = {
            white: '#eee',
            dark_gray: '#333',
            sky: 'rgb(50, 220, 250)',
            orange: 'rgb(220,150,50)',
            yellow: 'yellow',

            white_faded: 'rgba(255,255,255,.4)'
        } 

        // this is where various color palletes are assigned to the actually objects in the plane
        // colors
        this.colors = {
            border: this.palette.white,
            point: this.palette.sky,
            origin: this.palette.orange,
            grid: this.palette.white_faded,
            x_axis: this.palette.yellow,
            y_axis: this.palette.yellow,
            grid_numbers: this.palette.white_faded
        }

        // default sizes of various objects
        this.sizes = {
            border: 7, // width of border in px
            point: 10,  // radius of point in px
            origin: 15, // radius of origin in px
            grid: 2, // pixels
            grid_numbers: 30, // grid_numbers_font_size
        }

        // font
        this.font_family = 'Arial'; // font family
        this.font_size = 30 // font_Size in px
        this.ctx.font = this.font_size.toString()+ "px " + this.font_family;

        // sizes
        

        ///////////////////////////////////////////////////

        // objects

        // all coordinates and gridlines are based off of the origin and it's offset. Default of offset is 0 to start origin in the center
        this.origin = new Origin(this.sizes.origin, this.colors.origin)
        this.origin.offset.x.px = 0; // origin x offset in px (push origin to right: + positive values, to left: - negative values)
        this.origin.offset.y.px = 0; // origin y offset in px (push origin down: + positive values, up: - negative values)

        this.x_axis = new Axis('x', this.colors.x_axis);
        this.y_axis = new Axis('y', this.colors.y_axis)
        // grid is made up of special object called Gridline. Gridlines can be major or minor, vertical or horizontal.
        this.grid = {
            vertical:[],
            horizontal:[]
        }

        // points to be displayed on canvas
        this.points = [];

        // points that have been clicked to be selected for creating lines and polygons
        this.selected_points = [];

        // records which objects have been created allowing users to delete most recently created objects with ctrl-z if desired
        this.objects_receipts = [];

        // calculates the min and max units for the plane based off of the given step, the width and height of the plane, and the origin location
        this.calc_m();


        /// interacitivy
        this.mousedown = [];
        this.mouseup = [];
        this.keydown = [];
        this.keyup = [];
        this.mousemove = [];
        this.wheel = [];
        this.event_listeners = [this.mousedown, this.mouseup, this.keydown, this.mousemove, this.wheel]

        
        // panning 
        this.pan = {
            x: {acceleration:1, velocity: 0, min_velocity: 5, max_velocity: 60}, // positive for right, negative for left
            y: {acceleration:1, velocity: 0, min_velocity:5, max_velocity: 60},
            brakes: {x: false, y: false}
        }

        this.mouse = {
            x: {px: 0, unit: 0},
            y: {px: 0, unit: 0}
        }

        // zooming
        this.zoom = {
            in: {acceleration: .6, rate: 0, max_rate: 4},
            out: {acceleration: .6, rate: 0, max_rate: 4},
            zoom_out: false,
            zoom_in: false,
            spin: 0,
        }

        this.add_keydown_listener();
        this.add_keyup_listener();

        this.add_keydown_listener(this.control_pan_keydown)
        this.add_keyup_listener(this.control_pan_keyup)

        this.add_keydown_listener(this.zoom_out_keydown);
        this.add_keyup_listener(this.zoom_out_keyup);

        this.add_keydown_listener(this.zoom_in_keydown);
        this.add_keyup_listener(this.zoom_in_keyup);

       
        //this.new_gridline(0,'horizontal');
        this.new_grid(); // creates grid for new plane
       // this.new_point(5,5); // test point
        
        
        this.draw(); // test drawing
        //this.draw_numbers_on_x_axis();


        // zoom with wheel event listner, needs to be worked into this.event_listeners by creating and using this.add_wheel_listener()
       this.canvas.addEventListener('wheel', (e)=>{
            this.zoom.zoom_in = false;
            this.zoom.spin = e.wheelDelta;

            if(this.zoom.spin < 0){
               this.zoom.out.rate += this.zoom.out.acceleration*this.dt/17; // this rate seems to move smoothly
            }
            if(this.zoom.out.rate >= this.zoom.out.max_rate){
                this.zoom.out.rate = this.zoom.out.max_rate
            }

            if(this.zoom.spin > 0){
                this.zoom.in.rate += this.zoom.in.acceleration*this.dt/17; // this rate seems to move smoothly
            }
            if(this.zoom.in.rate >= this.zoom.in.max_rate){
                this.zoom.in.rate = this.zoom.in.max_rate
            }
            
            

            
            
           
       })

       // mouse tracking event_listener, needs to be worked into this.event_listeners by creating and using a this.add_mousemove_listener()
       this.canvas.addEventListener('mousemove', (e)=>{
           this.mouse.x.px = e.clientX;
           this.mouse.x.unit = round(this.convert_pxX_to_unit(this.mouse.x.px))
           this.mouse.y.px = e.clientY;
           this.mouse.y.unit = round(this.convert_pxY_to_unit(this.mouse.y.px))
       })
    }

    // update functions

    update_pan = ()=>{
        
        if(this.pan.brakes.x){
            this.pan.x.velocity *= 0
            if(Math.abs(this.pan.x.velocity) < 0.1 ){
                this.pan.x.velocity = 0 ;
            }
            
        }

  

        if(this.pan.brakes.y){
            this.pan.y.velocity *= 0.80
            if(Math.abs(this.pan.y.velocity) < 0.1 ){
                this.pan.y.velocity = 0 ;
            }
            
        }
        

      
        this.origin.offset.x.px += this.pan.x.velocity;
        this.origin.offset.y.px -= this.pan.y.velocity;

        
        this.new_grid();
   
        

    }

    update_zoom = () =>{

        // zoom out
        if((this.zoom.zoom_out || this.zoom.spin < 0 ) && this.step.x.px > this.step.x.px_min ){
            
            this.step.x.px -= this.zoom.out.rate*this.dt/17;
            
            if(this.zoom.spin < -10){
                this.zoom.spin = -7;
            }else{
                this.zoom.spin += 1;
                if(this.zoom.spin == 0){
                    this.zoom.out.rate = 0;
                }
            }
            
        }
        else if((this.zoom.zoom_out || this.zoom.spin < 0)&& this.step.x.unit.e <= 200 && this.step.x.unit.e >= -200 ){
            this.step.x.px = this.step.x.px_max;
            //this.new_grid();
            switch(this.step.x.unit.number){
                case 1:
                    this.step.x.unit.number *= 2;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                break;
                case 2:
                    this.step.x.unit.number *= 2.5;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                    
                break;
                case 5:
                    this.step.x.unit.number /= 5;
                    this.step.x.unit.e += 1;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                break;
                default:
                

            }
        }

        //zoom in
        if((this.zoom.zoom_in || this.zoom.spin > 0 ) && this.step.x.px < this.step.x.px_max){
          

            let original_step = this.step.x.px
            let steps_between_mouse_and_origin = this.mouse.x.unit;
            this.step.x.px += this.zoom.in.rate*this.dt/17;
            let new_steps_between_mouse_and_origin = steps_between_mouse_and_origin*(original_step/this.step.x.px);
            let diff_in_steps = new_steps_between_mouse_and_origin - steps_between_mouse_and_origin;
            let diff_in_pixels = this.convert_unitX_to_px(diff_in_steps);
            console.log(diff_in_pixels)
           // this.origin.offset.x.px -= diff_in_pixels
            //let change_ratio = (this.step.x.px/original_step);

            //console.log(change_ratio)
            //this.origin.offset.x.px = 

            //this.origin.offset
            
            

            // allowing for zoom to shift origin offset
              
           // console.log(this.mouse.x.unit*(1+this.zoom.in.rate*this.dt/17))
           // this.origin.offset.x.px += px_change*this.dt/17//px_change;
            


            //this.origin.offset.x.px += x_distance_to_mouse/100;
            if(this.zoom.spin > 10){
                this.zoom.spin = 7;
            }else{
                this.zoom.spin -= 1;
                if(this.zoom.spin == 0){
                    this.zoom.in.rate = 0;
                }
            }
        }else if((this.zoom.zoom_in || this.zoom.spin > 0 )){
            this.step.x.px = this.step.x.px_min;
            switch(this.step.x.unit.number){
                case 1:
                    this.step.x.unit.number *= 5;
                    this.step.x.unit.e -= 1;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                break;
                case 2:
                    this.step.x.unit.number *= 0.5;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                    
                break;
                case 5:
                    this.step.x.unit.number *= 0.4;
                    this.step.x.unit.number = round(this.step.x.unit.number)
                break;
                default:
                

            }
        }
      
    }

    // drawing functions

    draw = ()=>{
        this.update_zoom();
        
        this.update_pan();

        // drawing gridlines
            this.grid.vertical.forEach((gridline)=>{
                this.draw_gridline(gridline);
            })
            this.grid.horizontal.forEach((gridline)=>{
                this.draw_gridline(gridline);
            })



        // drawing axes
        this.draw_gridline(this.x_axis)
        this.draw_gridline(this.y_axis)

        // drawing border
        this.draw_border();

        // drawing origin
        this.draw_point(this.origin);
        

        // drawing other points
        this.points.forEach((point)=>{
            this.draw_point(point);
        })
    }

        draw_border = ()=>{
            this.ctx.strokeStyle = this.colors.border;
            this.ctx.lineWidth = this.sizes.border;
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        draw_point = (point)=>{
            
            if(
                point.x < this.m.x.min || point.x > this.m.x.max ||
                point.y > this.m.y.max || point.y < this.m.y.min
                ){return}

            let x_pos_px = this.convert_unitX_to_px(point.x);
            let y_pos_px = this.convert_unitY_to_px(point.y);

            this.ctx.beginPath();
            this.ctx.fillStyle = point.color;
            this.ctx.ellipse(x_pos_px, y_pos_px, point.size, point.size, 0, Math.PI*2,0);
            this.ctx.fill();
        }

        draw_gridline = (gridline)=>{
            if(gridline.orientation == 'vertical'){
                if(gridline.unit_value < this.m.x.max && gridline.unit_value > this.m.x.min ){
                    this.draw_vertical_gridline(gridline);
                }
                
                
            }
            else if(gridline.orientation == 'horizontal'){
                
                if(gridline.unit_value < this.m.y.max && gridline.unit_value > this.m.y.min ){
                    this.draw_horizontal_gridine(gridline); 
                }
               
            }
            

        }
            draw_vertical_gridline = (gridline)=>{
                let x_unit = gridline.unit_value;
                let x_px = this.convert_unitX_to_px(x_unit);
                let y_px = this.y;
                let y1_px = this.y1;

                this.ctx.globalAlpha = gridline.transparency;
                this.ctx.strokeStyle = gridline.color;
                this.ctx.lineWidth = gridline.lineWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(x_px, y_px);
                this.ctx.lineTo(x_px, y1_px);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;

               if(gridline.number_visible){this.draw_numbers_on_x_axis(gridline.unit_value) } // draw a number if it is visible for gridline
            }

            draw_horizontal_gridine = (gridline)=>{

                let y_unit = gridline.unit_value;
                let y_px = this.convert_unitY_to_px(y_unit);
                let x_px = this.x;
                let x1_px = this.x1;

                this.ctx.globalAlpha = gridline.transparency;
                this.ctx.strokeStyle = gridline.color;
                this.ctx.lineWidth = gridline.lineWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(x_px, y_px);
                this.ctx.lineTo(x1_px, y_px);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;

                if(gridline.number_visible){this.draw_numbers_on_y_axis(gridline.unit_value) } // draw a number if it is visible for gridline

            }

            // numbers on_x_axis go with Gridlines in this.grid.vertical[]
            draw_numbers_on_x_axis = (number = 1)=>{
                

                let numbers_off_grid = false;

                this.change_font();
                this.ctx.fillStyle = this.colors.grid_numbers;

                let number_string = Math.abs(number.toString());
                let minus_width = this.ctx.measureText('-').width;
                let number_width = this.ctx.measureText(number_string).width;

                let x_pos_px = this.convert_unitX_to_px(number) - number_width/2 ;
                if(number < 0){x_pos_px -= minus_width};
                let y_pos_px = this.convert_unitY_to_px(0) + this.font_size*1.2;

                  // keep on numbers top margin if origin is above plane's field of view
                  if(y_pos_px < this.convert_unitY_to_px(this.m.y.max) - this.font_size*0.2 - this.sizes.border){
                    y_pos_px = this.convert_unitY_to_px(this.m.y.max) - this.font_size*0.2 - this.sizes.border;
                    numbers_off_grid = true;
                }

                 // keep on numbers bottom margin if origin is under plane's field of view
                 if(y_pos_px > this.convert_unitY_to_px(this.m.y.min) + this.font_size*0.8 + this.sizes.border){
                    y_pos_px = this.convert_unitY_to_px(this.m.y.min) + this.font_size*0.8 + this.sizes.border;
                    numbers_off_grid = true;
                }

                // keep numbers on left margin if origin is off to right
                // if(x_pos_px < this.convert_unitX_to_px(this.m.x.min) - number_width*1.2){
                //     x_pos_px = this.convert_unitX_to_px(this.m.x.min) - number_width*1.2;
                // }


                if(number == 0 && (!numbers_off_grid)){return} // if zero is off the plane it is okay to draw, otherwise do not

                // make sure negative signs to mess up rect clear
                if(number < 0){number_width += minus_width}
                if(number < 1e-6 ){
                    //power_of_10 = 
                    //number = 
                }
                // if the numbers are not off the grid, and no number is outside of range then draw the number
                if((!numbers_off_grid) && (x_pos_px + number_width + this.sizes.border > this.x1 || x_pos_px < this.x + this.sizes.border)){return}else{
                    this.ctx.clearRect(x_pos_px, y_pos_px - this.font_size*0.80, number_width, this.font_size);
                    this.ctx.fillText(number, x_pos_px, y_pos_px)
                }
                
            }

            draw_numbers_on_y_axis = (number = 1)=>{

                this.change_font();
                this.ctx.fillStyle = this.colors.grid_numbers;

              
                let number_string = number.toString();
                let number_width = this.ctx.measureText(number_string).width;

                let x_location_of_string = 0
               

                let x_pos_px = this.convert_unitX_to_px(0) - number_width - this.font_size*0.4 ;
                let y_pos_px = this.convert_unitY_to_px(number) + this.font_size*0.3;

                let numbers_off_grid = false;
                // keep on numbers right margin if origin is off to right
                if(x_pos_px > this.convert_unitX_to_px(this.m.x.max) + this.font_size*0.5){
                    x_pos_px = this.convert_unitX_to_px(this.m.x.max) + this.font_size*0.5;
                    numbers_off_grid = true;
                }

                // keep numbers on left margin if origin is off to right
                if(x_pos_px < this.convert_unitX_to_px(this.m.x.min) - number_width*1 - this.font_size/2){
                    x_pos_px = this.convert_unitX_to_px(this.m.x.min) - number_width*1 - this.font_size/2
                    numbers_off_grid = true;
                }

     

                if(number == 0 && (!numbers_off_grid)){return}
                else if(y_pos_px < this.y + this.font_size || y_pos_px > this.y1){return}
                    this.ctx.clearRect(x_pos_px, y_pos_px - this.font_size*0.80, number_width, this.font_size);
                    this.ctx.fillText(number, x_pos_px, y_pos_px)
         

               
            }



    // calculate measurements
    calculate = ()=>{
    }
        change_font = (size = this.font_size, font_family = this.font_family)=>{
            this.ctx.font = size.toString()+"px " + font_family;
        }


        // converts horizontal units to pixel position (necessary to tell canvas where objects should be placed visually)
        convert_unitX_to_px = (unit)=>{
            let center_px = this.x + this.width/2;  // find center of plane in pixels
            let offset_px = this.origin.offset.x.px; // determine offset from origin in pixels
            let x_pos_px = center_px + offset_px + unit*this.step.x.px/Number(this.step.x.unit.number + "e" + this.step.x.unit.e); // calcuate unit position in pixels

            return x_pos_px;

        }

        // converts vertical units to pixel position (necessary to tell canvas where objects should be placed visually)
        convert_unitY_to_px = (unit)=>{
            let center_px = this.y + this.height/2;  // find center of plane in pixels
            let offset_px = this.origin.offset.y.px; // determine offset from origin in pixels
            let y_pos_px = center_px + offset_px - unit*this.step.y.px/Number(this.step.y.unit.number +"e"+this.step.y.unit.e); // calcuate unit position in pixels            

            return y_pos_px;
        }


        // converts horizontal pixel position to units => useful for interactive creations of objects which rely on event.clientX and event.clientY
        convert_pxX_to_unit = (px)=>{
            let center_px = this.x + this.width/2;
            let offset_px = this.origin.offset.x.px;
            let unit_x_px = center_px + offset_px;
            let difference_px = px - unit_x_px;
            let unit_x_value = this.calc_unit_value_x()
            let px_in_units = unit_x_value*difference_px/(this.step.x.px);

            return px_in_units;

        }

        // converts vertical pixel position to units => useful for interactive creations of objects which rely on event.clientX and event.clientY
        convert_pxY_to_unit = (px)=>{
            let center_px = this.y + this.height/2;
            let offset_px = this.origin.offset.y.px;
            let unit_y_px = center_px + offset_px;
            let difference_px = -(px - unit_y_px);
            let unit_y_value = this.calc_unit_value_y()
            let px_in_units = unit_y_value*difference_px/this.step.y.px;

            return px_in_units;

        }

       

        // calculates the min and max units for the plane based off of the given step, the width and height of the plane, and the origin location
        calc_m = ()=>{
          this.m.x.max = this.convert_pxX_to_unit(this.x1);
          this.m.x.min = this.convert_pxX_to_unit(this.x);

          this.m.y.max = this.convert_pxY_to_unit(this.y);
          this.m.y.min = this.convert_pxY_to_unit(this.y1);
        }

        // calculates unit value of step in px
        calc_unit_value_x = ()=>{
            let unit_x_value = this.calc_value(this.step.x.unit.number, this.step.x.unit.e)
            return unit_x_value;
        }

        // calculates unit value of step in px
        calc_unit_value_y = ()=>{
            let unit_y_value = this.calc_value(this.step.y.unit.number, this.step.y.unit.e)
            return unit_y_value;
        }


        // calculates value of object with number and e => i.e. {number: 4, e: 5} => "4e5" => Number("4e5") => 4*10^5
        // A little awkward but necessary for double float decimal percision.
            calc_value = (number, e) =>{
                let value = Number(number + "e" + e );
                return value;
            }


    // creating objects functions

    new_point = (x= 0, y = 0, color = 'red', size = 10)=>{
        let point = new Point(x, y);
        point.color = this.colors.point; // color of point
        point.size = this.sizes.point; // radius of point in px
        this.points.push(point); // pushes point to planes points array
        this.objects_receipts.push('point'); // records point object as having been created
    }


    // create gridlines using the step of the plane as well as m (measurments of min and max unit values)
    new_grid = ()=>{
        this.calc_m();

        this.grid = {
            vertical:[],
            horizontal:[]
        }



        // vertical lines
            // positive and zero
            let unit_x_value = this.calc_unit_value_x();
            

            
            for(let x = 0; x < this.m.x.max; x+= round(unit_x_value)){
                x = round(x);
                if(x>this.m.x.min){
                    this.new_gridline(x,'vertical' );
                }else{console.log('harumph!')}//do not do anything if x value is less than minimum
                
            }

            

            

            // negative
            for(let x = round(-unit_x_value); x > this.m.x.min; x-= round(unit_x_value)){
                
                if(x<this.m.x.max){
                    
                    this.new_gridline(x,'vertical' );
                }else{return}//do not do anything if x value is less than minimum
                //this.new_gridline(x,'vertical');
            }

            
            
        // horizontal lines
            // positive and zero
            let unit_y_value = this.calc_unit_value_y();
            for(let y = 0; y < this.m.y.max; y += unit_y_value ){
                y = round(y);
                this.new_gridline(y,'horizontal');
            }

            // negative
            for(let y = -unit_y_value; y > this.m.y.min; y -= unit_y_value){
                y = round(y);
                this.new_gridline(y,'horizontal');
            }



    }


        // create a new gridline -> used in function new_grid()
        new_gridline = (unit_position = 0, orientation = null, color = this.colors.grid, lineWidth = this.sizes.grid)=>{
            
           
            let gridline = new Gridline(unit_position, orientation, color);
            //gridline.color = color;
            gridline.lineWidth = this.sizes.grid;
            
            if(orientation == 'vertical'){     
               unit_position = round(unit_position, 3)   
                gridline.unit_value = round(unit_position)        
                this.grid.vertical.push(gridline)
            }
            if(orientation == 'horizontal'){
                unit_position = round(unit_position, this.step.y.unit.e + 3)   
                gridline.unit_value = unit_position;      
                this.grid.horizontal.push(gridline)
            }
        }


    // interactive functions

    control_pan_keydown = (e)=>{
        //if(this.pan.x.acceleration < 0){this.pan.x.acceleration *= -1} // switches acceleration to positive
        //if(this.pan.y.acceleration < 0){this.pan.x.acceleration *= -1} // switches acceleration to positive
        switch(e.key){
            case 'ArrowLeft':
                this.pan.brakes.x = false;
                if(this.pan.x.velocity < this.pan.x.max_velocity){
                    this.pan.x.velocity += this.pan.x.acceleration
                }else{this.pan.x.velocity = this.pan.x.max_velocity}
            break;

            case 'ArrowRight':
                this.pan.brakes.x = false;
                if(this.pan.x.velocity > -1*this.pan.x.max_velocity){
                    this.pan.x.velocity -= this.pan.x.acceleration
                }else{this.pan.x.velocity = this.pan.x.max_velocity*-1}
            break;

            case 'ArrowUp':
                this.pan.brakes.y = false;
                if(this.pan.y.velocity > -1*this.pan.y.max_velocity){
                    this.pan.y.velocity -= this.pan.y.acceleration;
                }else{this.pan.y.velocity = this.pan.y.max_velocity*-1}
            break;

            case 'ArrowDown':
                this.pan.brakes.y = false;
                if(this.pan.y.velocity < this.pan.y.max_velocity){
                    this.pan.y.velocity += this.pan.y.acceleration;
                }else{this.pan.y.velocity = this.pan.y.max_velocity}
            break;
            default:
        }
       
    }

    control_pan_keyup = (e)=>{
        //if(this.pan.x.acceleration > 0){this.pan.x.acceleration *= -1}// switches accleration to negative
        //if(this.pan.y.acceleration > 0){this.pan.x.acceleration *= -1} // switches acceleration to negative

        switch(e.key){
            case 'ArrowLeft':
                this.pan.brakes.x = true;
            break;
            case 'ArrowRight':
                this.pan.brakes.x = true;
            break;
            case 'ArrowUp':
                this.pan.brakes.y = true;
            break;
            case 'ArrowDown':
                this.pan.brakes.y = true;
            break;
            default:
        }
    }

    zoom_out_keydown = (e)=>{
        // work on zoom
        // this.step.x.px -= .1;
        // this.step.y.px -= .1;
        if(e.key == '['){
            this.zoom.zoom_in = false;
            if(this.zoom.out.rate < this.zoom.out.max_rate){
                this.zoom.zoom_out = true;
                this.zoom.out.rate += this.zoom.out.acceleration*this.dt/16;
            }
            
        }
    }

    

    zoom_out_keyup = (e)=>{
        if(e.key == '['){
            this.zoom.zoom_out = false;
            this.zoom.out.rate = 1;
        }
    }

    zoom_in_keydown = (e)=>{
        
        // work on zoom
        // this.step.x.px -= .1;
        // this.step.y.px -= .1;
        if(e.key == ']'){
            
            this.zoom.zoom_out = false;
            if(this.zoom.in.rate < this.zoom.in.max_rate){
                this.zoom.zoom_in = true;
                this.zoom.in.rate += this.zoom.out.acceleration*this.dt/16
            }
            
        }
    }

    zoom_in_keyup = (e)=>{
        if(e.key == ']'){
            this.zoom.zoom_in = false;
            this.zoom.in.rate = 1;
        }
    }

    // event listener stuff
    add_all_event_listeners = ()=>{
        // this.event_listeners.forEach((listener_type_list)=>{
            
        // })
    }

    add_keydown_listener = (listener = this.keydown_message)=>{
        this.canvas.addEventListener('keydown', listener)
    }
        keydown_message = (e)=>{console.log('/////////////// keydown, e.key == ' + e.key )}

    add_keyup_listener = (listener = this.keyup_message)=>{
        this.canvas.addEventListener('keyup', listener)
    }
        keyup_message = (e)=>{console.log('///////////////keyup, e.key == ' + e.key)}
    



}



// sub classes
class Point{
    constructor(x = 0, y = 0){

        // position in units
        this.x = x;
        this.y = y;

        // boolean
        this.is_mouse_on = false;
        this.is_selected = false;
        this.is_label_visible = false; 
        // appearance
        this.color = 'red';
        this.size = 5;

    }
}

class Origin extends Point{
    constructor(origin_size = 10, origin_color = 'yellow'){
        super(0,0);
        this.offset = {
            x:{px:0, units:0},
            y:{px:0, units:0},
        }
        this.size = origin_size;
        this.color = origin_color;
    }
}

class Line{
    constructor(m = 0, b = 0){

        // slope (m) and y value of y-intercept (b)
        this.m = m;
        this.b = b;

        // appearacne
        this.color = 'red';
        this.lineWidth = 3;
    }
}

class Gridline extends Line{
    constructor(unit_value, orientation, color = 'red'){
        super();

        // special values
        this.unit_value = unit_value;
        this.orientation = orientation;
        this.transparency = 1;
        this.number_visible = true;

        // appearance
        this.is_major = false;
        this.order_of_magnitude = false;
        this.color = color;
    
        // appearance
        this.lineWidth = 1;
       


    }
}

class Axis extends Gridline{
    constructor(type, color = 'red'){
        super(0, 'null' , color);
        this.type = type;
        
        if(type == 'x'){
            this.orientation = 'horizontal'
        }
        else if(type == 'y'){
            this.orientation = 'vertical'
        }

        

        // axis specific qualities
        this.numbers_visible = true;
        this.arrow_heads_visible = false;
        this.lineWidth = 5;
        
    }
}

export {Coordinate_Plane};