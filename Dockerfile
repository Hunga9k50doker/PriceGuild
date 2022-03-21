FROM node:12-slim
WORKDIR /home/src/app
# add app
COPY . ./

# start app
ENTRYPOINT ["sh", "entrypoint.sh"]