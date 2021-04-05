class Coordinate_Plane{
    constructor(ctx){
        ////////////////////////////////////////////////////
        // assets
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;

        ////////////////////////////////////////////////////
        // properties
        this.x = 100;
        this.x1 = 800;
        this.y = 100;
        this.y1 = 800;

        this.step = {
            x:{unit: {number: 10, e:0}, px: 100},
            y:{unit: {number:10, e:0}, px: 100}
        }

        this.width = this.x1 - this.x;
        this.height = this.y1 - this.y;


        // measurments
        this.m = {
            x:{max:0, min: 0},
            y:{max:0, min:0}
        }

        ///////////////////////////////////////////////////
        // appearance

        this.palette = {
            white: '#eee',
            dark_gray: '#333',
            sky: 'rgb(50, 220, 250)',
            orange: 'rgb(220,150,50)',

            white_faded: 'rgba(255,255,255,.4)'
        } 

        // colors
        this.colors = {
            border: this.palette.white,
            point: this.palette.sky,
            origin: this.palette.orange,
            grid: this.palette.white_faded
        }

        // linewidths
        this.sizes = {
            border: 7, // width of border in px
            point: 10,  // radius of point in px
            origin: 15,
            grid: 2, // pixels
        }

        // sizes
        

        ///////////////////////////////////////////////////
        // objects

        this.origin = new Origin(this.sizes.origin, this.colors.origin)
        this.origin.offset.x.px = -130;

        this.grid = {
            vertical:[],
            horizontal:[]
        }

        this.points = [];
        this.selected_points = [];

        this.objects_receipts = [];

        this.calc_m();

        
        

        
       
        //this.new_gridline(0,'horizontal');
        this.new_grid();
        this.new_point(5,5);
        this.draw();

        //console.log(this.grid.horizontal[0])
        console.log(this.m)
        console.log(this.grid)

        this.grid.horizontal[4].unit_value = 5;
        this.grid.horizontal[4].color = this.colors.grid;

       

    }

    // drawing functions

    draw = ()=>{
        this.grid.vertical.forEach((gridline)=>{
            this.draw_gridline(gridline);
        })
        this.grid.horizontal.forEach((gridline)=>{
            this.draw_gridline(gridline);
        })
        //this.draw_gridline();
        this.draw_border();
        this.draw_point(this.origin);
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

            let x_pos_px = this.convert_unitX_to_px(point.x);
            let y_pos_px = this.convert_unitY_to_px(point.y);

            this.ctx.beginPath();
            this.ctx.fillStyle = point.color;
            this.ctx.ellipse(x_pos_px, y_pos_px, point.size, point.size, 0, Math.PI*2,0);
            this.ctx.fill();
        }

        draw_gridline = (gridline)=>{
            //console.log(gridline.unit_value)
            if(gridline.orientation == 'vertical'){
                this.draw_vertical_gridline(gridline);
            }
            else if(gridline.orientation == 'horizontal'){
                this.draw_horizontal_gridine(gridline);
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
            }

            draw_horizontal_gridine = (gridline)=>{
                console.log('drawing horizontal')
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
            }


    // calculate measurements
    calculate = ()=>{
    }

        convert_unitX_to_px = (unit)=>{
            let center_px = this.x + this.width/2;
            let offset_px = this.origin.offset.x.px;
            let x_pos_px = center_px + offset_px + unit*this.step.x.px/Number(this.step.x.unit.number + "e" + this.step.x.unit.e);

            return x_pos_px;

        }

        convert_unitY_to_px = (unit)=>{
            let center_px = this.y + this.height/2;
            let offset_px = this.origin.offset.y.px;
            let y_pos_px = center_px + offset_px - unit*this.step.y.px/Number(this.step.y.unit.number +"e"+this.step.y.unit.e);
            //let x_pos_px = center_px + offset_px + unit*this.step.x.px/Number(this.step.x.unit.number + "e" + this.step.x.unit.e);
            

            return y_pos_px;
        }

        convert_pxX_to_unit = (px)=>{
            let center_px = this.x + this.width/2;
            let offset_px = this.origin.offset.x.px;
            let unit_x_px = center_px + offset_px;
            let difference_px = px - unit_x_px;
            let unit_x_value = this.calc_unit_value_x()
            let px_in_units = unit_x_value*difference_px/(this.step.x.px);

            return px_in_units;

        }

        convert_pxY_to_unit = (px)=>{
            let center_px = this.y + this.height/2;
            let offset_px = this.origin.offset.y.px;
            let unit_y_px = center_px + offset_px;
            let difference_px = -(px - unit_y_px);
            let unit_y_value = this.calc_unit_value_y()
            let px_in_units = unit_y_value*difference_px/this.step.y.px;

            return px_in_units;

        }

       

        calc_m = ()=>{
          this.m.x.max = this.convert_pxX_to_unit(this.x1);
          this.m.x.min = this.convert_pxX_to_unit(this.x);

          this.m.y.max = this.convert_pxY_to_unit(this.y);
          this.m.y.min = this.convert_pxY_to_unit(this.y1);
        }

        calc_unit_value_x = ()=>{
            let unit_x_value = this.calc_value(this.step.x.unit.number, this.step.x.unit.e)
            return unit_x_value;
        }

        calc_unit_value_y = ()=>{
            let unit_y_value = this.calc_value(this.step.y.unit.number, this.step.y.unit.e)
            return unit_y_value;
        }
    

            calc_value = (number, e) =>{
                let value = Number(number + "e" + e );
                return value;
            }


    // creating objects functions

    new_point = (x= 0, y = 0, color = 'red', size = 10)=>{
        let point = new Point(x, y);
        point.color = this.colors.point;
        point.size = this.sizes.point;
        this.points.push(point);
        this.objects_receipts.push('point');
    }

    new_grid = (step = this.step)=>{
        let x_max = this.m.x.max;
        let x_min = this.m.x.min;
        let y_max = this.m.y.max;
        let y_min = this.m.y.min;

        // vertical lines
            // positive and zero
            let unit_x_value = this.calc_unit_value_x();
            for(let x = 0; x < this.m.x.max; x+= unit_x_value){
                this.new_gridline(x,'vertical' );
            }
            // negative
            for(let x = -unit_x_value; x > this.m.x.min; x-= unit_x_value){
                this.new_gridline(x,'vertical');
            }
        // horizontal lines
            // positive and zero
            let unit_y_value = this.calc_unit_value_y();
            for(let y = 0; y < this.m.y.max; y += unit_y_value ){
                this.new_gridline(y,'horizontal');
            }
            // negative
            for(let y = -unit_y_value; y > this.m.y.min; y -= unit_y_value){
                this.new_gridline(y,'horizontal');
            }
    }

        new_gridline = (unit_position = 0, orientation = null, color = this.colors.grid, lineWidth = this.sizes.grid)=>{
            let gridline = new Gridline(unit_position, orientation, color);
            //gridline.color = color;
            gridline.lineWidth = this.sizes.grid;
            
            if(orientation == 'vertical'){
                this.grid.vertical.push(gridline)
            }
            if(orientation == 'horizontal'){
                this.grid.horizontal.push(gridline)
            }
        }


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

        // appearance
        this.is_major = false;
        this.order_of_magnitude = false;
        this.color = color;
    
        // appearance
        this.lineWidth = 1;
       


    }
}

export {Coordinate_Plane};