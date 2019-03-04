ARG VERSION=v0.24.0
FROM gcr.io/k8s-skaffold/skaffold:${VERSION}
COPY --from=golang:1.12 /usr/local/go /usr/local/go
RUN apt-get -y update && \
  apt-get -y install \
  git \
  libcurl4-openssl-dev \
  apt-transport-https \
  ca-certificates \
  curl \
  make \
  software-properties-common && \
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
  apt-key fingerprint 0EBFCD88 && \
  add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  xenial \
  edge" && \
  apt-get -y update && \
  apt-get -y install docker-ce=5:18.09.0~3-0~ubuntu-xenial
ENV PATH /usr/local/go/bin:/go/bin:$PATH
ENV GOPATH /go/
