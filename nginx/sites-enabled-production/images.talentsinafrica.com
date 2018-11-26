server {

  listen 80;
  listen [::]:80;
  server_name images.talentsinafrica.com;
  access_log /var/log/nginx/images.talentsinafrica.log;
  charset utf-8;
  return 302 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name images.talentsinafrica.com;

  include snippets/ssl-params.conf;

  ssl_certificate /etc/letsencrypt/live/talentsinafrica.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/talentsinafrica.com/privkey.pem;

  location / {
    #allow 41.218.242.221;
    #allow 197.221.87.18;
    #allow 41.57.208.23;

    #deny all;

    if ($request_method ~* "(GET|POST|OPTIONS)") {
      add_header "Access-Control-Allow-Origin"  *;
    }

     if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';

        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        #
        # Tell client that this pre-flight info is valid for 20 days
        #
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
     }

     if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
     }

    proxy_pass http://imageserver:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}