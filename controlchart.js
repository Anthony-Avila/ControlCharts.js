//////////////////////////////////////////////
/// ControlCharts.js
///----------------------
/// Version: 1.1 (Beta)
///----------------------
/// This JavaScript Library is used for creating 
/// Control Charts using SVG elements. This file has
/// two sections:
/// (1) Global Variables & Function
/// (2) The ControlChart object



//////////////////////////////////////////////
//// (1) Global Variables & Functions

var mousedown = 0;
var ControlChartIndex = Array();
var mousedown_target;

function CCJS_ClearCharts(chart_id_excp)
{
  for ( i in ControlChartIndex )
  {
  	if ( ControlChartIndex[i] == chart_id_excp )
  	{
  		//nothing
  	} else { window[ControlChartIndex[i]].EraseOverlay();
  			 window[ControlChartIndex[i]].EraseHL();
    }
  }
}

//////////////////////////////////////////////
//// (2) The ControlChart object

var ControlChart = function (objIni) {
  //Required Paramaters
  this.ID            = objIni.ChartID;
  this.DIV           = objIni.DivID;
  this.Label         = objIni.Label;
  this.Nominal       = objIni.Nominal;
  this.MaxTolerance  = objIni.UpperLimit;
  this.MinTolerance  = objIni.LowerLimit;
  this.Width         = objIni.ChartWidth;
  this.Height        = objIni.ChartHeight;
  this.output        = "";
  this.sticky        = 0;
  this.stickypos     = -1;
  this.selected_pt1  = 0;
  this.selected_pt2  = 0;
  this.mousedown     = 0;
  this.points        = Array();
  this.values        = Array();
  ControlChartIndex[ControlChartIndex.length] = objIni.ChartID;

  if ( objIni.SelectionHook ) {
    this.SelectionHook = objIni.SelectionHook;
  }

};

ControlChart.prototype.AddMeasurement = function(val) {
  this.points[this.points.length] = this.TranslateValue(val);
  this.values[(this.points.length-1)] = parseFloat(val);
  this.GenerateChart();
  this.DrawChart();
}

ControlChart.prototype.AddMeasurements = function(vals) {
  for ( val in vals )
  {
    this.points[this.points.length] = this.TranslateValue(vals[val]);
    this.values[(this.points.length-1)] = parseFloat(vals[val]);
  }
  this.GenerateChart();
  this.DrawChart();
}

