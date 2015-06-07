var InteractiveController = {
    MILLISECONDS_IN_A_DAY:  24 * 60 * 60 * 1000,
    DAYS_IN_THE_PAST: 500,
    DAYS_IN_PAST_FOR_DEFAULT: 6,
    MAX_RANGE: 365,
    MIN_RANGE: 2,
    DAYS_FROM_PRESENT: 7,
    slider: null,
    clients: [],
    startDate: null,
    endDate: null,
    isCrime: true,

    toggle: function() {
        this.isCrime = !this.isCrime;

        // daterangepicker has a bad bug that only sometimes presents and that cuases it to lose its date setting
        // this should be an ugly but functional workaround.
        this.slider.data('daterangepicker').setStartDate(this.startDate);
        this.slider.data('daterangepicker').setEndDate(this.endDate);
        for (var i = 0; i < this.clients.length; i++)
            this.clients[i](this.slider.data('daterangepicker').startDate.toDate(), 
                            this.slider.data('daterangepicker').endDate.toDate(),
                            this.isCrime);
    },

    setup: function() {
        var MILLISECONDS_IN_THE_PAST = this.DAYS_IN_THE_PAST * this.MILLISECONDS_IN_A_DAY;
        var MILLISECONDS_IN_THE_PAST_DEFAULT = this.DAYS_IN_PAST_FOR_DEFAULT * this.MILLISECONDS_IN_A_DAY;

        console.log('bla');
        $('#slider span').html(moment().subtract(this.DAYS_FROM_PRESENT + this.DAYS_IN_PAST_FOR_DEFAULT, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(this.DAYS_FROM_PRESENT, 'days').format('MMMM D, YYYY'));

        this.slider = $("#slider").daterangepicker({
            minDate: moment().subtract(this.DAYS_IN_THE_PAST, 'days'),
            maxDate: moment().subtract(this.DAYS_FROM_PRESENT, 'days'),
            startDate: moment().subtract(this.DAYS_FROM_PRESENT + this.DAYS_IN_PAST_FOR_DEFAULT, 'days'),
            endDate: moment().subtract(this.DAYS_FROM_PRESENT, 'days'),
            timePicker: false,
            dateLimit: {days: this.MAX_RANGE},
            showDropdowns: true,
            opens: 'right',
            ranges: {
               'Last Week': [moment().subtract('days', 13), moment().subtract('days', 7)],
               'Last 30 Days': [moment().subtract('days', 36), moment().subtract('days', 7)],
               'Previous Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
        });

        // daterangepicker has a bad bug that only sometimes presents and that cuases it to lose its date setting
        // this should be an ugly but functional workaround. 
        this.startDate = moment().subtract(this.DAYS_FROM_PRESENT + this.DAYS_IN_PAST_FOR_DEFAULT, 'days');
        this.endDate = moment().subtract(this.DAYS_FROM_PRESENT, 'days');
        this.slider
            .on('apply.daterangepicker', function() {
                this.startDate = this.slider.data('daterangepicker').startDate;
                this.endDate = this.slider.data('daterangepicker').endDate;
                $('#slider span').html(this.startDate.format('MMMM D, YYYY') + ' - ' + this.endDate.format('MMMM D, YYYY'))
                this.update();
            }.bind(this));
    },

    addClient: function(clientFunction) {
        this.clients.push(clientFunction);
        // daterangepicker has a bad bug that only sometimes presents and that cuases it to lose its date setting
        // this should be an ugly but functional workaround.
        this.slider.data('daterangepicker').setStartDate(this.startDate);
        this.slider.data('daterangepicker').setEndDate(this.endDate);

        clientFunction(this.slider.data('daterangepicker').startDate.toDate(), 
                       this.slider.data('daterangepicker').endDate.toDate(),
                       this.isCrime);
    },

    update: function() {
        // daterangepicker has a bad bug that only sometimes presents and that cuases it to lose its date setting
        // this should be an ugly but functional workaround.
        this.slider.data('daterangepicker').setStartDate(this.startDate);
        this.slider.data('daterangepicker').setEndDate(this.endDate);

        for (var i = 0; i < this.clients.length; i++)
            this.clients[i](this.slider.data('daterangepicker').startDate.toDate(), 
                            this.slider.data('daterangepicker').endDate.toDate(),
                            this.isCrime);
    }

}


$().ready(function () {
    console.log('boo');
    missionControl = Object.create(InteractiveController);
    missionControl.setup(); 
});