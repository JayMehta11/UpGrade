FROM node:16.15.0-alpine

# WORKDIR /usr/src/app/clientlibs/js

COPY ./../js ./user/src/app/clientlibs/js

WORKDIR /usr/src/app/types
# COPY ./../../../types ./types
# RUN echo pwd > pwd.txt
# RUN ["npm", "ci"]

WORKDIR /usr/src/app/clientlibs/libTesters/client-lib-tester-frontend

EXPOSE 4201
# ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["npm", "run", "start:install"]