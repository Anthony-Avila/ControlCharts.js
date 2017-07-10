<?php

#/////////////////////////////////////////////
# Quickly little PHP script to generate some 
# (bogus) measurement data for the iPod.
#/////////////////////////////////////////////

function iPodData()
{

$dims = Array();
$vals = Array();
$dims[0]  = Array("ChartID"=>"ChartA1","Label"=>"Product Height",	"Nom"=>"4.100","Max"=>"4.101","Min"=>"4.099","Vals"=>$vals);
$dims[1]  = Array("ChartID"=>"ChartA2","Label"=>"Product Width",	"Nom"=>"2.400","Max"=>"2.401","Min"=>"2.399","Vals"=>$vals);
$dims[2]  = Array("ChartID"=>"ChartA3","Label"=>"Screen Height",	"Nom"=>"1.500","Max"=>"1.501","Min"=>"1.499","Vals"=>$vals);
$dims[3]  = Array("ChartID"=>"ChartA4","Label"=>"Screen Center",	"Nom"=>"3.100","Max"=>"3.200","Min"=>"3.000","Vals"=>$vals);
$dims[4]  = Array("ChartID"=>"ChartB1","Label"=>"Wheel Center",		"Nom"=>"1.200","Max"=>"1.210","Min"=>"1.190","Vals"=>$vals);
$dims[5]  = Array("ChartID"=>"ChartB2","Label"=>"Wheel Outside Dia",	"Nom"=>"1.400","Max"=>"1.420","Min"=>"1.380","Vals"=>$vals);
$dims[6]  = Array("ChartID"=>"ChartB3","Label"=>"Wheel Inside Dia",	"Nom"=>"0.600","Max"=>"0.601","Min"=>"0.599","Vals"=>$vals);
$dims[7]  = Array("ChartID"=>"ChartB4","Label"=>"Product Radius A",	"Nom"=>"0.200","Max"=>"0.220","Min"=>"0.180","Vals"=>$vals);
$dims[8]  = Array("ChartID"=>"ChartC1","Label"=>"Product Radius B",	"Nom"=>"0.200","Max"=>"0.220","Min"=>"0.180","Vals"=>$vals);
$dims[9]  = Array("ChartID"=>"ChartC2","Label"=>"Product Radius C",	"Nom"=>"0.200","Max"=>"0.220","Min"=>"0.180","Vals"=>$vals);
$dims[10] = Array("ChartID"=>"ChartC3","Label"=>"Product Radius D",	"Nom"=>"0.200","Max"=>"0.220","Min"=>"0.180","Vals"=>$vals);


$x = 0;
foreach ( $dims as $dim )
{
  $tol_range = ($dim["Max"] - $dim["Min"]) * 0.8;
  $variation_percent = rand(12, 45)/100;
  $variation = $tol_range * $variation_percent;

  $min = $dim["Nom"] - ($variation/1);
  $max = $dim["Nom"] + ($variation/1);
  $process_center = mt_rand($min*1000, $max*1000) / 1000;

  $max_var = ($dim["Max"] - $dim["Min"])/2;
 

  $f = Array();

  for ( $i = 0; $i < 30; $i++ )
  {
    $f[$i] = mt_rand($min*10000, $max*10000) / 10000;
  }

  $dims[$x]["Vals"] = $f;
  $x++;

}

$json = Array("Part Number"=>"iPod Finished Product","Revision"=>"A","Machine"=>"101","Dimensions"=>$dims);
echo json_encode($json);
}


function GetRandomData($n)
{
  $dims = Array();
  $vals = Array();
  for ( $i = 0; $i < $n; $i++ )
  {
    $dims[$i] = Array("ChartID"=>"Chart{$i}","Label"=>"Feature Number {$i}",	"Nom"=>"0.200","Max"=>"0.220","Min"=>"0.180","Vals"=>$vals);
  }

$x = 0;
foreach ( $dims as $dim )
{
  $tol_range = ($dim["Max"] - $dim["Min"]) * 0.8;
  $variation_percent = rand(12, 45)/100;
  $variation = $tol_range * $variation_percent;

  $min = $dim["Nom"] - ($variation/1);
  $max = $dim["Nom"] + ($variation/1);
  $process_center = mt_rand($min*1000, $max*1000) / 1000;

  $max_var = ($dim["Max"] - $dim["Min"])/2;
 

  $f = Array();

  for ( $i = 0; $i < 30; $i++ )
  {
    $f[$i] = mt_rand($min*10000, $max*10000) / 10000;
  }

  $dims[$x]["Vals"] = $f;
  $x++;

}

$json = Array("Part Number"=>"Random-Gen-Part","Revision"=>"A","Machine"=>"101","Dimensions"=>$dims);
echo json_encode($json);

}

switch($_GET['p'])
{
  case "ipod": iPodData(); break;
  case "large": GetRandomData(100); break;
}


?>