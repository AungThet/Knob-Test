  var defaultSetting  =   {
            "borderColor":'#2a3036',
            "initial":0,
            "borderBackground":'#f1f1f1',
            "lineWidth": 17,
            "background":'#fff',
            "start":0,
            "end":100,
            "duration":50
        };

        scope.container         = ele[0];
        var canvas              = ele.children()[0];
        var color               = canvas.getAttribute('borderColor') || defaultSetting.borderColor;
        var borderBackground    = canvas.getAttribute('borderBackground') || defaultSetting.borderBackground;
        var deg                 = Math.PI/180;
        var context             = canvas.getContext('2d');
        var lineWidth           = parseInt(canvas.getAttribute('weight')) || defaultSetting.lineWidth; 
        scope.radius            = parseInt(canvas.getAttribute('radius'));
        var ratio               = 1;
        scope.flag              = true;
        scope.input             = ele.children()[1];
        scope.centerX           = 0;
        scope.centerY           = 0;
        scope.duration          = parseInt(canvas.getAttribute('duration')) || defaultSetting.duration;
        scope.limitStart        = parseInt(canvas.getAttribute('start')) || defaultSetting.start;
        scope.limitEnd          = parseInt(canvas.getAttribute('end')) || defaultSetting.end;

        scope.oldpercentage     = 0;
        scope.percentage        = parseInt(canvas.getAttribute('initial')) - scope.limitStart || defaultSetting.initial;

        scope.container.style.display     = 'block';
        scope.container.style.position    = 'relative';

        canvas.style.width          = '100%';
        canvas.style.background     = canvas.getAttribute('background') || defaultSetting.background;

        scope.input.style.position        = 'absolute';
        scope.input.style.border          = 'none';
        scope.input.style.textAlign       = 'center';
        scope.input.style.background      = 'transparent';

        scope.calculate = function(){
            context.lineWidth       = lineWidth;

            ratio  = 300/canvas.offsetWidth;
            scope.radius = scope.radius || (canvas.offsetHeight/2-context.lineWidth);

            scope.input.style.width       = 50 / ratio +'px';
            scope.input.style.height      = 40 / ratio +'px';
            scope.input.style.fontSize    = 18 / ratio + 'px';
            scope.input.style.top         = canvas.offsetHeight/2 - scope.input.offsetHeight/2 +"px";
            scope.input.style.left        = canvas.offsetWidth/2 - scope.input.offsetWidth/2 +"px";

            scope.centerX = canvas.offsetWidth*ratio / 2;
            scope.centerY = canvas.offsetHeight*ratio / 2;

        };

        scope.drawBackground = function(){
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(scope.centerX, scope.centerY, scope.radius, 0, 2 * Math.PI, false);
            context.strokeStyle = borderBackground;
            context.stroke();
        };

        scope.drawSection = function (){
            if(scope.flag){          
                scope.calculate();
                scope.drawBackground();
                context.strokeStyle = color;
                var startDeg = -90 * deg;
                var endDeg = (-90 + scope.angle) * deg;
                scope.interval(startDeg, endDeg, 50);
            }
            else {
                 scope.calculate();
                 scope.drawBackground();
                 context.beginPath();
                 context.arc(scope.centerX, scope.centerY, scope.radius, -90 * deg, (-90+ scope.angle) * deg, false);
                 context.strokeStyle = color;
                 context.stroke();
         }

     };

     scope.getInterval = function(){
        var interval = 0;
        if(scope.limitStart * scope.limitEnd > 1){
                // both positive or negative
                if(scope.limitStart >= 0){
                    //both positive
                    if(scope.limitStart >= scope.limitEnd){
                        interval = scope.limitStart - scope.limitEnd;
                    }
                    else {
                        interval = scope.limitEnd - scope.limitStart;
                    }
                }
                else {
                    //both negative
                    if(scope.limitStart >= scope.limitEnd){
                        interval = scope.end - scope.limitStart;
                    }
                    else {
                        interval = scope.limitStart - scope.limitEnd;
                    }
                }
            }
            else {
                // one is negative
                interval = Math.abs(scope.limitStart) + Math.abs(scope.limitEnd);
            }

            return interval;
        };

        scope.degreeToPercent = function (deg) {
            return Math.floor((deg/360)*scope.getInterval()+0.5);
        };

        scope.percentToDegree = function (per){
            return Math.floor(per/scope.getInterval()*360+0.5);
        };

        scope.interval = function(startDeg, endDeg, time){
            var now = (new Date()).getTime();
            var end = now + time;
            console.log(scope.oldpercentage+" interval oldpercentage");
            console.log(scope.percentToDegree(scope.oldpercentage)+" interval oldpercentage degree");
            var startAngle = scope.percentToDegree(scope.oldpercentage);
            var endAngle = scope.percentToDegree(scope.percentage);
            var diff = endAngle - startAngle;
            var sector = diff/time;
            var angle = startAngle;
            if(timer){
                clearInterval(timer);
            }
            var timer = setInterval(function(){
                if(Math.abs(Math.floor(angle - endAngle)) < Math.ceil(Math.abs(2*sector))) 
                    clearInterval(timer);
                now = (new Date()).getTime();
                angle += sector;
                scope.drawBackground();
                context.strokeStyle = color;
                context.beginPath();
                context.arc(scope.centerX, scope.centerY, scope.radius, startDeg , (-90 + angle) * deg, false);
                context.stroke();   
                scope.input.value = scope.percentage + scope.limitStart;
            }, 10);
            scope.flag = false;
        };

        scope.doClick = function(e){
            scope.oldpercentage = scope.percentage;
            console.log(scope.oldpercentage+" oldpercentage");
            var mouseX      = e.offsetX*ratio,
            mouseY      = e.offsetY*ratio,
            sideX       = (scope.centerX - mouseX)*-1,
            sideY       = scope.centerY - mouseY,
            diffX       = Math.abs(scope.centerX - mouseX),
            diffY       = Math.abs(scope.centerY - mouseY),
            mouseDist   = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)),
            side        = '';

            if(sideX>=0){
                side += 'Right';
            }
            else {
                side += 'Left';
            }
            if(sideY>=0) {
                side += 'Top';
            }
            else {
                side += 'Bottom';
            }

            if(mouseDist > scope.radius-context.lineWidth/2 && mouseDist<(scope.radius + context.lineWidth/2)){

                var hypo = mouseDist, opposite, angle;

                if(side === 'RightTop'){             
                    opposite = diffX, angle = Math.asin(opposite/hypo)/deg;
                }
                else if(side === 'RightBottom') {
                    opposite = diffY, angle = Math.asin(opposite/hypo)/deg + 90;
                }
                else if(side === 'LeftBottom') {
                    opposite = diffX, angle = Math.asin(opposite/hypo)/deg + 180;
                }
                else if(side === 'LeftTop') {
                    opposite = diffY, angle = Math.asin(opposite/hypo)/deg + 270;
                }

                scope.angle = angle;
                scope.percentage = scope.degreeToPercent(angle);
                scope.flag = true;
                scope.$digest();
                scope.input.value = scope.percentage + scope.limitStart;

            }
        };

        ele.children().on('keydown', function(e){
            scope.flag = false;
            if(e.which === 38){//up
                scope.percentage = scope.percentage < scope.getInterval() ? scope.percentage + 1 : scope.percentage;
                scope.$digest();
                scope.input.value = scope.percentage + scope.limitStart;
            }
            else if(e.which === 40){//down
                scope.percentage = scope.percentage > 0 ? scope.percentage - 1 : scope.percentage;
                scope.$digest();
                scope.input.value = scope.percentage + scope.limitStart;
            }
            else if(e.which === 13){
                scope.percentage = scope.input.value - scope.limitStart;
                scope.$digest();
            }
            
        });

        ele.on('click', function(e){
            scope.doClick(e);
        });

        window.onresize = function(e){
            scope.drawSection();
        };
    }


    ctrl($scope) {
     $scope.$watch('percentage', function(newValue, oldValue){

        if(newValue >= 0 && newValue <= $scope.getInterval()){
            $scope.flag = false;
            $scope.angle = $scope.percentToDegree(newValue);
            $scope.drawSection();
            $scope.input.value = $scope.percentage - $scope.limitStart;
        }
    });
 }