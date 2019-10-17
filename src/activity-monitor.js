/** @file src/activity-monitor.js */

(function($) {

	namespace('App.Common', {
		ActivityMonitor: ActivityMonitor
	});
	
	function ActivityMonitor(timeout) {
		
		var onInactivityDetected = App.Event.Event();
		var timer = null;
		
		function onTimerExpired() {
			
			var lastActivity = Number(localStorage.getItem('lastActivity'));
			var now = Date.now();
			
			console.log('timer expired', Math.floor((now - lastActivity) / 1000));
			if (now - lastActivity >= timeout) {
				onInactivityDetected.trigger(self);
				stop();
				return;
			}
			
			timer = setTimeout(onTimerExpired, timeout); 
		}
		
		function activityCaptured(e) {
			localStorage.setItem('lastActivity', Date.now());
			clearTimeout(timer);
			timer = setTimeout(onTimerExpired, timeout);
		}
		
		function start() {
			console.log('starting activity monitor');
			document.addEventListener('click', activityCaptured, true);
			document.addEventListener('scroll', activityCaptured, true);
			document.addEventListener('keydown', activityCaptured, true);
			timer = setTimeout(onTimerExpired, timeout); 
		}
		
		function stop() {
			console.log('stopping activity monitor');
			document.removeEventListener('click', activityCaptured, true);
			document.removeEventListener('scroll', activityCaptured, true);
			document.removeEventListener('keydown', activityCaptured, true);
			onInactivityDetected.unsubscribeAll();
			clearTimeout(timer);
		}
		
		return {
			start: start,
			stop: stop,
			onInactivityDetected: onInactivityDetected.getEventSubscriber()
		}
	}
	
} (jQuery))
