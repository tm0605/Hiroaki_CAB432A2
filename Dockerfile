FROM node:erbium

COPY . /src

# Set work directory to /src
WORKDIR /src

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
