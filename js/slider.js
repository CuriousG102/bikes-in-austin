var InteractiveController = {
    MILLISECONDS_IN_A_DAY:  24 * 60 * 60 * 1000,
    DAYS_IN_THE_PAST: 500,
    DAYS_IN_PAST_FOR_DEFAULT: 6,
    MAX_RANGE: 30,
    MIN_RANGE: 2,
    DAYS_FROM_PRESENT: 7,
    slider: null,
    clients: [],
    startDate: null,
    endDate: null,

    setup: function() {
        var MILLISECONDS_IN_THE_PAST = this.DAYS_IN_THE_PAST * this.MILLISECONDS_IN_A_DAY;
        var MILLISECONDS_IN_THE_PAST_DEFAULT = this.DAYS_IN_PAST_FOR_DEFAULT * this.MILLISECONDS_IN_A_DAY;

        console.log('bla');
        $('#slider span').html(moment().subtract(this.DAYS_FROM_PRESENT + this.DAYS_IN_PAST_FOR_DEFAULT, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(this.DAYS_FROM_PRESENT, 'days').format('MMMM D, YYYY'));
    }

}


$().ready(function () {
    console.log('boo');
    missionControl = Object.create(InteractiveController);
    missionControl.setup(); 
});