ControlChart.prototype.GenerateChart = function() {
	var svg_img = "";
	
	switch(true)
	{
		case ( this.Width > 1000 ): txt_size = 50; break;
		case ( this.Width <= 1000 && this.Width > 500 ): txt_size = 25; break;
		case ( this.Width <= 500 && this.Width > 300 ): txt_size = 15; break;
		case ( this.Width < 300 ): txt_size = 10; break;
		default: txt_size = 10; break;
	}

	pad = this.Height / 100;
    region = this.Height * 0.4;
    clo = region * 0.8; //I Like 80% control limits..
    chart_ys = new Array();
    chart_ys['nom'] = this.Height / 2;
    chart_ys['usl'] = this.Height / 10;
    chart_ys['lsl'] = this.Height - (this.Height / 10);
    chart_ys['ucl'] = (this.Height / 2)-clo;
    chart_ys['lcl'] = (this.Height / 2)+clo

	//Start Container
	label_y = chart_ys['usl'] - pad*2;
	svg_img += "<svg ID=\""+this.DIV+"\" width=\""+this.Width+"\" height=\""+this.Height+"\" style=\"border: 1px solid black;background: transparent;\">";
	svg_img += "<text font-size=\""+txt_size+"\" x=\"10\" y=\""+label_y+"\" fill=\"white\">"+this.Label+"</text>";

	//Upper Limit
	max_text_y  = chart_ys['usl'] + ((txt_size+pad)*0.8);
	max_limit_y = chart_ys['usl'];
	max_ctrl_y  = chart_ys['ucl'];
	svg_img += "<text font-size=\""+txt_size+"\" x=\"10\" y=\""+max_text_y+"\" fill=\"white\">"+this.MaxTolerance+"</text>";
	svg_img += "<line   x1=\"0\" y1=\""+max_limit_y+"\"  x2=\""+this.Width+"\" y2=\""+max_limit_y+"\" stroke=\"red\" stroke-width=\"1\" \/>";
	svg_img += "<line   x1=\"0\" y1=\""+max_ctrl_y+"\"  x2=\""+this.Width+"\" y2=\""+max_ctrl_y+"\" stroke=\"yellow\" stroke-width=\"1\" stroke-dasharray=\"5,5\" \/>";

	//Nominal
	nom_text_y  = (this.Height / 2)  + ((txt_size+pad)*0.8);
	nom_limit_y = chart_ys['nom']; //this.Height / 2;
	svg_img += "<text font-size=\""+txt_size+"\" x=\"10\" y=\""+nom_text_y+"\" fill=\"white\">"+this.Nominal+"</text>";
	svg_img += "<line   x1=\"0\" y1=\""+nom_limit_y+"\" x2=\""+this.Width+"\" y2=\""+nom_limit_y+"\" stroke=\"yellow\" stroke-width=\"1\" \/>";
	svg_img += "<line   x1=\"0\" y1=\""+nom_limit_y+"\" x2=\""+this.Width+"\" y2=\""+nom_limit_y+"\" stroke=\"#00CC66\" stroke-width=\"1\" stroke-dasharray=\"5,10,10,10\" \/>";

	//Lower Limit
	low_text_y  = chart_ys['lsl'] + ((txt_size+pad)*0.8);
	low_limit_y = chart_ys['lsl'];
	low_ctrl_y  = chart_ys['lcl'];
	svg_img += "<text font-size=\""+txt_size+"\" x=\"10\" y=\""+low_text_y+"\" fill=\"white\">"+this.MinTolerance+"</text>";
	svg_img += "<line   x1=\"0\" y1=\""+low_ctrl_y+"\" x2=\""+this.Width+"\" y2=\""+low_ctrl_y+"\" stroke=\"yellow\" stroke-width=\"1\" stroke-dasharray=\"5,5\" \/>";
	svg_img += "<line   x1=\"0\" y1=\""+low_limit_y+"\" x2=\""+this.Width+"\" y2=\""+low_limit_y+"\" stroke=\"red\" stroke-width=\"1\" \/>";

	xpos = 5;
	pt_offset = this.Width / this.points.length;

	for (point in this.points)
	{

		svg_img += "<a style=\"cursor: pointer;\" onmouseover=\"javascript: "+this.ID+".overlay_line('"+xpos+"', "+(Number(point)+1)+");\" onmousedown=\""+this.ID+".click_point('"+xpos+"', "+(Number(point)+1)+");\">";
		svg_img += "<rect x=\""+(xpos-(pt_offset/2))+"\" y=\"0\" fill=\"#fff\" opacity=\"0\" width=\""+pt_offset+"\" height=\""+this.Height+"\" \/>";
		svg_img += "<circle cx=\""+xpos+"\" cy=\""+this.points[point]+"\" r=\"4\" stroke=\"white\" stroke-width=\"1\" fill=\"white\" id=\""+this.ID+"_plot_point_"+Number(point)+"\" onclick=\"\" \/>";
		svg_img += "</a>";

		if (xpos > 5)
		{
			svg_img += "<line   x1=\""+(xpos-pt_offset)+"\" y1=\""+prevy+"\" x2=\""+xpos+"\" y2=\""+this.points[point]+"\" stroke=\"white\" stroke-width=\"1\" id=\""+this.ID+"_plot_line_"+Number(point)+"\" \/>";
		}

		prevy = this.points[point];
		xpos = xpos + pt_offset;
	}
	
	//End Container
	svg_img += "</svg>";


    chart_html  = "<DIV ID=\""+this.DIV+"_Container\" style=\"position: relative;height: "+this.Height+"px;width: "+this.Width+"px;\" onmouseout=\"CCJS_ClearCharts('"+this.ID+"')\">";
    chart_html += "  <DIV ID=\""+this.DIV+"_ChartContainer\" style=\"position: absolute;\">"+svg_img+"</DIV>";
    chart_html += "  <DIV ID=\""+this.DIV+"_ChartContainerOverlay\" style=\"position: absolute;z-index: -1;\">";
    chart_html += "    <svg ID=\""+this.DIV+"_ChartOverlay\" width=\""+this.Width+"\" height=\""+this.Height+"\" style=\"border: 1px solid black;background: green;opacity: 100;\">";
    chart_html += "    </svg>";
    chart_html += "  </DIV>";
    chart_html += "</DIV>";

	this.output = chart_html;
};

