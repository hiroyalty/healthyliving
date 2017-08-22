$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
  //$(function () {
   // $('#datetimepicker1').datetimepicker();
  //});

  var date_input=$('input[name="date"]'); //our date input has the name "date"
  var expired_date=$('input[name="expireddate"]');
  var upexpired_date=$('input[name="upexpireddate"]');
  var container=$('.mypage form').length>0 ? $('.mypage form').parent() : "body";
  var d = new Date();
  var e = new Date();
  d.setDate(d.getDate() - 6570);
  e.setDate(e.getDate() + 0);
  date_input.datepicker({
    format: 'mm/dd/yyyy',
    endDate: d,
    container: container,
    todayHighlight: true,
    autoclose: true,
  })
  expired_date.datepicker({
    format: 'mm/dd/yyyy',
    startDate: e,
    todayHighlight: true,
    autoclose: true,
  })
  upexpired_date.datepicker({
    format: 'mm/dd/yyyy',
    startDate: e,
    todayHighlight: true,
    autoclose: true,
  })
  
});
