# ControlCharts.js
**ControlCharts.js** is a lightweight JavaScript Library for creating interactive Control Charts. Unable to find any existing JavaScript 
charting libraries that offered the look and feel of my favorite Desktop SPC application, I decided to start working on my own. This 
project is currently still in development, but this version does work (with very few features) and may be useful in your projects.

# Documentation
Solid documenation still needs to be built, but isn't worth working on yet as I still plan to add several more options to the Control 
Charts. For now, this library can be played with by doing the following:

#### Add the Library to HEAD
```
<script src="controlchart.js"></script>
```
#### Add a DIV for the Control Chart
```
<DIV ID="Chart1" style="position: relative;"></DIV>
```

#### Add JS somewhere after DIV
```
<SCRIPT>
  Chart1 = new ControlChart({
    ChartID: "Chart1", 
    DivID: "Chart1", 
    Label: "Feature # 1", 
    Nominal: 1.555, 
    UpperLimit: 1.570, 
    LowerLimit: 1.540, 
    ChartWidth: 440, 
    ChartHeight: 240
  });
  Chart1.AddMeasurements([1.5617,1.5668,1.5639,1.5546,1.5574,1.5646,1.5600]);
</SCRIPT>
```

# Version: 1.0
This is only my initial code, proving the concept of Interactive Control Charts in JavaScript. It is mostly proof of UI 
and offers no value other than displaying data (the interactivity is tied to no function(s) yet).

# Known Bugs
There is a bug when HighLighting chart data, the highlighted points will be correct, but the line outside the hightlight will 
still change color. There is an off-by-one error somewhere.. 

# To-Do List for Next Version
1. Fix Line Color HighLight Bug
2. Add Options for Customizing Chart Colors
3. Add Options for Customizing Control Limit %'s
4. Allow Max/Min, and Nom +/- tolerance modes
5. Add Functionality to the hightlight feature
6. Refactor Code
