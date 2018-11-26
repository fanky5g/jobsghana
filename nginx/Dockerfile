FROM nginx:alpine
ADD sites-enabled/ /etc/nginx/sites-enabled
COPY nginx.conf /etc/nginx/nginx.conf
COPY dhparam.pem /etc/ssl/certs/dhparam.pem

COPY nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY nginx-selfsigned-admin.crt /etc/ssl/certs/nginx-selfsigned-admin.crt
COPY nginx-selfsigned-admin.key /etc/ssl/private/nginx-selfsigned-admin.key

COPY ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY self-signed.conf /etc/nginx/snippets/self-signed.conf
COPY self-signed.conf /etc/nginx/snippets/self-signed-admin.conf