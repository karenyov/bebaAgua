var alarmName = 'myAlarm';
var periodInMinutes = null;

function checkAlarm(callback) {
    chrome.alarms.getAll(function (alarms) {
        var hasAlarm = alarms.some(function (a) {
            periodInMinutes = a.periodInMinutes;
            return a.name == alarmName;
        });
        var newLabel = hasAlarm ? 'Ativar' : 'Desativar';
        activeLabel(newLabel);
        if (callback) callback();
    });
}

function activeLabel(active) {
    if (active == 'Ativar') {
        $('#toggleAlarm').html('Desativar');
        $('#toggleAlarm').css("background-color", "#dd4c35");
    } else {
        $('#toggleAlarm').html('Ativar');
        $('#toggleAlarm').css("background-color", "#56bc4d");
    }
}

function createAlarm(data) {
    var time = $('#time').val();
    time = time.split(':');
    var minutes = (+time[0]) * 60 + (+time[1]);

    chrome.alarms.create(alarmName, {
        periodInMinutes: parseInt(minutes)
    });
}
function cancelAlarm() {
    chrome.alarms.clear(alarmName);
}

function setAlarmDigital() {
    if (periodInMinutes != null) {
        var hours = Math.floor(periodInMinutes / 60);          
        var minutes = periodInMinutes % 60;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        $('#alarm_digital').html(hours + ':' + minutes);
    }
}

$(document).ready(function () {
    var time_default = "01:30";
    $('#time').val(time_default);

    $('#toggleAlarm').click(function () {
        var ativar = $('#toggleAlarm').html();
        if (ativar == 'Ativar') {
            var data = { time: $('#time').val()};
            createAlarm(data);
        } else {
            cancelAlarm();
        }
        activeLabel(ativar);
    });

    $('#btn_default').click(function () { //onclick button Default Config
        $('#time').val(time_default);  
    });

    $('#myForm').submit(function (e) {
        e.preventDefault();
        var data = { time: $('#time').val() };

        checkAlarm(function (hasAlarm) {
            if (hasAlarm) {
                cancelAlarm();
            } else {
                createAlarm(data);
            }
            checkAlarm(function() {
                setAlarmDigital();
            });
        });
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        chrome.notifications.create('myAlarm', {
            type: 'basic',
            iconUrl: 'img/icon128.png',
            title: 'Não Esqueça!',
            message: 'Hora de beber Água!'
         }, function(notificationId) {});
    });

    checkAlarm(function() {
        setAlarmDigital();
    });

    if (periodInMinutes != null)
        setAlarmDigital();
});
