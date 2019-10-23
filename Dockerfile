FROM nginx:1.13.6
COPY ./dist /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 8090
CMD ["nginx","-g","daemon off;"]
