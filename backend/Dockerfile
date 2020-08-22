FROM node:12

WORKDIR /app/backend

COPY ./ ./

RUN yarn

RUN yarn tsc --noEmit

CMD yarn start

