var notifCount = 0;
var nofiyUI = mp.browsers.new("package://RageV/Browsers/Notify/html/index.html");

mp.events.add(
{
	"ReceiveNotification": (message, type, time, layout) => 
	{
		if(nofiyUI != null) {
			notifCount++;
			nofiyUI.execute("Browser_DisplayNotification('"+ message +"', "+ time +", '"+ type +"', '"+ layout +"')");
		
		}
		else {
			nofiyUI = mp.browsers.new("package://RageV/Browsers/Notify/html/notif.html");
			mp.events.call("ReceiveNotification", message, type, time, layout);
		}
	},
	"DisplayingComplete": () => 
	{
		if(nofiyUI == null) return;

		notifCount--;
		if (notifCount < 1) {
			nofiyUI.destroy;
			nofiyUI = null;
		}
	}
});