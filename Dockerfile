FROM node:10.21.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser --disabled-password app
COPY . .
RUN chown -R app:app /opt/app
USER app
RUN npm install
EXPOSE 3000
CMD [ "node", "app.js" ]