FROM node:16.15.0-alpine

WORKDIR /usr/src/app

EXPOSE 4201

COPY ./clientlibs/js ./clientlibs/js
COPY ./types ./types

WORKDIR /usr/src/app/types
# RUN echo pwd > pwd.txt
RUN ["npm", "ci"]

WORKDIR /usr/src/app/clientlibs/libTesters/client-lib-tester-frontend

# ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["npm", "run", "start:install"]