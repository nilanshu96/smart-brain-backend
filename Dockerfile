FROM node:12

WORKDIR /usr/src/smart-brain-backend

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]