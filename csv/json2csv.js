

var json2csv = function (data) {
  var keys = [];
  var res = '';
  var getKeys = function (data) {
    Object.keys(data).forEach(key => {
      //we dont need array indices or the children field
      if (!(data instanceof Array) && !keys.includes(key) && key !== 'children') {
        keys.push(key);
      }
      if (typeof data[key] === 'object') {
        getKeys(data[key]);
      }
    });
  };
  //get all the keys
  getKeys(data);
  //put the keys on the first line
  var id = 0;
  res += 'id,parentId'
  for (var i = 0; i < keys.length; i++) {
    res += ',' + keys[i];
  }
  res += '\n';
  //recursively get all the values from the json
  var getValues = function (data, parentId) {
    res += id + ',';
    var curId = id;
    id++;
    if(parentId !== undefined) {
      res += parentId;
    }
    res += ',';
    for(var i = 0; i < keys.length; i++) {
      //if a key is undefined, leave it blank
      if(data[keys[i]]) {
        res += data[keys[i]];
      }
      //dont put a comma after the last value
      if(i < keys.length - 1) {
        res += ',';
      }
    }
    res += '\n';
    //recurse on children
    if(data.children) {
      for(var j = 0; j < data.children.length; j++) {
        getValues(data.children[j], curId);
      }
    }

  }
  getValues(data);
  return res;
};



module.exports = json2csv;