ControlChart.prototype.overlay_line = function(xpos, rec) {
  this.sticky = rec;
  this.selected_pt2 = rec;
  tst_chart = document.getElementById(this.DIV+"_ChartOverlay");
  this.EraseOverlay();


  if ( this.stickypos != -1 || (this.mousedown==1) )
  {
    this.EraseHL();
    hlStart = Number(this.selected_pt1);
    hlEnd = rec;
    pt_offset = this.Width / this.points.length;

    if ( hlEnd > hlStart )
    {
        hlRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        hlRect.setAttribute('id', this.ID+'_overlay_hl');
        hlRect.setAttribute('x', (((hlStart-1)*pt_offset)+6));
        hlRect.setAttribute('y', 0);
        hlRect.setAttribute('width', (pt_offset * (hlEnd-hlStart)) );
        hlRect.setAttribute('height', this.Height);
        hlRect.setAttribute('fill', "#ff7fff");
        tst_chart.appendChild(hlRect);
    }

    if ( hlEnd < hlStart )
    {
        hlRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        hlRect.setAttribute('id', this.ID+'_overlay_hl');
        hlRect.setAttribute('x', ((rec-1)*pt_offset)+6);
        hlRect.setAttribute('y', 0);
        hlRect.setAttribute('width', (pt_offset * (hlStart-hlEnd)) );
        hlRect.setAttribute('height', this.Height);
        hlRect.setAttribute('fill', "#ff7fff");
        tst_chart.appendChild(hlRect);
	}

    for ( point in this.points )
    {
      if ( ((point >= hlEnd) && (point <= hlStart)) || ((point <= hlEnd) && (point >= hlStart)))
      {
        if (((point <= hlEnd) && (point >= hlStart)))
        {
          pid = this.ID+"_plot_point_"+(point-1)+"";
		  lid = this.ID+"_plot_line_"+(point+1)+"";
		  if ( point>hlStart )
		  {
		    lid = this.ID+"_plot_line_"+(point-1)+"";
		  }
		  if ( point<hlStart )
		  {
            lid = this.ID+"_plot_line_"+(point+1)+"";
		  }
		}

		if ( ((point >= hlEnd) && (point <= hlStart)) )
		{
          pid = this.ID+"_plot_point_"+(point-1)+"";
          lid = this.ID+"_plot_line_"+(point)+"";
        } 

        if ( document.getElementById(pid) )
        {
          document.getElementById(pid).style.fill = "black";
          document.getElementById(pid).style.stroke = "black";
        }

        if ( document.getElementById(lid) )
        {
          document.getElementById(lid).style.stroke = "black";
        }
	  } else {
          pid = this.ID+"_plot_point_"+point+"";
          lid = this.ID+"_plot_line_"+point+"";

          if ( document.getElementById(pid) )
          {
            document.getElementById(pid).style.fill = "white";
            document.getElementById(pid).style.stroke = "white";
          }
          if ( document.getElementById(lid) )
          {
            document.getElementById(lid).style.stroke = "white";
          }
	  }
	}

    if ( rec == this.points.length )
    {	
      pid = this.ID+"_plot_point_"+Number(this.points.length - 1);
      lid = this.ID+"_plot_line_"+Number(this.points.length - 1);
      document.getElementById(pid).style.fill = "black";
      document.getElementById(pid).style.stroke = "black";
      document.getElementById(lid).style.stroke = "black";
    }
  }
  newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  newLine.setAttribute('id', this.ID+'_overlay_line');
  newLine.setAttribute('x1', xpos);
  newLine.setAttribute('x2', xpos);
  newLine.setAttribute('y1', 0);
  newLine.setAttribute('y2', this.Height);
  newLine.setAttribute('rendering', "crispEdges");
  newLine.setAttribute('stroke', "red");
  newLine.setAttribute('stroke-width', 2);
  tst_chart.appendChild(newLine);
}

