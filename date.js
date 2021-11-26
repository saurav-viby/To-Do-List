exports.getDate=function() {

  const today = new Date();


const dOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

const day = today.toLocaleDateString("en-US", dOptions);

return day;

}
exports.getDay=function () {

  const today = new Date();


  const dOptions = {
    weekday: "long",

  };

  var day = today.toLocaleDateString("en-US", dOptions);

return day;

}
