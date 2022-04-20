$.ajax({
  url: window.location.origin,
  type: 'POST',
  data: {
    'Status': 'default',
    'OS Name': Snower.os.Name,
    'OS Version': Snower.os.Version,
    'CPU Core': Snower.cpuCore,
    'Browser Name': Snower.browser.Name,
    'Browser Version': Snower.browser.Version,
    'Browser Major Version': Snower.browser.MajorVersion,
    'Cookies': Snower.cookieEnabled,
    'Mobile': Snower.Mobile(),
    'Resolution': Snower.Resolution(),
    'Language': Snower.language,
    'Time Zone': Snower.timeZone ,
  },
  success:function(response){ return false; },
  error:function(){ return false; }
});

/* https://github.com/MSFPT/Snow */