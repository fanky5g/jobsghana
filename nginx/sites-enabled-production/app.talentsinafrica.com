server {
  listen 80;
  listen [::]:80;
  server_name app.talentsinafrica.com;
  if ($host != "app.talentsinafrica.com") {
      return 444;
  }
  access_log /var/log/nginx/talentsinafrica.log;
  charset utf-8;
  return 302 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name app.talentsinafrica.com;
  if ($host != "app.talentsinafrica.com") {
      return 444;
  }

  include snippets/ssl-params.conf;
  
  ssl_certificate /etc/letsencrypt/live/talentsinafrica.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/talentsinafrica.com/privkey.pem;

  location / {
    #allow 41.218.242.221;
    #allow 197.221.87.18;
    #allow 41.57.208.23;

    #deny all;
    
    # Simple requests
    if ($request_method ~* "(GET|POST)") {
      add_header "Access-Control-Allow-Origin"  *;
    }

    # Preflighted requests
    if ($request_method = OPTIONS ) {
      add_header "Access-Control-Allow-Origin"  *;
      add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
      add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
      return 200;
    }

    proxy_connect_timeout       300;
    proxy_send_timeout          300;
    proxy_read_timeout          300;
    send_timeout                300;

    proxy_max_temp_file_size 0; # don't buffer responses to disk
    proxy_buffering off;

    proxy_pass http://web:5000;
    proxy_pass_request_headers on;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_set_header X-Forwarded-User $http_authorization;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_pass_header Accept;
    proxy_pass_header Server;
    proxy_set_header Authorization $http_authorization;
    proxy_pass_header  Authorization;
  }
}