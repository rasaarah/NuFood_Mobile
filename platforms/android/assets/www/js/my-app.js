var myApp;
var a; 
var e;

 myApp = new Framework7({
    animateNavBackIcon:true,
        precompileTemplates: true,
    template7Pages: true,
    template7Data: a
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
  
  });

$$('.open-right-panel').on('click', function(e) {
    myApp.openPanel('right');
});

$$('.panel-close').on('click', function(e) {
    myApp.closePanel();
});

$(function() {

// ================================= index button disabled ===========================================
   
// var d = new Date();
// var month = d.getMonth()+1;
// var day = d.getDate();

// var output = d.getFullYear() + '/' +
//     (month<10 ? '0' : '') + month + '/' +
//     (day<10 ? '0' : '') + day;
// var x = new Date(output +' 7:00:00').getTime();
// var y = new Date(output +' 11:30:00').getTime();

// // time of second timespan
// var a = new Date(output +' 11:31:00').getTime();
// var b = new Date(output +' 19:00:00').getTime();

// var c = new Date().getTime();

// if (c >= x && c <= y) {
//     document.getElementById("menu_utama_malamTombol").disabled = true;
// }
// else if(c >= a && c <= b)
// {
//   document.getElementById("menu_utama_siangTombol").disabled = true;
//   document.getElementById("menu_utama_malamTombol").disabled = false;
// }
// else{
// document.getElementById("menu_utama_siangTombol").disabled = true;
// document.getElementById("menu_utama_malamTombol").disabled = true; 
// }

});//tutup function ready