ControlChart.prototype.click_point = function(x, p) {
	//alert("clicked: " + p );
	if ( this.sticky == 0 ) {
		this.sticky = p;
		this.stickypos = x;
		this.selected_pt1 = p;
		this.selected_pt2 = "";
	} else {

		//alert("selected range: " + this.sticky + " - " + p);
		this.selected_pt1 = this.sticky;
		this.selected_pt2 = p;
		this.sticky = 0;
		this.stickypos = -1;
	}

}

ControlChart.prototype.DrawChart = function(x, p) {
	this.GenerateChart();
	document.getElementById(this.DIV).innerHTML = this.output;

	document.getElementById(this.DIV).onmousedown = function(event) { 
		mousedown_target = event.target.parentNode.parentNode.id;
		window[mousedown_target].EraseHL();
		//Chart1.EraseHL();
		window[mousedown_target].mousedown = 1;
	}

	document.getElementById(this.DIV).onmouseup	  = function() { 
		window[mousedown_target].mousedown = 0;
		window[mousedown_target].stickypos=-1;
		window[mousedown_target].sticky=0;
		window[mousedown_target].SelectionHook();
	}
}

ControlChart.prototype.EraseOverlay = function() {
	if ( oldLine = document.getElementById(this.ID+"_overlay_line") ) {
		document.getElementById(this.DIV+"_ChartOverlay").removeChild(oldLine);
	}
}

ControlChart.prototype.EraseHL = function() {
	if ( oldHL = document.getElementById(this.ID+"_overlay_hl") ) {
		document.getElementById(this.DIV+"_ChartOverlay").removeChild(oldHL);
	}

	for ( i=0; i<this.points.length;i++ )
	{
		pid = this.ID+"_plot_point_"+i+"";
		lid = this.ID+"_plot_line_"+i+"";
		document.getElementById(pid).style.fill = "white";
		document.getElementById(pid).style.stroke = "white";
		if ( document.getElementById(lid) )
		{
			document.getElementById(lid).style.stroke = "white";
		}

	}
}

ControlChart.prototype.TranslateValue = function(ActualMeasurement)
{
	offset = this.Height*0.1;
	working_height = this.Height*0.8;
	ypixel = 0;

	if ( ActualMeasurement > this.Nominal )
	{
		PercentFromNominal = (ActualMeasurement - this.Nominal) / (this.MaxTolerance - this.Nominal);
		ypixel = ((working_height/2) - ((working_height/2) * PercentFromNominal));

	} else if (ActualMeasurement < this.Nominal)
	{
		PercentFromNominal = (this.Nominal - ActualMeasurement) / (this.Nominal - this.MaxTolerance);
		ypixel = ((working_height/2) + ((working_height/2) * (PercentFromNominal * -1)));

	} else if (ActualMeasurement == this.Nominal)
	{
		PercentFromNominal = 0;
		ypixel = (working_height/2);
	}

	ypixel = Math.round(ypixel+offset);

	return ypixel;
}