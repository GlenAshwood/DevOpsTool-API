FROM node:10.21.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser --disabled-password app
COPY . .
RUN chown -R app:app /opt/app
RUN npm install pm2 -g
USER app
RUN npm install
EXPOSE 3000 8000 8080 80 443
CMD [ "pm2-runtime", "app.js" ]