//////////////////////////////////////////////
/// SPCTools.js
///------------------
/// This JavaScript Library is used for performing 
/// stats/calculations on data for SPC Purposes

var SPCTools = function () {
  //Required Paramaters
  this.Precision = 4;
};

SPCTools.prototype.GetSum = function(vals) {
  sum = 0;
  for (val in vals)
  {
    sum += vals[val];
  }
  return sum;
}

SPCTools.prototype.GetAverage = function(vals) {
  sum = 0;
  for (val in vals)
  {
    sum += vals[val];
  }
  return sum / vals.length;
}

SPCTools.prototype.GetMax = function(vals) {
  return Math.max.apply(Math, vals);
}

SPCTools.prototype.GetMin = function(vals) {
  return Math.min.apply(Math, vals);
}

SPCTools.prototype.GetRange = function(vals) {
  return this.GetMax(vals)-this.GetMin(vals);
}

SPCTools.prototype.GetStDev = function(vals) {
  dev = 0;
  sum = 0;
  for(val in vals)
  {
    sum += vals[val];
  }
  mean = sum / vals.length;
  for(val in vals)
  {

    dev += Math.pow(vals[val] - mean, 2);
  }
  r = Math.sqrt(dev / (vals.length - 1));
  return r;
}

SPCTools.prototype.GetCpk = function(usl, lsl, vals) {
  avg  = this.GetAverage(vals);
  st_dev = this.GetStDev(vals);
    
  cpku = (usl - avg) / (3 * st_dev);
  cpkl = (avg - lsl) / (3 * st_dev);
    
  cpka = Math.min(cpku, cpkl);
    
  if ( cpka == Number.POSITIVE_INFINITY || cpka == Number.NEGATIVE_INFINITY) {
    cpka = 999.99;
  } else {
    cpka = this.ToFixed(cpka, 2);
  }

  return cpka;
}

SPCTools.prototype.ToFixed = function(value, places)
{
  n = Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
  s = n.toString();
  if (s.indexOf('.') == -1) s += '.';
  while (s.length < s.indexOf('.') + places) s += '0';
  return s;
}