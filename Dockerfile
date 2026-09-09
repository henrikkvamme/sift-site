FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx index.html pricing.html privacy.html terms.html style.css pricing.js sift-128.png /usr/share/nginx/html/

COPY --chown=nginx:nginx assets/ /usr/share/nginx/html/assets/

COPY --chown=nginx:nginx beta/ /usr/share/nginx/html/beta/

EXPOSE 8080
