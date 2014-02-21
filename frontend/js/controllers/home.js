$(document).ready(function initializeClndr() {
  $('#calendar').clndr({
    template: $('#calendar-template').html(),
    events: [
    { date: '2014-01-01', title: 'CLNDR GitHub Page Finished', url: 'http://github.com/kylestetz/CLNDR' }
    ],
    clickEvents: {
      click: function(target) {
        console.log(target);
      },
      onMonthChange: function(month) {
        console.log('you just went to ' + month.format('MMMM, YYYY'));
      }
    },targets: {
      nextButton: 'clndr-next-button',
      previousButton: 'clndr-previous-button',
      nextYearButton: 'clndr-next-year-button',
      previousYearButton: 'clndr-previous-year-button',
      todayButton: 'clndr-today-button',
      day: 'day',
      empty: 'empty'
    },
    doneRendering: function() {
      console.log('this would be a fine place to attach custom event handlers.');
    }
  });
});

function HomeController($scope, $http) {

}
