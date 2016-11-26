(function($){

  "use strict";

  var IcyCalendar = function(el, options){

    // calendar to icify
    this.el = $(el);

    var that = this;

    // options
    this.options = options

    //appointment panel state
    this.icyState = { appointmentPanel: {
                        open: false,
                        currentDay: null
                      }
                    }
    // this.init();
    this.el.find('td').on('click', function(e){
      // populateApptPanel(this, animatePanel);
        // toggleApptPanel(e, this);
        window.location =  window.location.pathname + '/' + $(this).data('day-index');
        // $('#appointment-panel').animate({width: 'toggle'});
    });

    // State cases:
    // 1) user clicks cell: populate panel with data and open

    // 2) appt panel open for given date, user clicks same date: close panel

    // 3) appt panel open for given date, user clicks different date: close panel
    // populate panel w/ new date info, open panel

    function toggleApptPanel(e, el){
      // jqueryfied td element that was clicked
      var $el = $(el);

      // case 1)

      // if appt panel not open, populate panel with date info and open
      if(!that.icyState.appointmentPanel.open) {
        populateApptPanel($el);
        $('#appointment-panel').animate({width: 'toggle'});
        that.icyState.appointmentPanel.open = true;
        that.icyState.currentDay = $el.data('day-index');
      } else { //appt panel is open
        // case 3)
        if(that.icyState.currentDay != $el.data('day-index')){
          $('#appointment-panel').animate({width: 'toggle'}, function(){
            populateApptPanel($el);
            that.icyState.currentDay = $el.data('day-index');
            $('#appointment-panel').animate({width: 'toggle'});
          });
        }else{ //case 2)
          $('#appointment-panel').animate({width: 'toggle'});
          that.icyState.appointmentPanel.open = false;
        }
      }

    }

    function populateApptPanel(el){
      $('#appointment-panel').html(el.data('day-index'));
    }
  }

  // IcyCalendar.prototype = {
  //   constructor: IcyCalendar,

  //   init: function(){
  //     this.el.find('td').on('click', function(){
  //     // populateApptPanel(this, animatePanel);
  //       IcyCalendar.prototype.toggleApptPanel();
  //       // $('#appointment-panel').animate({width: 'toggle'});
  //     });
  //   },

  //   toggleApptPanel: function(){
  //     alert(this.icyState.appointmentPanel.open);
  //     // this.icyState.appointmentPanel.open = !this.appointmentPanel
  //     // $('#appointment-panel').animate({width: 'toggle'});

  //   }
  // };
  // //basic jquery plugin
  // $.fn.greenify = function() {
  //   this.css( "color", 'green' );
  //   this.on('click', function(){
  //     alert('test');
  //   });
  //   return this;
  // };

  $.fn.icify = function() {
    this.icyCalendar = new IcyCalendar(this);

    // this.find('td').on('click', function(){
    //   populateApptPanel(this, animatePanel);
    // });

    return this;
  };

  // function animatePanel(){
  //   $('#appointment-panel').animate({width: 'toggle'});
  // }

  // function populateApptPanel(dayCell, callback){
  //   $('#appointment-panel').append('foobar<br/>')
  //   callback();
  // };

})(jQuery);