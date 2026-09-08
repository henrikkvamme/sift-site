FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY --chown=nginx:nginx index.html pricing.html privacy.html terms.html style.css pricing.js sift-128.png /usr/share/nginx/html/

COPY --chown=nginx:nginx assets/ /usr/share/nginx/html/assets/

EXPOSE 8080
