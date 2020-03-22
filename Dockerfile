FROM node:12 AS builder

COPY package.json yarn.lock tsconfig.json ./
RUN yarn --pure-lockfile

COPY . ./

ENV NODE_ENV=production
RUN yarn build


FROM nginx


COPY --from=builder build /usr/share/nginx/html


COPY nginx.conf /etc/nginx/nginx.conf
RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
