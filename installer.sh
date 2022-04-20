#!/usr/bin/env bash
# https://github.com/MSFPT/Snow

USER=$(whoami)
OT="  \e[1m[\e[5m\a*\e[0;m\e[1m]"
 
chsys(){ if [[ $(uname -o) == 'Android' ]];then printf "\e[0;m\n$OT This is not supported in Termux \n\e[0;m\n";exit; fi }
chroot(){ if [[ $USER != 'root' ]];then printf "\e[0;m\n$OT Please run this file with higher access\n\n -> ( permission denied )\n\e[0;m\n";exit; fi }
TryExcept(){ if [[ $? != 0 ]];then $1 ; fi }
ERR(){ printf "\r\n$OT Error\n\n\e[0;m"; exit; }

install_ruby () {
  echo -en "\e[0;m\r$OT Installing Ruby . . . ";sleep 1.273
  apt install ruby -y > /dev/null 2>&1
  sleep .2
  echo -en "\r$OT Installed Ruby        ";sleep .7
}

install_php () {
  echo -en "\e[0;m\r$OT Installing PHP . . .  ";sleep 1.273
  apt install php -y > /dev/null 2>&1
  sleep .2
  echo -en "\r$OT Installed PHP         ";sleep .7
}

install_bundler () {
  echo -en "\e[0;m\r$OT Installing Bundler . . .   ";sleep 1.273
  gem install bundler > /dev/null 2>&1
  sleep .2
  echo -en "\r$OT Installed Bundler                ";sleep .7
}

check_ruby () {
  ruby -v > /dev/null 2>&1
  TryExcept install_ruby
}

check_php () {
  php -v > /dev/null 2>&1
  TryExcept install_ruby
}

check_bundler () {
  bundle -v > /dev/null 2>&1
  TryExcept install_bundler
}

main () {
  echo
  chsys && chroot
  echo -en "\e[0;m\r$OT Check Install Ruby . . .             ";sleep .9834
  check_ruby
  echo -en "\e[0;m\r$OT Check Install PHP . . .              ";sleep .9834
  check_php
  echo -en "\e[0;m\r$OT Check and Install Ruby-Sqlite3 . . . ";sleep .9834
  apt install ruby-sqlite3 > /dev/null 2>&1
  TryExcept ERR
  echo -en "\e[0;m\r$OT Check Install Bundler . . .          ";sleep .9834
  check_bundler
  echo -en "\e[0;m\r$OT Bundling Gems . . .                  ";sleep .9834
  gem install sqlite3 > /dev/null 2>&1
  bundle install > /dev/null 2>&1
  TryExcept ERR
  sleep .2
  echo -en "\r$OT Installed Snow                         \n\n";sleep .2

}

trap '' 2
  clear && main