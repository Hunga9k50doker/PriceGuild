FROM node:12-slim
WORKDIR /home/src/app
# add app
COPY . ./

RUN npm install --force

# start app
CMD ["npm", "run", "start:staging"]
