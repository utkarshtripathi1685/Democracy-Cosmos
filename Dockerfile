FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY engine-utils.js /usr/share/nginx/html/engine-utils.js
COPY election-core.js /usr/share/nginx/html/election-core.js
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
