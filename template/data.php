<?php

  /* Coded By https://github.com/msfpt */

  $full_url = "$_SERVER[HTTP_X_FORWARDED_PROTO]://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

  function getIP(){ // IP
    if (!empty($_SERVER['HTTP_CLIENT_IP'])){
      return $_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else {
      return $_SERVER['REMOTE_ADDR'];
    }
  }
  
  function getReferer(){ // Referer
    if (isset($_SERVER['HTTP_REFERER'])) { return $_SERVER['HTTP_REFERER']; }
    else { return 'Unknown'; }
  }

  function getOS() { // OS
      $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
      $os_platform =   "Unknown";
      $os_array =   array(
        '/windows nt 10/i'      =>  'Windows 10',
        '/windows nt 6.3/i'     =>  'Windows 8.1',
        '/windows nt 6.2/i'     =>  'Windows 8',
        '/windows nt 6.1/i'     =>  'Windows 7',
        '/windows nt 6.0/i'     =>  'Windows Vista',
        '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
        '/windows nt 5.1/i'     =>  'Windows XP',
        '/windows xp/i'         =>  'Windows XP',
        '/windows nt 5.0/i'     =>  'Windows 2000',
        '/windows me/i'         =>  'Windows ME',
        '/win98/i'              =>  'Windows 98',
        '/win95/i'              =>  'Windows 95',
        '/win16/i'              =>  'Windows 3.11',
        '/macintosh|mac os x/i' =>  'Mac OS X',
        '/mac_powerpc/i'        =>  'Mac OS 9',
        '/linux/i'              =>  'Linux',
        '/ubuntu/i'             =>  'Ubuntu',
        '/iphone/i'             =>  'iPhone',
        '/ipod/i'               =>  'iPod',
        '/ipad/i'               =>  'iPad',
        '/android/i'            =>  'Android',
        '/blackberry/i'         =>  'BlackBerry',
        '/webos/i'              =>  'Mobile',
      );
    
      foreach ( $os_array as $regex => $value ) { 
        if ( preg_match($regex, $user_agent ) ) {
          $os_platform = $value;
        }
      }   
    return $os_platform;
  }
    
  function getBrowser() { // Browser
      $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
      $browser        = "Unknown";
      $browser_array  = array(
        '/msie/i'       =>  'Internet Explorer',
        '/firefox/i'    =>  'Firefox',
        '/safari/i'     =>  'Safari',
        '/chrome/i'     =>  'Chrome',
        '/edge/i'       =>  'Edge',
        '/opera/i'      =>  'Opera',
        '/netscape/i'   =>  'Netscape',
        '/maxthon/i'    =>  'Maxthon',
        '/konqueror/i'  =>  'Konqueror',
        '/mobile/i'     =>  'WebView'
      );
    
      foreach ( $browser_array as $regex => $value ) { 
        if ( preg_match( $regex, $user_agent ) ) {
          $browser = $value;
        }
      }
    return $browser;
  }
  
?>