$('#switcher_checkbox_1').click(function(){
  $(this).prop('checked') ? mp.trigger('Set', 'engine', 'true') : mp.trigger('Set', 'engine', 'false')
});

$('#switcher_checkbox_2').click(function(){
  $(this).prop('checked') ? mp.trigger('Set', 'lights', 'true') : mp.trigger('Set', 'lights', 'false');
});

$('#switcher_checkbox_3').click(function(){
  $(this).prop('checked') ? mp.trigger('Set', 'seatbelt', 'true') : mp.trigger('Set', 'seatbelt', 'false');
});

var elements = document.querySelectorAll("#driver, #seconddoor, #thirddoor, #fourthdoor, #trunk, #hood"), door;  

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
   
      switch(this.id) {
    case 'driver':
      door = 0;
      break;
    case 'trunk':
      door = 5;
      break;
    case 'hood': 
      door = 4;
      break;
    case 'thirddoor':
      door = 2;
      break;
    case 'seconddoor':
      door = 3;
      break;
    case 'fourthdoor':
      door = 1;
   }
   mp.trigger('doorControl', door)
    });

    elements[i].addEventListener("mouseover", function() {
        document.getElementById(this.id).setAttribute("src", './backend/img/arrow_active.png')
    })

    elements[i].addEventListener("mouseout", function() {
        document.getElementById(this.id).setAttribute("src", './backend/img/arrow.png')
    })
  }