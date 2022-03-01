FROM node:12-slim
WORKDIR /home/src/app
# add app
COPY . ./

RUN npm install --silent

# start app
CMD ["npm", "run", "start:staging"]
