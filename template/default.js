/* Coded By https://github.com/msfpt */

import { $data } from "./data.js";

document.addEventListener('DOMContentLoaded', event => {

  const Data = new $data();

  $.ajax({
    url: location.origin,
    type: 'POST',
    data: {
      'Status': 'default',
      'OS Name': Data.getOS().name,
      'OS Version': Data.getOS().version,
      'CPU Core': Data.getCpuCore(),
      'Browser Name': Data.getBrowser().name,
      'Browser Version': Data.getBrowser().version,
      'Browser Major Version': Data.getBrowser().majorVersion,
      'Cookies': Data.getBrowser().isCookieEnabled,
      'Mobile': Data.isMobile(),
      'Resolution': Data.getResolution(),
      'Language': Data.getLanguage(),
      'Time Zone': Data.getTimeZone(),
    }
  });

})