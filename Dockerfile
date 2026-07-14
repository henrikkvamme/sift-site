FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY --chown=nginx:nginx index.html privacy.html terms.html style.css sift-128.png /usr/share/nginx/html/

EXPOSE 8080
